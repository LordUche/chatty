// jshint esversion:6

require('dotenv/config');
const express = require('express');
const apiai = require('apiai')(process.env.APIAI_TOKEN);

const app = express();

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile('index.html');
});

const server = app.listen(5000, () => console.log('Server started on port', 5000));
const io = require('socket.io')(server);

io.on('connection', socket => {
  socket.on('chat message', text => {
    const apiaiReq = apiai.textRequest(text, {
      sessionId: process.env.APIAI_SESSION_ID
    });

    apiaiReq.on('response', response => {
      const aiText = response.result.fulfillment.speech;
      socket.emit('bot reply', aiText);
    });

    apiaiReq.on('error', error => {
      console.error(error);
    });

    apiaiReq.end();
  })
})
