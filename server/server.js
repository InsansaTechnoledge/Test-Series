import app from '../app.js'
import connectDB from '../database/MongoDB.js'
import { connectToSupabase } from '../database/SupabaseDB.js'

const PORT = process.env.PORT || 8383

const startServer = async () => {

    await connectDB();

    await connectToSupabase();

    app.listen(PORT , () => {
        console.log(`server is live at PORT : ${PORT}`)
    })
}

startServer();