import express from 'express';
import cors from 'cors';
import routes from '../routes/routes.js';
import cookieParser from 'cookie-parser';
import passport from '../utils/PassportAuth/Passport.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';

const app = express();

app.set('trust proxy', 1);

// CORS configuration - this might be the issue
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration with additional options
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'connect.sid', // Explicit session name
  cookie: {
    secure: process.env.NODE_ENV === 'production' ? true : false,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB1_URL,
    touchAfter: 24 * 3600,
    ttl: 24 * 60 * 60 // 24 hours in seconds
  })
}));

// Add session debugging middleware
app.use((req, res, next) => {
  console.log('Request URL:', req.url);
  console.log('Session exists:', !!req.session);
  console.log('Session ID:', req.sessionID);
  console.log('Cookies:', req.cookies);
  next();
});

app.use(passport.initialize());
app.use(passport.session());

routes(app);

app.get('/', (req, res) => {
  res.send('API is working fine ✅');
});

export default app;