const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: [true, 'User ID is required'],
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['nurse', 'patient'],
        required: true,
    },
}, { timestamps: true });

// Function to generate a unique 5-digit userId
async function generateUniqueUserId() {
    while (true) {
        const userId = Math.floor(10000 + Math.random() * 90000).toString();
        console.log('Generated potential userId:', userId);

        const existingUser = await this.constructor.findOne({ userId });
        if (!existingUser) {
            console.log('UserId is unique:', userId);
            return userId;
        }
        console.log('UserId already exists, generating a new one...');
    }
}

userSchema.pre('save', async function (next) {
    if (this.isNew) {
        console.log('Generating userId for:', this.name);
        this.userId = await generateUniqueUserId.call(this);
        console.log('Generated userId:', this.userId);
    }
    next();
});



// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
