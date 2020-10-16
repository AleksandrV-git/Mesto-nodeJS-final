/*eslint-env es6*/
const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require("express-rate-limit");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const routeCards = require('./routes/cards.js');
const routeUsers = require('./routes/users.js');
const { createUser, login } = require('./controllers/users.js');
const auth = require('./middlewares/auth.js');

const { PORT = 3000 } = process.env;
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', routeUsers);
app.use('/cards', routeCards);
app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  console.log(err.statusCode)
  const { statusCode = 500, message } = err;
  

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message
    });
}); 

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
