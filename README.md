# Mesto-nodeJS-final
Версия 0.0.1

## О проекте:
разработка сервера на NodeJS для учебного проекта Mesto.
В проекте предусмотрено добавление и удаление пользователями карточек различных мест, возможность поставить лайк. а так же создать и отредактировать свой профиль.


## Основной функционал:
- Обработка, валидация запросов
- работа с базой данных MongoDB
- Аутентификация и авторизация пользователей

## Обрабатываемые запросы:
|ЗАПРОС|                        ОПИСАНИЕ|
|:----|:----------|
|GET /cards|	                  возврвщвает JSON-список всех карточек|
|GET /users|	                  возврвщвает JSON-список всех пользователей|
|GET /users/:userId|	          возврвщвает JSON-пользователя с переданным после /users идентификатором| 
|POST /signup|                  создаёт пользователя|
|POST /cards|                   создаёт карточку|
|POST /signin|                  авторизация пользователя|
|PATCH /users/me|               обновляет профиль|
|PATCH /users/me/avatar|        обновляет аватар|
|PUT /cards/:cardId/likes|      поставить лайк карточке|
|DELETE /cards/:cardId/likes|   убрать лайк с карточки| 
|DELETE /cards/:cardId|         удаляет карточку| 

## Стэк технологий:
NodeJS, express, REST API

## Пакеты которые используются в сборках:

  - "bcrypt": "^5.0.0",
  - "body-parser": "^1.19.0",
  - "celebrate": "^13.0.3",
  - "cookie-parser": "^1.4.5",
  - "cross-env": "^7.0.2",
  - "dotenv": "^8.2.0",
  - "express": "^4.17.1",
  - "express-rate-limit": "^5.1.3",
  - "express-winston": "^4.0.5",
  - "jsonwebtoken": "^8.5.1",
  - "mongoose": "^5.10.7",
  - "mongoose-unique-validator": "^2.0.3",
  - "validator": "^13.1.17",
  - "winston": "^3.3.3",
  - "eslint": "^7.10.0",
  - "eslint-config-airbnb-base": "^14.2.0",
  - "eslint-plugin-import": "^2.22.0",
  - "nodemon": "^2.0.4",
  - "helmet": "^4.1.1"

## Инструкции по запуску:
- Скачать или склонировать репозиторий
- Установить NodeJS и MongoDB
- Установить зависимости при помощи npm - `npm i`
- Команда npm run start запускает сервер в production режиме на localhost:3000. 
Для работы в в production режиме необходимо добавить .env файл с секретным ключом JWT_SECRET и записью NODE_ENV=production
- Команда npm run dev запускает сервер на localhost:3000 с хот релоудом

## Ссылка на сервер в Яндекс Облаке:
- URL
https://www.api.mesto-v.students.nomoreparties.co
- IP
130.193.56.255
