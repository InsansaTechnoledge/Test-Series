import session from 'express-session';
import MongoStore from 'connect-mongo';
const nodeEnv = process.env.NODE_ENV;

const passportsessionMiddleware = session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB1_URL,
    collectionName: 'sessions',
    ttl: 1 * 24 * 60 * 60, // 1 day in seconds
  }),
  cookie: {
    httpOnly: true,
    secure: nodeEnv !== 'development',
    sameSite: nodeEnv === 'development' ? 'lax' : 'none',
    domain: nodeEnv === 'development' ? 'localhost' : 'auto',
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
  },
});

export default passportsessionMiddleware;
