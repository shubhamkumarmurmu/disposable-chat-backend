const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    chat:{
        type: Schema.Types.ObjectId,
        ref: 'Chat'
    },
    authToken:{
        type: String
    }
}, {
    timestamps: true
});

UserSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    }       
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

UserSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, username: this.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    this.authToken = token;
    return token;
}

const User = mongoose.model('User', UserSchema);

module.exports = User;