import mongoose from "../../database/index.js";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    passwordResetToken: {
        type: String,
        select: false,
    },
    passwordResetTokenExpiration: {
        type: Date,
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isAdm: {
        type: Boolean,
        default: false,
    },
    userProfilePhoto: {
        type: String,
        required: false,
    }
})

UserSchema.pre('save', function (next) {
    bcrypt.hash(this.password, 10).then(hash => {
        this.password = hash;
        next();
    }).catch(error => {
        console.error("Error hashing password", error)
    })
})

export default mongoose.model('User', UserSchema);