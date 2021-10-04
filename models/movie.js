const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongooPagination = require('mongoose-paginate-v2')

const movieSchema = new Schema({
    "title": {
        type : String,
        required : [true,"TITLE IS REQUIRED"],
    },
    "trailer" :{
        type : String,
        // match : "^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$",
        required : [true,"TRAILER IS REQUIRED"],
    },
    "poster" : {
        type: String,
        required: true
    },
    "sypnopsis" : {
        type: String,
        required : [true,"SYPNOPSIS IS REQUIRED"]
    },
    "movie_info" : {
        type : Object,
        required : [true,"MOVIE_INFO IS REQUIRED"]
    },
    "rating" : {
        type : Number,
        min : [0 , "MIN REQUIREMENT IS 1"],
        max : [5 , 'MAX REQUIREMENT IS 5 '],
        default : 0
    },
    "watchlist" : {
        type : Array
    },
    "userReviews" : [{
        userId  : mongoose.SchemaTypes.ObjectId,
        userRating : {type : Number , default : 0 , min : [1, "MIN REQUIREMENT IS 1"],max : [[5 , 'MAX REQUIREMENT IS 5 ']]},
        userReview : String,
        username : String,
        
    }],
    "character" : {
        type: Array,
        required : [true,"CHARACTER IS REQUIRED"]
    },
   
  },{
      timestamps : true
  })



  movieSchema.plugin(mongooPagination)
  const Movies = mongoose.model("Movies",movieSchema)


  module.exports = Movies