const User = require('./models/user.js');
const ObjectId = require('mongodb').ObjectId;
const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")
const fs = require("fs")
const jwt = require('jsonwebtoken')
const passport = require('passport')
const passportJWT = require('passport-jwt');
const ExtractJWT = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const JwtOptions = {};
JwtOptions.jwtFromRequest = ExtractJWT.fromAuthHeaderWithScheme('jwt');
//JwtOptions.secretOrKey = 'movieratingapplicationsecretkey';
JwtOptions.secretOrKey = 'thisisthesecretkey';

var strategy = new JwtStrategy(JwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  // usually this would be a database call:
  // var user = users[_.findIndex(users, {id: jwt_payload.id})];
  /*
  if ( jwt_payload.id ) {
    next(null, 'test');
  } else {
    next(null, false);
  }
  */
  User.getUserById(jwt_payload.id, (err, user) => {
    if ( user ) {
      next(null, 'xxx')
    } else {
      console.log("NOT FOUND")
      next(null, false)
    }
  }) 
});

passport.use(strategy);
/////////////////////////////////

const app = express();
const router = express.Router();

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
/*
mongoose.connect('mongodb://localhost/eg', 
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err) {
    if (err)
      console.log('连接数据库失败');
    else {
      console.log('连接数据库成功');
    }
  });
*/

mongoose.connect('mongodb://localhost/movie_rating_app')
.then(() => {
    console.log('Connection has been made');
}).catch(err => {
    console.error('App starting error:', err.stack);
    process.exit(1);
});

//include controllers
fs.readdirSync("controllers").forEach(function (file) {
  if(file.substr(-3) == ".js") {
    const route = require("./controllers/"+file);
    route.controller(app);
  }
});

router.get('/',function(req,res) {
    res.json({ message: 'API Initialized!'});
});

const port = process.env.API_PORT || 8081;
app.use('/',router);
app.listen(port, function() {
    console.log(`api running on port ${port}`);
})
