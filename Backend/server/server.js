// Fix for missing globalThis.crypto (required by secure cookies/session)
import { webcrypto } from 'crypto';

if (typeof globalThis.crypto === 'undefined') {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto, // ✅ Correct polyfill
    configurable: false,
    enumerable: false,
    writable: false,
  });
}

// ENV CONFIG
import fs from 'fs';
import Dotenv from 'dotenv';

if (fs.existsSync('.env.development.local')) {
  Dotenv.config({ path: '.env.development.local' });
} else {
  // Dotenv.config(); // defaults to `.env`
}

// Optional: Confirm env loaded
console.log('✅ Loaded ENV:');
console.log('  NODE_ENV =', process.env.NODE_ENV);
console.log('  PORT     =', process.env.PORT);
console.log('  CLIENT_URL =', process.env.CLIENT_URL);

// DB Connections
import connectDB from '../database/MongoDB.js';
import { connectToSupabase } from '../database/SupabaseDB.js';

// Scheduled Jobs
import AutoInactive from '../utils/scheduler/organization.scheduler.js';

// Server Port
const PORT = process.env.PORT || 8383;

const startServer = async () => {
  try {
    await connectDB(); // MongoDB
    await connectToSupabase(); // Supabase
    await AutoInactive(); // Background job

    const { default: app } = await import('../config/express.config.js');

    app.listen(PORT, () => {
      console.log(`🚀 Server is live at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
