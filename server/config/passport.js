import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import FacebookStrategy from 'passport-facebook';
import { findOrCreateUser } from '../models/user.model.js';

passport.use(new GoogleStrategy.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
        if (!email) {
            return done(new Error("Không thể lấy email từ Google."), null);
        }
        const user = await findOrCreateUser({
            googleId: profile.id,
            email: email,
            fullName: profile.displayName
        });
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}
));

passport.use(new FacebookStrategy.Strategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/api/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails']
},
async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
        if (!email) {
            const user = await findOrCreateUser({
                facebookId: profile.id,
                email: `${profile.id}@facebook-temp.com`,
                fullName: profile.displayName
            });
            return done(null, user);
        }
        const user = await findOrCreateUser({
            facebookId: profile.id,
            email: email,
            fullName: profile.displayName
        });
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}
));

export default passport;
