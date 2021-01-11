require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: `На сервере произошла ошибка ${err}` }));
};

module.exports.getUserById = (req, res) => {
  const userId = req.params.id;
  User.findById(userId)
    .orFail(new Error('Not Found'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === 'Not Found') {
        res.status(404).send({ message: 'Пользователя с таким id нет в базе данных' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы невалидные данные' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (password.length < 8 || password.trim().length === 0) {
    res.status(400).send({ message: 'Некорректный пароль' });
    return;
  }
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then(() => {
      res.status(200).send({
        data: {
          name, about, avatar, email,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Ошибка валидации ${err}` });
      } else if (err.code === 11000) {
        res.status(409).send({ message: 'E-Mail уже зарегистрирован' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
      return res.status(201).cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true }).send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};
