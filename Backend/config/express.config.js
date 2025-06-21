import express from 'express';
import cors from 'cors';
import routes from '../routes/routes.js';
import cookieParser from 'cookie-parser';
import passport from '../utils/PassportAuth/Passport.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';

const app = express();

app.set('trust proxy', 1);

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// FIXED Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'connect.sid',
  cookie: {
    // FIX 1: Disable secure in production temporarily
    secure: false, // Set to false for now to test
    httpOnly: true,
    // FIX 2: Use 'lax' for both environments initially
    sameSite: 'lax', // Change from 'none' to 'lax'
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    // FIX 3: Add domain if needed (uncomment if frontend/backend on different subdomains)
    // domain: '.yourdomain.com'
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB1_URL,
    touchAfter: 24 * 3600,
    ttl: 24 * 60 * 60 // 24 hours in seconds
  })
}));

// Enhanced session debugging middleware
app.use((req, res, next) => {
  console.log('**==> ///////////////////////////////////////////////////////////**');
  console.log('Request URL:', req.url);
  console.log('Session exists:', !!req.session);
  console.log('Session ID:', req.sessionID);
  console.log('Cookies:', req.cookies);
  
  // Additional debugging for session data
  if (req.session) {
    console.log('Session ID:', req.sessionID);
    console.log('Session data:', req.session);
  }
  
  // Log user authentication status
  console.log('User from req.user:', req.user);
  console.log('Is authenticated:', req.isAuthenticated ? req.isAuthenticated() : false);
  
  // Check if user exists in session
  if (req.session && !req.user) {
    console.log('No user found in session');
  }
  
  next();
});

app.use(passport.initialize());
app.use(passport.session());

routes(app);

app.get('/', (req, res) => {
  res.send('API is working fine ✅');
});

export default app;