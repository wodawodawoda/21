const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const path = require('path');
const fs = require('fs')



//localhost port
const port = 5000;
// create express app
const app = express();

// create server instance
const server = http.Server(app);

// Connetct MongoDB using Mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/kodilla21')

const Schema = mongoose.Schema


// create mongo schema like class in pure js
const userSchema = new Schema({
  name: String,
  username: { type: String, required:true, unique: true },
  password: { type: String,required: true },
  admin: Boolean,
  created_at: Date,
  updated_at: Date
});


// Create method for User model
userSchema.methods.manify = function (next) {
  this.name = this.name + '-boy';

  return next(null, this.name)
}

userSchema.pre('save', function (next) {
  // get actual time
  const currentDate = new Date();

  // update 'last update time'
  this.updated_at = currentDate;

  // if its newly created model add creation time
  if (!this.created_at) {
    this.created_at = currentDate
  }

  next();
})

// create mongoose model 'User'
const User = mongoose.model('User', userSchema);

app.get('/', (req, res)=> {
  res.send('Working')
})

app.post('/users', (req, res) => {
  // create new User model instance
// KENNY USER
  const kenny = new User({
    name: 'Kenny',
    username: 'Kenny_the_boy',
    password: 'password'
  });

  kenny.manify(function (err, name) {
    if(err) throw err;

    console.log(`Twoje imię to: ${name}`);
  });

  kenny.save(function (err) {
    if (err) throw err;

    console.log(`Użytkownik ${kenny.name} został zapisany pomyślnie`)
  })

// BENNY USER
  const benny = new User({
    name: 'Benny',
    username: 'Benny_the_boy',
    password: 'password'
  });

  benny.manify(function (err, name) {
    if (err) throw err;

    console.log(`Twoje nowe imię to ${name}`)
  })

  benny.save(function (err) {
    if (err) throw err;

    console.log(`Użytkownik ${benny.name} został zapisany pomyślnie`)
  })

// MARK USER
  const mark = new User({
    name: 'Mark',
    username: 'Mark_the_boy',
    password: 'password'
  });

  mark.manify(function (err, name) {
    if (err) throw err;

    console.log(`Twoje nowe imię to ${name}`);
  });

  mark.save(function (err) {
    if (err) throw err;

    console.log(`Użytkownik ${mark.name} został zapisany pomyślnie`);
  });
  res.send('Dodano użytkowników do bazy danych');
});

app.get('/users', async (req, res) => {
  // User.find({}, function (err, data) {
  //   if(err) throw err;
  //   res.json(data)
  // })
  try {
    const usersList = await User.find({})
    res.json(usersList)
  } catch (e) {
    res.send(e)
  }
})

app.get('/user/:name', async (req, res) => {
  const name = req.params.name;
  try {
    const usersList = await User.find({name: `${name}-boy`})
    res.json(usersList)
  } catch (e) {
    res.send(e)
  }
})


app.post('/user/:name/:newpassword', async (req, res) => {
  const name = req.params.name;
  const newPassword = req.params.newpassword
    User.find({name: `${name}-boy`})
      .then(user => {
        user[0].password = newPassword;
        user[0].save((err) => {
          if (err) throw err
          res.send('Pomyślnie')
        })
      })
})

app.delete('/user/:name', function(req, res) {
  const name = req.params.name;
  User.find({name: `${name}-boy`}, (err, user) => {
    user[0].remove(function (err) {
      if (err) throw err;
      res.send(`Użytkownik ${name} został usunięty pomyślnie`)
    })
  })

})





server.listen(port)