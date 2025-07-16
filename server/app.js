const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');

const authRoutes = require('./routes/auth');
const pollRoutes = require('./routes/polls');
const voteRoutes = require('./routes/votes');
const payRoutes = require('./routes/pay');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails && profile.emails[0] && profile.emails[0].value;
      if (!email) return done(new Error('No email associated with this account'));
      let user = await User.findOne({ username: email });
      if (!user) {
        user = await User.create({
          username: email,
          password: Math.random().toString(36).slice(-8),
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/auth', authRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/pay', payRoutes);

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
