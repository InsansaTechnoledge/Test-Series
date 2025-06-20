import express from 'express';
import cors from 'cors';
import routes from '../routes/routes.js';
import cookieParser from 'cookie-parser';
import passport from '../utils/PassportAuth/Passport.js';
import session from 'express-session'; // ⬅️ import session directly

const app = express();

// ✅ CORS setup for cross-origin cookie sharing
app.use(cors({
  origin: process.env.CLIENT_URL, // e.g., https://your-frontend.onrender.com
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Secure session configuration (for Render/HTTPS)
app.use(session({
  secret:"Hi_there",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,        // ⬅️ required for HTTPS
    sameSite: 'none',    // ⬅️ required for cross-origin
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // optional: 1 day
  }
}));

// ✅ Passport setup (after session)
app.use(passport.initialize());
app.use(passport.session());

routes(app);

// ✅ Default route for sanity check
app.get('/', (req, res) => {
  res.send('API is working fine ✅');
});

export default app;
