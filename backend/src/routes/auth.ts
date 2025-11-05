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

