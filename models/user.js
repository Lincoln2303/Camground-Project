//                  XL. CREATING OUR USER MODEL¨

// XL.01. First we require mongoose, plus defining Schema: 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// XL.02. We also require passport-local-mongoose:
const passportLocalMongoose = require('passport-local-mongoose');

// XL.03. Creating userSchema:
const UserSchema = new Schema({
    // XL.04. Here we want an email, username, and password: (NOTE: But we only specify email)
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// XL.05. We didn't specify username, and password, because we'll do it here:
// NOTE: We pass in the package, and this is going to add our schema a username, and a password
UserSchema.plugin(passportLocalMongoose);

// XL.06. Now we can export it:
module.exports = mongoose.model('User', UserSchema); 



