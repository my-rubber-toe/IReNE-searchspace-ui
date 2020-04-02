const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
// const cors = require('cors');
const app = express();

//Middleware for CORS
// app.use(cors());

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Angular build output folder
app.use(express.static(__dirname +'/dist'));

// Send requests to the 
// use '*' so that the system can access all routes in the angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/dist/index.html'));
});


//Set Port
const port = process.env.PORT || '8080';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`\nRunning on application on localhost:${port}`));

