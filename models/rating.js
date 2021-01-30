const mongoose = require('mongoose');

const RatingSchema = mongoose.Schema({
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'movie'
    },
    comment: {
        type: String
    },
    rating: {
        type: Number,
        required: true,
        index: true
    },
    author: {
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            // required: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            index: true
        }
    }
},
{
    timestamps: true
});

const Rating = mongoose.model('rating', RatingSchema);
module.exports = Rating;