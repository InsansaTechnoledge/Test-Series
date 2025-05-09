import app from '../app.js'
import connectDB from '../database/MongoDB.js'

const PORT = process.env.PORT || 8383

const startServer = async () => {

    await connectDB()

    app.listen(PORT , () => {
        console.log(`server is live at PORT : ${PORT}`)
    })
}

startServer();