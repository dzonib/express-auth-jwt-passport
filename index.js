const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport')

const db = require('./config/keys').mongoURI;

mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(console.log('db connected'))
  .catch(e => console.log(e));

const app = express();

app.use(bodyParser.json());


const users = require('./routes/api/users')

app.use(passport.initialize());

require('./config/passport')(passport)


app.use('/api/users', users)



const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`app running on port ${port}`));
