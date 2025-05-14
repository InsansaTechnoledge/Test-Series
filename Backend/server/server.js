import Dotenv from 'dotenv'
Dotenv.config({path: '.env.development.local'})

import connectDB from '../database/MongoDB.js'
import { connectToSupabase } from '../database/SupabaseDB.js'
import AutoInactive from '../utils/scheduler/organization.scheduler.js'

const PORT = process.env.PORT || 8383

const startServer = async () => {

    await connectDB();

    await connectToSupabase();

    await AutoInactive();

    const { default: app } = await import('../config/express.config.js');

    app.listen(PORT , () => {
        console.log(`server is live at PORT : ${PORT}`)
    })
}

startServer();