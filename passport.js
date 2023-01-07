const passport = require("passport");
const { updateUser } = require('./db');
const { Strategy } = require("@superfaceai/passport-twitter-oauth2");
var constants = require('./constants/constants');


module.exports = function() {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  passport.use(new Strategy({
    clientType: 'confidential', //depends on your Twitter app settings, valid values are `confidential` or `public`
    clientID: constants.client_id,
    clientSecret: constants.client_secret,
    callbackURL: `http://localhost:3000/api/v1/login/callback`
  },
  async function(token, tokenSecret, profile, cb) {
    console.log({token, tokenSecret, profile});
    const user = await updateUser({ ...profile, token, tokenSecret });

    return cb(null, user);
  }));
}