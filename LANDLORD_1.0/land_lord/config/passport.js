const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

passport.use(
    new LocalStrategy((username, password, done) => {
        User.findOne({ username: username }, async (err, user) => {
            try {
                if (err) {
                    throw err;
                }

                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }

                const passwordMatch = await bcrypt.compare(password, user.password);

                if (passwordMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect password.' });
                }
            } catch (error) {
                return done(error);
            }
        });
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

module.exports = passport;
