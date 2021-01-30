const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
// const passport = require('passport');
const app = express();

//Import routes
const reviewsRoutes = require('./routes/reviews');

dotenv.config();

//Mongodb connection
mongoose.connect(
    process.env.DB_CONNECT,
    {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(()=> console.log('DB connection established'))
    .catch(err => console.log('DB connection failed: ', err));


app.use(express.json());


app.use('/api/v1/movie', reviewsRoutes);

app.listen(3000, ()=> console.log('Listening on port 3000'));