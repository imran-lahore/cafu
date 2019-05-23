var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({ limit: '50mb' });
var port = process.env.PORT || 3000;
var initEvent = require('./ReadDeviceToCloudMessages').initEvent;
var connectDB = require('./app/models').connectDB;
var appRouter = require('./app/routers/appRouters')(express);
var cors = require('cors');
var path = require('path');
var exphbs = require('express-handlebars');

require('dotenv').config();
//app.use(cors);
app.set('views', path.join(__dirname, 'app', 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir:'app/views/layouts',
  partialsDir:'app/views/partials'
}));
app.use('/public', express.static('app/public'))
app.set('view engine', '.hbs');
app.use(jsonParser);
app.use("/", appRouter);
app.use(bodyParser.urlencoded({
  extended: true
}));
connectDB();
app.listen(port, () => console.log(`App listening on port ${port}`))
initEvent();
