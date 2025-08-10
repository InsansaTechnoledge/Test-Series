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

// CORS configuration
// app.use(cors({
//   origin: function (origin, callback) {
//     console.log('Request origin:', origin);
//     if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost') || origin.startsWith('file://') || origin.startsWith('app://')) {
//       callback(null, true);
//     } else {
//       console.log('CORS Error - Origin not allowed:', origin);
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   exposedHeaders: ['Set-Cookie']
// }));

const isProd = process.env.NODE_ENV === 'production';
const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map(s => s.trim().replace(/\/$/, '')) 
  .filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    console.log('Request origin:', origin);
    // allow same-origin/no-Origin (e.g., curl, SSR)
    if (!origin) return cb(null, true);

    const normalized = origin.replace(/\/$/, '');
    const ok =
      allowedOrigins.includes(normalized) ||
      (!isProd && /^http:\/\/localhost(:\d+)?$/.test(normalized));

    if (ok) return cb(null, true);

    console.log('CORS Error - Origin not allowed:', origin);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS','PATCH'],
  allowedHeaders: ['Content-Type','Authorization'],
  exposedHeaders: ['Set-Cookie'],
}));

app.options(/.*/, cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    const normalized = origin.replace(/\/$/, '');
    const ok =
      allowedOrigins.includes(normalized) ||
      (!isProd && /^http:\/\/localhost(:\d+)?$/.test(normalized));
    return ok ? cb(null, true) : cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));



app.use(express.json({limit: "40mb"}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGODB1_URL,
  ttl: 24 * 60 * 60,
  touchAfter: 24 * 3600,
})

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'connect.sid',
  proxy: true,
  cookie: {
    // Must be true in production for SameSite=none to work
    secure: process.env.NODE_ENV === 'production', 
    httpOnly: true,
    // Use 'none' for cross-origin in production, 'lax' for development
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
    domain: '.evalvotech.com',
  },
  store: sessionStore
}));

export {sessionStore};

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
app.use((req, _res, next) => {
  // express-session has attached req.session by here
  console.log('🗃️  Session keys before passport:', Object.keys(req.session || {}));
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use((req, _res, next) => {
  // passport.session() has run by here (if cookie+store ok)
  console.log('🧩 After passport.session - req.user:', req.user);
  console.log('🧩 After passport.session - req.session.passport:', req.session?.passport);
  next();
});

app.use(validateSessionMiddleware);

// Routes
routes(app);

// Health check route
app.get('/', (req, res) => {
    res.send('API is working fine ✅');
});

app.get('/debug/set-cookie', (req,res)=>{
  res.cookie('probe','1',{httpOnly:true,secure:isProd,sameSite:isProd?'none':'lax',domain:process.env.COOKIE_DOMAIN});
  res.json({ok:true});
});
app.get('/debug/session',(req,res)=>{
  res.json({hasCookieHeader:!!req.headers.cookie, sessionId:req.sessionID, user:req.user||null, passport:req.session?.passport||null});
});


export default app;