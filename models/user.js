const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    default: 'Имя',
  },

  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    default: 'О себе',
  },
  avatar: {
    type: String,
    validate: {
      validator(v) {
        return /https?:\/\/((\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|((w{3}\.)*[\w.-]+\.[a-z]{2,3}))(:[1-9]\d{1,4})*(\/)?(([\w]{1,}(\/)?)+(#)?)?/.test(v);
      },
      message: 'Ссылка некорректна',
    },
    required: true,
  },
  email: {
    type: String,
    validate: {
      validator(v) {
        return /[\w.-]+@[\w.-]+\.[a-z]{2,3}/.test(v);
      },
      message: 'E-Mail некорректен',
    },
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
