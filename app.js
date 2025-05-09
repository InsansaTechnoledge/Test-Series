import Dotenv from 'dotenv'
Dotenv.config({path: '.env.development.local'})

import app from './config/express.js'

export default app;