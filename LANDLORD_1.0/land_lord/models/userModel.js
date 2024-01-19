const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, enum: ['landlord', 'tenant'], required: true },
});

// Hash the password before saving to the database
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) 
        //user.password = await bcrypt.hash(user.password, 10);
    
    next();
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;
