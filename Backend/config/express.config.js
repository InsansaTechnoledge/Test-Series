import express from 'express';
import cors from 'cors';
import routes from '../routes/routes.js';
import cookieParser from 'cookie-parser';
import passport from '../utils/PassportAuth/Passport.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';

const app = express();

app.set('trust proxy', 1); // Needed for secure cookies behind proxies like Render

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV !== 'development',
    sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
    domain: process.env.NODE_ENV === 'development' ? 'localhost' : 'evalvotech.com',
    maxAge: 24 * 60 * 60 * 1000
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB1_URL
  })
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app);

app.get('/', (req, res) => {
  res.send('API is working fine ✅');
});

export default app;
