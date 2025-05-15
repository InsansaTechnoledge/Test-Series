import express from 'express'
import cors from 'cors'
import routes from '../routes/routes.js'
import cookieParser from 'cookie-parser';
import passport from '../utils/PassportAuth/Passport.js';
import passportsessionMiddleware from '../utils/PassportAuth/Passport-Session.js';
const app = express()


app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cookieParser())
app.use(passportsessionMiddleware)
app.use(passport.initialize())
app.use(passport.session())


routes(app);

app.get('/' , (req,res) => {
    res.send('API is working fine ✅')
})

export default app;