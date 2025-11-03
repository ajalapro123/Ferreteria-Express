const User = require('../models/user');

const userService = {
    register: async (userData) => {
        // Logic for registering a new user
        const newUser = new User(userData);
        return await newUser.save();
    },

    login: async (email, password) => {
        // Logic for user login
        const user = await User.findOne({ email });
        if (user && user.comparePassword(password)) {
            return user;
        }
        throw new Error('Invalid credentials');
    },

    getUserProfile: async (userId) => {
        // Logic for retrieving user profile
        return await User.findById(userId);
    },

    updateUserProfile: async (userId, updatedData) => {
        // Logic for updating user profile
        return await User.findByIdAndUpdate(userId, updatedData, { new: true });
    }
};

module.exports = userService;