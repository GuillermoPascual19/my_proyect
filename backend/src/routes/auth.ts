import express, { Request, Response, NextFunction, Router } from 'express';
import { Profile } from 'passport';
var passport = require('passport');
var GoogleStrategy = require('passport-google-oidc');
var db = require('../config/database');
import Session from "../models/session";

interface User {
  id: number;
  username?: string;
  name: string;
}

// Configure Passport authenticated session persistence.
passport.serializeUser(function(user: User, cb: (err: any, id?: any) => void) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username, name: user.name });
  });
});

passport.deserializeUser(function(user: User, cb: (err: any, user?: User | false) => void) {
  process.nextTick(function() {
    cb(null, user);
  });
});

const router: Router = express.Router();

/* GET /login */
router.get('/login', (req: Request, res: Response, next: NextFunction) => {
  res.render('login');
});

/* GET /login/federated/google */
router.get('/login/federated/google', passport.authenticate('google'));

/* GET /oauth2/redirect/google */
router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login'
}));

/* POST /logout */
router.post('/logout', (req: Request, res: Response, next: NextFunction) => {
  req.logout((err: Error) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

export default router;


//----------Al loggear con google, devuelve este objeto----------------
// {
//   [1]   id: '107083637363265446162',
//   [1]   displayName: 'GUILLERMO PASCUAL MANGAS',
//   [1]   name: { familyName: 'PASCUAL MANGAS', givenName: 'GUILLERMO' },
//   [1]   photos: [
//   [1]     {
//   [1]       value: 'https://lh3.googleusercontent.com/a/ACg8ocIXGIB1O1xSALrlF-rwZn88eJpqAUYSLFX3hupBg7s2kvjRDg=s96-c'
//   [1]     }
//   [1]   ],
//   [1]   provider: 'google',
//   [1]   _raw: '{\n' +
//   [1]     '  "sub": "107083637363265446162",\n' +
//   [1]     '  "name": "GUILLERMO PASCUAL MANGAS",\n' +
//   [1]     '  "given_name": "GUILLERMO",\n' +
//   [1]     '  "family_name": "PASCUAL MANGAS",\n' +
//   [1]     '  "picture": "https://lh3.googleusercontent.com/a/ACg8ocIXGIB1O1xSALrlF-rwZn88eJpqAUYSLFX3hupBg7s2kvjRDg\\u003ds96-c"\n' +
//   [1]     '}',
//   [1]   _json: {
//   [1]     sub: '107083637363265446162',
//   [1]     name: 'GUILLERMO PASCUAL MANGAS',
//   [1]     given_name: 'GUILLERMO',
//   [1]     family_name: 'PASCUAL MANGAS',
//   [1]     picture: 'https://lh3.googleusercontent.com/a/ACg8ocIXGIB1O1xSALrlF-rwZn88eJpqAUYSLFX3hupBg7s2kvjRDg=s96-c'
//   [1]   }
//   [1] }
//   [1] GET /auth/google/callback?code=4%2F0AQlEd8yxh3XJvTRvkFQPJ-Yv_MFdHs_-DP4RHr0jJ8s15QHdEIZYxktR-ZijPVUHxaYbUA&scope=profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile 200 321.342 ms - 25