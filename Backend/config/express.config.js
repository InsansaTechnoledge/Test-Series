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
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'connect.sid',
    
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Important for cross-origin in production
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        // Add domain if you're using subdomains
        // domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : undefined
    },
    
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB1_URL,
        touchAfter: 24 * 3600,
        ttl: 24 * 60 * 60,
        
        // Add these important options for production
        autoRemove: 'native', // Let MongoDB handle TTL
        autoRemoveInterval: 10, // Check every 10 minutes
        
        // Connection options for better reliability
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000, // 10 seconds
            socketTimeoutMS: 45000, // 45 seconds
            maxPoolSize: 10, // Maintain up to 10 socket connections
            minPoolSize: 5, // Maintain a minimum of 5 socket connections
            bufferMaxEntries: 0,
            retryWrites: true,
            w: 'majority'
        },
        
        // Error handling
        errorHandler: (error) => {
            console.error('MongoDB session store error:', error);
        }
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
