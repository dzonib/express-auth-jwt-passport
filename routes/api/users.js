const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const User = require('../../models/users');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    return res.json({ error: 'user alredy exists' });
  }

  const newUser = new User({
    name,
    email,
    password
  });

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newUser.password, salt);
  newUser.password = hash;

  await newUser.save();

  res.json({ name: newUser.name, email: newUser.email });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: 'user not registered' });
  }

  const isMatched = await bcrypt.compare(password, user.password);

  if (isMatched) {
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email
    };
    const token = jwt.sign(payload, 'secret', { expiresIn: 3600 });

    console.log(`Bearer ${token}`);

    return res.json(`Bearer ${token}`);
  }

  res.status(404).json({ msg: 'cannot find user' });
});

router.get(
  '/currentuser',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.send(req.user)
  }
);
module.exports = router;
