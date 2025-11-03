const userService = require('../services/userService');

exports.registerUser = async (req, res) => {
    try {
        const userData = req.body;
        const newUser = await userService.register(userData);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.login(email, password);
        res.status(200).json(user);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const userProfile = await userService.getUserProfile(userId);
        res.status(200).json(userProfile);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedData = req.body;
        const updatedUser = await userService.updateUserProfile(userId, updatedData);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};