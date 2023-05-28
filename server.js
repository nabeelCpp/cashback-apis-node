require("dotenv").config();
require('express-group-routes');
const express = require("express");

const app = express();
const PORT = process.env.APP_PORT;
const cors = require("cors");

var allowedDomains = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://vendor.cashbackforever.net:8080', 'http://userpanel.cashbackforever.net:8081', 'http://dev.cashbackforever.net:8082'];
app.use(cors({
  origin: function (origin, callback) {
    // bypass the requests with no origin (like curl requests, mobile apps, etc )
    if (!origin) return callback(null, true);
 
    if (allowedDomains.indexOf(origin) === -1) {
      var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/admin.routes')(app);
require('./app/routes/franchise.routes')(app);
require('./app/routes/public.routes')(app);

app.get('*', function(req, res){
    res.send({
        message: "404 Not Found"
    }, 404);
});
app.post('*', function(req, res){
    res.send({
        message: "404 Not Found"
    }, 404);
});

app.put('*', function(req, res){
    res.send({
        message: "404 Not Found"
    }, 404);
});
app.listen(PORT, ()=>{
    console.log("server is running on port "+ PORT);
})