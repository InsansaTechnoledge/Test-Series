import express from 'express';
import cors from 'cors';
import routes from '../routes/routes.js';
import cookieParser from 'cookie-parser';
import passport from '../utils/PassportAuth/Passport.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { validateSessionMiddleware } from '../middleware/validateSessionMiddleware.middleware.js';

const app = express();

app.set('trust proxy', 1);

const allowedOrigins = process.env.CLIENT_URL.split(',');

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    console.log('Request origin:', origin);

    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost') || origin.startsWith('file://') || origin.startsWith('app://')) {
      callback(null, true);
    } else {
      console.log('CORS Error - Origin not allowed:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie']
}));

app.use(express.json({limit: "40mb"}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'connect.sid',
  cookie: {
    // Must be true in production for SameSite=none to work
    secure: process.env.NODE_ENV === 'production', 
    httpOnly: true,
    // Use 'none' for cross-origin in production, 'lax' for development
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB1_URL,
    ttl: 24 * 60 * 60,
    touchAfter: 24 * 3600,
  })
}));

// Add middleware to handle preflight requests properly
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
  } else {
    next();
  }
});

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// app.use(validateSessionMiddleware);

// Routes
routes(app);

// Health check route
app.get('/', (req, res) => {
    res.send('API is working fine ✅');
});

export default app;