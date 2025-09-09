const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const passport = require('passport');
const config = require('../config');
const { User } = require('../models');

/**
 * Options:
 *  jwtFromRequest: The extracted token
 *  secretOrKey: {The jwt secret}
 */
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
};

// Strategy integration with passport 
passport.use(
  new JwtStrategy(options, async (payload, done) => {
    try {
      const user = await User.findByPk(payload.user.id);
      if (user) return done(null, user);
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);

const authenticateJwt = passport.authenticate('jwt', { session: false });
module.exports = authenticateJwt;
