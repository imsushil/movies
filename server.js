var express = require("express");
var app = express();
app.use(express.static(__dirname + "/resources"));
app.get("/", function (req, res,next) {
    console.log(__dirname + "/index.html");
    res.sendFile( __dirname + "/index.html");
});
app.listen(process.env.PORT || 8080);
console.log("My app server is listening on port 8080");
