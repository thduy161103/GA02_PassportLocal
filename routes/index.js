const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const User = require('../models/User');
const Image = require('../models/Image');
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/uploads/'); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // File name with timestamp
  },
});

const upload = multer({ storage: storage });

router.post('/register', upload.single('avatar'), async (req, res) => {
  try {
    const { username, password, email } = req.body;
    let newUser;
    // Tạo một đối tượng mới User
    newUser = new User({
      username: username,
      password: password,
      email: email,
    });

    // Gọi phương thức encryptPassword để mã hóa mật khẩu
    newUser.password = newUser.encryptPassword(password);

    // Nếu có ảnh đại diện được tải lên
    if (req.file) {
      // Tạo một đối tượng mới Image và lưu trữ dữ liệu từ file ảnh
      // const newImage = new Image({ data: req.file.buffer });
      // const savedImage = await newImage.save();

      // Gán id của ảnh đại diện cho user
      newUser.avatar = newUser.avatar = req.file.filename;;
    }

    // Lưu user vào database
    const savedUser = await newUser.save();

    res.json({ success: true, user: savedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

router.get('/profile/:id', async (req, res) => {
  try {
      const userId = req.params.id;

      // Tìm user trong database dựa vào userId
      const user = await User.findById(userId).populate('avatar');

      if (!user) {
          return res.status(404).json({ success: false, error: 'User not found' });
      }

      res.render('profile', { user });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

router.get('/', (req, res) => {
  res.render('register');
});

module.exports = router;
