const path = require('path');
const fs = require('fs');
const axios = require('axios');
const Database = require('better-sqlite3');
const { app } = require('electron'); // Import Electron's app module
const { clear } = require('console');

class QueueManager {
    constructor(dbPath=path.join(app.getPath('userData'), 'proctorQueue.db'), flushInterval = 5000, batchsize = 5) {
        this.dbPath = dbPath;
        this.flushInterval = flushInterval;
        this.batchsize = batchsize;
        this.db = null;
        this.timer = null;

        this._init();
    };

    _init() {
        // Log the path for debugging purposes
        console.log("Database Path:", this.dbPath);

        const dbExists = fs.existsSync(this.dbPath);
        this.db = new Database(this.dbPath);

        if (!dbExists) {
            this.db.exec(`
                CREATE TABLE IF NOT EXISTS events(
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                data TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )`);
        }
        this._startFlusher();
    }

    _startFlusher() {
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => this.flush(), this.flushInterval);
    }

    addEvent(data) {
        console.log('📥 Adding event to queue:', data);
        const json = JSON.stringify(data);
        this.db.prepare(`INSERT INTO events (data) VALUES (?)`).run(json);
    }

    getPendingEvents(limit = this.batchsize) {
        return this.db.prepare(`SELECT * FROM events ORDER BY id ASC LIMIT ?`).all(limit);
    }

    removeEvents(ids) {
        const placeholders = ids.map(() => '?').join(',');
        this.db.prepare(`DELETE FROM events WHERE id IN (${placeholders})`).run(...ids);
    }

    async flush() {
        try {
            const pending = this.getPendingEvents();
            if (pending.length === 0) return;

            const events = pending.map(e => JSON.parse(e.data));
            const ids = pending.map(e => e.id);

            console.log(`🔄 Flushing ${events.length} events to server...`);

            const response = await axios.post("https://test-series-03sa.onrender.com/api/v1/proctor/emit-event", { events });
            console.log('✅ Events flushed successfully:', response.data);

            if (response.data.status === 200) {
                console.log('✅ Events successfully flushed to server');
                this.removeEvents(ids);
            }

            console.log(`Flushed ${events.length} events to server`);
        } catch (error) {
            console.error('Error flushing events:', error);
        }
    };



    async flushNow(){
    clearInterval(this.timer);
    await this.flush();
}

clearDB(){
    console.log('🗑️ Clearing database...');
    this.db.prepare('DELETE FROM events').run();
    console.log('✅ Database cleared');
}

    close() {
        if (this.timer) clearInterval(this.timer);
        if(this.db)this.db.close();
        console.log('✅ Database connection closed');
    }

};



// Old code (commented out):
// const dbPath = path.join(process.cwd(),'proctorQueue.db');
// this.db = new Database(dbPath);

module.exports = QueueManager;
