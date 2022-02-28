const MovieSchema = require('../models/Movie.js');
const RatingSchema = require('../models/Rating.js');
const passport = require('passport');
/*
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');

const ExtractJWT = passportJWT.ExtractJwt;
const jwtOptions = {};
jwtOptions.jwtFormRequest = ExtractJWT.fromAuthHeaderWithScheme('jwt');
jwtOptions.secretOrKey = 'thisisthesecretkey';
*/
module.exports.controller = (app) => {
    //fetch all movies
    app.get('/movies', passport.authenticate('jwt',{ session: false }), (req,res) => {
        MovieSchema.find({}, 'name description release_year genre', 
        (error,movies) => {
            if (error) {console.log(error)}
            res.send({movies,});
        });
    });
    app.get('/api/movies/:id', (req,res) => {
        MovieSchema.findById(req.params.id, 'name description release_year genre', 
        (error, movie) => {
            if (error) { console.error(error);}
            res.send(movie);
        });
    });
    // rate a movie
    app.post('/movies/rate/:id', (req, res) => {
        const rating = new RatingSchema({
            movie_id: req.params.id,
            user_id: req.body.user_id,
            rate: req.body.rate,
        });

        rating.save(function(error, rating) {
            if (error) { console.log(error); }
            res.send({
                movie_id: rating.movie_id,
                user_id: rating.user_id,
                rate: rating.rate,
            });
        });
    });

    app.post('/movies', (req,res) => {
        const newMoive = new MovieSchema({
            name: req.body.name,
            description: req.body.description,
            release_year: req.body.release_year,
            genre: req.body.genre,
        });

        newMoive.save((error, movie) => {
            if (error) { console.log(error);}
            res.send(movie);
        });
    });
};