const express = require('express');
const multer = require('multer');
const passport = require('./middlewares/passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/User');
const {connectDB} = require('./config/dbMongo');
//const expressHandlebars = require('express-handlebars');
require("dotenv").config();
const app = express();

// Connect to MongoDB
connectDB();


// Configure passport-local strategy
// passport.use(
//   new LocalStrategy(async (username, password, done) => {
//     try {
//       const user = await User.findOne({ username: username });
//       if (!user) return done(null, false, { message: 'Incorrect username.' });
//       if (user.password !== password) return done(null, false, { message: 'Incorrect password.' });
//       return done(null, user);
//     } catch (err) {
//       return done(err);
//     }
//   })
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });

// Express middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
// Use static folder
app.use(express.static(path.join(__dirname, 'public')));
// Set up views
app.set('views', __dirname + '/views');
//app.engine('hbs', expressHandlebars({ extname: 'hbs' }));
app.set('view engine', 'hbs');

// Set up Multer storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // Destination folder for uploaded files
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname); // File name with timestamp
//   },
// });

// const upload = multer({ storage: storage });

// // Define a route to handle file uploads
// app.get('/upload', (req,res) => {
//   res.render("upload");
// })
// app.post('/upload', upload.single('image'), (req, res) => {
//   res.send('File uploaded!');
// });

// Routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');

app.use('/api', indexRoutes);
app.use('/', authRoutes);
app.use('/', protectedRoutes);

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});