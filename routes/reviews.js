const express = require('express');
const  isMongoId  = require('validator/lib/isMongoId');
// const {} = require('validator');
const { isString, isNumber, isFinite } = require('lodash');
const Rating = require('../models/rating');
const Movie = require('../models/movie');
const { auth } = require('../utils/verifyToken');

const router = express.Router();

router.get(
    '/:movieId',
    async (req, res) => {
            try {
                
                const { movieId } = req.params;

                // Validation for movieId
                if(!movieId || !isMongoId(movieId)){
                    const err = new Error('Invalid movieId');
                    return res.status(404).json({ code: 404, err: true, msg: `Enter a valid movieId` });
                }

                const movieRatings = await Rating.aggregate([
                    {
                        $match: {
                            movieId: movieId
                        }
                    },
                    {
                        $group: {
                            _id: "$movieId",
                            totalRating: {
                              $sum: 1
                            },
                            avg: {
                              $avg: "$rating"
                            }
                          }
                    },
                    {
                        $lookup: {
                            
                            from: 'movie',
                            localField: 'movieId',
                            foreignField: '_id',
                            as: 'Movie Name'
                            
                        }
                    }
                ]);

                return res.json({ code: 200, err: false, movieReviews: movieRatings });

            } catch (err) {
                console.error(err);
                return res.status(500).json({ code: 500, err: true, msg: `Something went wrong`, meta: err });
            }
});

router.get(
    '/all-movie/ratings',
    async (req, res) => {
        try {
            
            const moviesRating = await Rating.aggregate([
                {
                    $group: {
                        _id: "$movieId",
                        totalRating: {
                            $sum: 1
                        },
                        averageRating: {
                            $avg: "$rating"
                        }
                    }
                }
            ]);

            if(!moviesRating){
                return res.json({ msg: `No ratings found` });
            }

            return res.json({ code: 200, err: false, ratings: moviesRating});
            
        } catch (err) {
            console.error(err);
            return res.status(500).json({ code: 500, err: true, msg: `Something went wrong`, meta: err });
        }    
});

router.post(
    '/:movieId/rate',
    auth,
    async (req, res) => {
        try {
            
            const { movieId } = req.params;

            const {
                authorId,
                email,
                comment,
                rating
            } = req.body;

            if(!email || !isMongoId(email)){
                const err = new Error('Invalid user ID');
                return res.json({ code: 400, err: true, msg: `Enter a valid user ID` });
            }

            if(!isString(comment)){
                const err = new Error('Invalid comment type');
                return res.json({ code: 400, err: true, msg: `Comment should be a string`});
            }

            if(!rating || !isNumber(rating) || rating < 1 || rating > 5){
                const err = new Error('Invalid Rating');
                return res.json({ code: 400, err: true, msg: `Invalid Rating count`});
            }

            const movieExists = await Movie.findById({ _id: movieId });

            if(!movieExists){
                return res.json({ code: 404, err: true, msg: `No movie found with movie id ${movieId}` });
            }

            const alreadyRated = await Rating.findOne(
                {
                    movieId: movieId,
                    'author.email': email
                }
            );

            if(alreadyRated){
                return res.json({ code: 400, err: true, msg: `You've already rated this movie`});
            }

            const rate = await Rating.create(
                {
                    movieId,
                    comment,
                    rating,
                    author: {
                        authorId,
                        email
                    }
                }
            );

            return res.json({ code: 200, err: false, msg: `Successfully submitted rating`, data: rate });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ code: 500, err: true, msg: `Something went wrong`, meta: err });
        }
    }
);

module.exports = router;