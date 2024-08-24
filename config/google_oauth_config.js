var GoogleStrategy = require("passport-google-oauth20").Strategy;
const { userModel } = require("../models/user");
const passport = require("passport");

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://www.example.com/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        let user = await userModel.findOne({ email: profile.email[0].value });
        if (!user) {
          user = new userModel({
            name: profile.displayName,
            email: profile.email[0].value,
            googleId: profile.id,
          });
          await user.save();
        }
        cb(null, user);
      } catch (error) {
        cb(err, false);
      }
    }
  )
);

passport.serializeUser(function (user, cb) {
  return cb(null, user._id);
});

passport.deserializeUser(async function (user, cb) {
  let user = await userModel.findOne({ _id: id });
  cb(null, user);
});

module.exports = passport;
