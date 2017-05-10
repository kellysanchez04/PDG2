const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/public/wwwroot'));
app.listen(port);
console.log('The App runs on port: ' +port);
