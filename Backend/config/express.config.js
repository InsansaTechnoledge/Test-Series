// import express from 'express';
// import cors from 'cors';
// import routes from '../routes/routes.js';
// import cookieParser from 'cookie-parser';
// import passport from '../utils/PassportAuth/Passport.js';
// import session from 'express-session';
// import MongoStore from 'connect-mongo';

// const app = express();

// // Ensure trust proxy for production (required for session handling behind load balancers)
// app.set('trust proxy', 1);

// const allowedOrigins = process.env.CLIENT_URL.split(',');

// // CORS configuration
// app.use(cors({
//   origin: function (origin, callback) {
//     console.log('Request origin:', origin);  // Debug log
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost') || origin.startsWith('file://') || origin.startsWith('app://')) {
//       callback(null, true);
//     } else {
//       console.log('CORS Error - Origin not allowed:', origin);  // Debug log
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   exposedHeaders: ['Set-Cookie']
// }));


// app.use(express.json({limit: "40mb"}));
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// // Session configuration
// // Session configuration
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   name: 'connect.sid',
//   cookie: {
//     secure: process.env.NODE_ENV === 'production',
//     httpOnly: true,
//     sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
//     maxAge: 24 * 60 * 60 * 1000
//   },
//   store: MongoStore.create({
//     mongoUrl: process.env.MONGODB1_URL,
//     ttl: 24 * 60 * 60,
//     touchAfter: 24 * 3600,
//   })
// }));

// // Enhanced session debugging middleware
// app.use((req, res, next) => {
//     console.log('**==> ///////////////////////////////////////////////////////////**');
//     console.log('Request URL:', req.url);
//     console.log('Session exists:', !!req.session);
//     console.log('Session ID:', req.sessionID);
//     console.log('Cookies:', req.cookies);
    
//     // Additional debugging for session data
//     if (req.session) {
//         console.log('Session ID:', req.sessionID);
//         console.log('Session data:', req.session);
//     }
    
//     // Log user authentication status
//     console.log('User from req.user:', req.user);
//     console.log('Is authenticated:', req.isAuthenticated ? req.isAuthenticated() : false);
    
//     // Check if user exists in session
//     if (req.session && !req.user) {
//         console.log('No user found in session');
//     }
    
//     next();
// });

// // Initialize Passport.js
// app.use(passport.initialize());
// app.use(passport.session());

// // Routes
// routes(app);

// // Health check route
// app.get('/', (req, res) => {
//     res.send('API is working fine ✅');
// });

// export default app;

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

const allowedOrigins = process.env.CLIENT_URL.split(',');

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    console.log('Request origin:', origin);
    // Allow requests with no origin (like mobile apps or curl requests)
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

// Enhanced session configuration for cross-browser compatibility
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
    // Optional: Set domain explicitly if needed for subdomain sharing
    // domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : undefined
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

// Enhanced session debugging middleware
app.use((req, res, next) => {
    console.log('**==> ///////////////////////////////////////////////////////////**');
    console.log('Request URL:', req.url);
    console.log('User-Agent:', req.headers['user-agent']);
    console.log('Origin:', req.headers.origin);
    console.log('Session exists:', !!req.session);
    console.log('Session ID:', req.sessionID);
    console.log('Cookies received:', req.cookies);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    
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