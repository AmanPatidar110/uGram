const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require("../models/user");


exports.createUser = async (req, res, next) => {


try { 
  const userFromDB = await User.findOne({ email: req.body.email })
  console.log("backend: Creating User!" + userFromDB);


  if (userFromDB) {
    return res.status(401).json({
      message: "The entered email is already registered with us!"
    });
  }


  const hash = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    email: req.body.email,
    password: hash
  });

user.save()
  .then(result => {
    console.log(result);
    res.status(201).json({
      message: "User created!"
    });
  })
}
  catch(err) {
    res.status(500).json({
      message: "Invalid credentials."
    });
  }
};


exports.userLogin = (req, res, next) => {
  email = req.body.email;
  password = req.body.password;

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "The entered email is not registered with us!"
        });
      }
      bcrypt.compare(password, user.password)
        .then(result => {
          if (!result) {
            return res.status(401).json({
              message: "Authentication failed!"
            });
          }

          const token = jwt.sign({ email: user.email, userId: user._id }, process.env.JWT_SECRET_STRING, { expiresIn: "1h" });

          res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: user._id
          });

        })
        .catch(err => {
          return res.status(401).json({
            err: err
          });
        });
    })
};
