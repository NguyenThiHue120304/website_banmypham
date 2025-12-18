const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('express-async-handler');

const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                phone: user.phone,
                address: user.address,
                city: user.city,
                ward: user.ward,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi Server: ' + error.message });
    }
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400).json({ message: 'Người dùng đã tồn tại' });
            return;
        }

        const user = await User.create({ name, email, password });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                phone: user.phone,
                address: user.address,
                city: user.city,
                ward: user.ward,
            });
        } else {
            res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    console.log("-----> ĐÃ GỌI VÀO HÀM UPDATE PROFILE <-----");
    console.log("Dữ liệu nhận được:", req.body);
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            if (req.body.password) {
                user.password = req.body.password;
            }

            user.phone = req.body.phone || user.phone;
            user.address = req.body.address || user.address;
            user.city = req.body.city || user.city;
            user.ward = req.body.ward || user.ward;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                phone: updatedUser.phone,
                address: updatedUser.address,
                city: updatedUser.city,
                ward: updatedUser.ward,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
    } catch (error) {
        console.error("Lỗi cập nhật:", error);
        res.status(500).json({ message: 'Lỗi cập nhật: ' + error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const googleLogin = asyncHandler(async (req, res) => {
    const { tokenId } = req.body; 

    try {
        const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: `Bearer ${tokenId}`,
            },
        });

        const { email, name, picture } = response.data;

        let user = await User.findOne({ email });

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            const password = email + process.env.JWT_SECRET;
            user = await User.create({
                name,
                email,
                password,
            });

            if (user) {
                res.status(201).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    token: generateToken(user._id),
                });
            } else {
                res.status(400);
                throw new Error('Dữ liệu người dùng không hợp lệ');
            }
        }
    } catch (error) {
        console.error("Lỗi xác thực Google:", error.response?.data || error.message);
        res.status(401);
        throw new Error("Token Google không hợp lệ hoặc đã hết hạn");
    }
});

const facebookLogin = asyncHandler(async (req, res) => {
    const { accessToken, userID } = req.body;

    try {
        const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`;
        const { data } = await axios.get(url);

        let { email, name, picture } = data;

        if (!email) {
            email = `${userID}@facebook.com`;
        }
        let user = await User.findOne({ email });

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            const password = email + process.env.JWT_SECRET;
            user = await User.create({
                name: name || "Facebook User",
                email,
                password,
            });

            if (user) {
                res.status(201).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    token: generateToken(user._id),
                });
            } else {
                res.status(400);
                throw new Error('Dữ liệu người dùng không hợp lệ');
            }
        }
    } catch (error) {
        console.error("Lỗi Facebook Login:", error.message);
        res.status(400);
        throw new Error("Lỗi xác thực Facebook: " + error.message);
    }
});

module.exports = {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    googleLogin,
    facebookLogin
};