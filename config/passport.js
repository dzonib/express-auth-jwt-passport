const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('User');


const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';


module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, async  (jwt_payload, done) => {
      const user = await User.findById(jwt_payload.id)
      user ? done(null, user) : done(null, false)
    })
  )
}