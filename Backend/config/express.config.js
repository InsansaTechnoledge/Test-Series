import express from 'express';
import cors from 'cors';
import routes from '../routes/routes.js';
import cookieParser from 'cookie-parser';
import passport from '../utils/PassportAuth/Passport.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';

const app = express();

// Ensure trust proxy for production (required for session handling behind load balancers)
app.set('trust proxy', 1);

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL, // Ensure CLIENT_URL is correctly set
    credentials: true, // Allow cookies to be sent with cross-origin requests
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,  // Ensure this is a strong secret in production
    resave: false,
    saveUninitialized: false,
    name: 'connect.sid',
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (HTTPS only)
        httpOnly: true, // Prevent client-side access to the cookie
        sameSite: 'lax', // Allow cookies to be sent in cross-origin requests (adjust as needed)
        maxAge: 24 * 60 * 60 * 1000, // Session expiration (24 hours)
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB1_URL, // Ensure this is correct
        touchAfter: 24 * 3600, // Reduce the frequency of MongoDB writes
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

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Routes
routes(app);

// Health check route
app.get('/', (req, res) => {
    res.send('API is working fine ✅');
});

export default app;
