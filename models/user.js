const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 👇 THIS IS THE IMPORTANT CHANGE
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);