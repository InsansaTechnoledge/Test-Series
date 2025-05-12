import express from 'express'
import cors from 'cors'
import routes from '../routes/routes.js'


const app = express()


app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

routes(app);

app.get('/' , (req,res) => {
    res.status(200).json({
        message: 'Welcome to the API'
    });
})

export default app;