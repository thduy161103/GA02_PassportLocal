const express = require('express');
const router = express.Router();
const passport = require('../middlewares/passport');
const User = require('../models/User');
const { sendMail } = require("./mailAPI")

router.get('/login', (req, res) => {
  res.render('login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/protected',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

router.get('/register', (req, res) => {
  res.render('register');
});

// router.post('/register', async (req, res) => {
//   try {
//     var newUser = new User();
//     newUser.username = req.body.username;
//     newUser.password = newUser.encryptPassword(req.body.password);
//     newUser.save()
//     res.redirect('/login');
//   } catch (err) {
//     console.error(err);
//     res.redirect('/register');
//   }
// });
router.get('/forget_password', (req, res, next) => {
  try {
      res.render("forgetpassword");
  } catch (error) {
      next(error);
  }
})
router.post('/forget_password', async (req, res, next) => {
  try {
      const { email } = req.body;
      console.log(email);

      const user = await User.findOne({ email: email });
      if (!user) {
          res.status(404).json({ msg: "Email này không tồn tại" });
      }
      else {
          //const secret = process.env.JWT_SECRET + user.password;
          //const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: "30m" });

          const reserPasswordLink = `http://localhost:8080/reset-password?id=${user._id}`;

          const mailOption = {
              //from: `Admin Le Nguyen Thai <lnthai21@clc.fitus.edu.vn>`,
              to: email,
              subject: "Reset Password",
              text: ``,
              html: `<h3>Dear ${user.username} </h3>, <br>
              <p>We will give user the reset link below:<br>
              ${reserPasswordLink}<br>
              access to this link reset your password.<br>
              Regrad</p>`
          }
        
          sendMail(mailOption).then(result => { console.log(result) }).catch(e => { console.log(e) });
          res.send("Please check your email to reset password .....");
      }

  } catch (error) {
      next(error)
  }
})

router.get('/reset_password', async (req, res, next) => {
  try {
      const { id } = req.query;

      const user = await User.findById(id);

      if (!user) {
          res.status(404).json({ message: "Not found" });
      }
      else {

          // const secret = process.env.JWT_SECRET + user.password;
          // const payload = jwt.verify(token, secret);

          // if (payload.id !== id) {
          //     res.status(401).json({ msg: "Invalid token or id" });
          // }

          // Successfull because error will throw 
          res.render("resetpassword", { id: user._id })
      }
  } catch (error) {
      next(error);
  }
})
router.post('/reset_password', async (req, res, next) => {
  try {
      const { password, password2 } = req.body;

      if (password !== password2) {
          res.status(400).json({ message: "New password and confirmation do not match" });
      }

      const { id} = req.query;

      const user = await User.findById(id);

      if (!user) {
          res.status(404).json({ message: "Not found user or id invalid!" });
      }
      else {
          // const secret = process.env.JWT_SECRET + user.password;
          // const payload = jwt.verify(token, secret);

          // if (payload.id !== user.id) {
          //     res.status(401).json({ message: "Id invalid or token invalid" });
          // }

          user.password = password;
          await user.save();

          res.status(200).send("Change password successfully!");
      }

  } catch (error) {
      next(error);
  }
})

router.get('update_password', async (req, res, next) => {
  try {

      res.render("updatepassword");
  } catch (error) {

  }
})

router.post('/update_password', async (req, res, next) => {
  try {

      const { password, newPassword, confirmPassword } = req.body;

      const user = req.user;

      const result = await user.comparePass(password);
      if (result) {
          if (newPassword !== confirmPassword) {
              res.status(400).json({ message: "New password and confirmation do not match" });
              return;
          }

          user.password = newPassword;
          await user.save();


          // res.cookie("token", "", {
          //     maxAge: -1,
          //     httpOnly: true
          // });
          res.status(200).json({ message: "Password updated successfully! Please login again!" });

      }
      else {
          res.status(401).json({ message: "Current password is incorrect" });
      }

  } catch (error) {
      next(error);
  }
})

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;