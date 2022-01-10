const express = require('express');

const app = express();
const path = require('path');
const connectDB = require('./config/db');

global.__basedir = __dirname;

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
const io = require('socket.io')(server, {
  cors: {
    origins: '*:*',
  },
});
// Socket route declaration
require('./socket/request').init(io);
// End socket route declaration

// Init Middleware
app.use(express.json({extended: false}));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

connectDB();

// Define Routes
app.use('/api/wordcount', require('./routes/api/wordcount'));

// Serve static assets in production
// process.env.NODE_ENV == 'production'

// app.use(express.static('client/build'));
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
// });

