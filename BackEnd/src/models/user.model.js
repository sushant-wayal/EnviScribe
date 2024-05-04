import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    institution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Institution",
    },
    refreshToken: {
        type: String,
        select: false,
    },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

userSchema.methods.isPasswordValid = async function (password) {
    const _id = this._id;
    const user = await User.findById(_id).select("+password");
    return await bcrypt.compare(password, user.password);
}

userSchema.methods.getAccessToken = function () {
    return jwt.sign(
        { 
            id: this._id,
            email: this.email,
        }, 
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
}

userSchema.methods.getRefreshToken = function () {
    return jwt.sign(
        { 
            id: this._id,
        }, 
        process.env.REFRESH_TOKEN_SECRET, 
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
}

export const User = mongoose.model("User", userSchema);