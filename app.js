// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');
// ℹ️ Connects to the database
require('./db');
// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');
const session = require('express-session');
// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');
const app = express();
// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);
app.use(session({
    secret: 'secret', // Deberías usar una cadena de texto larga y única aquí
    resave: false,
    saveUninitialized: true,
  }));
// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();
app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;
// 👇 Start handling routes here

const index = require('./routes/index.routes');
app.use('/', index);

const authRouter = require('./routes/auth.routes'); // <== has to be added
app.use('/', authRouter); 

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);
module.exports = app;