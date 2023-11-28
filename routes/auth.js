const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://thduy161103:A6DWueoYXaz2NLtO@cluster0.7dzahsd.mongodb.net/SneakerShopping?retryWrites=true&w=majority";
const client = new MongoClient(uri);
client.connect();

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

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    const result = await client.db("SneakerShopping").collection("users").insertOne(user);
    console.log(`New listing created with the following id: ${result.insertedId}`);
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.redirect('/register');
  }
});

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;
