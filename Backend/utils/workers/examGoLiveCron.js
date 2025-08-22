// utils/workers/examGoLiveCron.js
import cron from "node-cron";
import { Pool } from "pg";
import fs from "node:fs";
import dotenv from "dotenv";

// Load env: prefer .env.development.local, else .env
dotenv.config({
  path: fs.existsSync(".env.development.local")
    ? ".env.development.local"
    : ".env",
});

if (!process.env.SUPABASE_CONNECTION_STRING) {
  console.error("[go-live-cron] Missing SUPABASE_CONNECTION_STRING env var");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.SUPABASE_CONNECTION_STRING,
  // Add connection timeout and better error handling
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 10000,
});

const LOCK_KEY = 987654321;
let lastRunTime = null;
let consecutiveFailures = 0;

// Helper function to log with timestamp
const log = (message, level = 'info') => {
  const timestamp = new Date().toISOString();
  const prefix = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
};

// Run every 10 seconds instead of every second to reduce load
cron.schedule("*/10 * * * * *", async () => {
  const client = await pool.connect();
  let gotLock = false;
  let beganTx = false;
  const startTime = Date.now();

  try {
    // 1) Leader election (no transaction yet)
    const lockRes = await client.query(
      "SELECT pg_try_advisory_lock($1) AS got",
      [LOCK_KEY]
    );
    gotLock = !!(lockRes.rows[0] && lockRes.rows[0].got);
    
    if (!gotLock) {
      // Only log every minute to avoid spam
      if (!lastRunTime || Date.now() - lastRunTime > 60000) {
        log("Another instance is handling exam go-live", 'warn');
        lastRunTime = Date.now();
      }
      return;
    }

    // 2) First, check if there are exams that should go live
    const checkQuery = `
      SELECT COUNT(*) as count, 
             MIN(scheduled_at) as earliest_due,
             NOW() as current_time
      FROM public.batch_exam
      WHERE go_live = false
        AND scheduled_at IS NOT NULL
        AND scheduled_at <= NOW()
    `;
    
    const checkResult = await client.query(checkQuery);
    const { count, earliest_due, current_time } = checkResult.rows[0];
    
    if (count == 0) {
      // Only log periodically to avoid spam
      if (!lastRunTime || Date.now() - lastRunTime > 300000) { // Every 5 minutes
        log("No exams due for go-live");
        lastRunTime = Date.now();
      }
      return;
    }

    log(`Found ${count} exam(s) due for go-live. Earliest due: ${earliest_due}, Current: ${current_time}`);

    // 3) Do the work in a transaction
    await client.query("BEGIN");
    beganTx = true;

    const updateQuery = `
      WITH due AS (
        SELECT id, name, scheduled_at
        FROM public.batch_exam
        WHERE go_live = false
          AND scheduled_at IS NOT NULL
          AND scheduled_at <= NOW()
        ORDER BY scheduled_at
        FOR UPDATE SKIP LOCKED
        LIMIT 50
      )
      UPDATE public.batch_exam b
      SET go_live = true, 
          updated_at = NOW(),
          status = CASE 
            WHEN status = 'scheduled' THEN 'live' 
            ELSE status 
          END
      FROM due
      WHERE b.id = due.id
      RETURNING b.id, b.name, b.scheduled_at, b.status
    `;

    const { rows: updated } = await client.query(updateQuery);

    await client.query("COMMIT");
    beganTx = false;

    if (updated.length > 0) {
      log(`✅ Set go_live=true for ${updated.length} exam(s):`);
      updated.forEach(exam => {
        log(`   - ${exam.name} (ID: ${exam.id}, scheduled: ${exam.scheduled_at}, status: ${exam.status})`);
      });
      consecutiveFailures = 0;
    } else {
      log("No exams were updated (might be locked by another process)", 'warn');
    }

  } catch (err) {
    consecutiveFailures++;
    if (beganTx) {
      try { 
        await client.query("ROLLBACK"); 
        log("Transaction rolled back");
      } catch (rollbackErr) {
        log(`Rollback failed: ${rollbackErr.message}`, 'error');
      }
    }
    log(`Cron go_live error (failure #${consecutiveFailures}): ${err.message}`, 'error');
    log(`Stack trace: ${err.stack}`, 'error');

    // If too many consecutive failures, exit to restart
    if (consecutiveFailures > 5) {
      log("Too many consecutive failures, exiting...", 'error');
      process.exit(1);
    }
  } finally {
    // 3) Always unlock if we locked
    if (gotLock) {
      try { 
        await client.query("SELECT pg_advisory_unlock($1)", [LOCK_KEY]); 
      } catch (unlockErr) {
        log(`Failed to release advisory lock: ${unlockErr.message}`, 'error');
      }
    }
    // 4) Release exactly once
    try {
      client.release();
    } catch (releaseErr) {
      log(`Failed to release client: ${releaseErr.message}`, 'error');
    }

    const duration = Date.now() - startTime;
    if (duration > 1000) {
      log(`Cron execution took ${duration}ms`, 'warn');
    }
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  log("Shutting down cron job...");
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  log("Shutting down cron job...");
  await pool.end();
  process.exit(0);
});

log("Exam go-live cron job started");