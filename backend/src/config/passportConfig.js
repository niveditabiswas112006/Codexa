const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'placeholder_google_client_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder_google_client_secret',
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Check if user exists with the same email
          let email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
          if (email) {
            user = await User.findOne({ email: email });
          }

          if (user) {
            // Link google account to existing user
            user.googleId = profile.id;
            await user.save();
          } else {
            // Create new user
            user = await User.create({
              name: profile.displayName || 'Google User',
              email: email || `${profile.id}@google.com`,
              googleId: profile.id,
              role: 'employee',
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || 'placeholder_github_client_id',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'placeholder_github_client_secret',
      callbackURL: '/api/auth/github/callback',
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
           // Check if user exists with the same email
           let email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
           if (email) {
             user = await User.findOne({ email: email });
           }

           if (user) {
             // Link github account to existing user
             user.githubId = profile.id;
             await user.save();
           } else {
             // Create new user
             user = await User.create({
               name: profile.displayName || profile.username || 'GitHub User',
               email: email || `${profile.username}@github.com`,
               githubId: profile.id,
               role: 'employee',
             });
           }
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
