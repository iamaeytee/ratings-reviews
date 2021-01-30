const mongoose = require('mongoose');

const MovieSchema = mongoose.Schema({
    movieName: {
        type: String,
        required: true
    },
    cast: [{
        type: String,
        required: true
    }],
    directors: [{
        type: String,
        required: true
    }]
},
{
    timestamps: true
}
);

const Movie = mongoose.model('movie', MovieSchema);
module.exports = Movie;