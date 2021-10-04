
const Movies = require('../models/movie')

const {verify} = require('jsonwebtoken')


async function calculateRating (movieId){
    let totalRating = []
    const movie = await Movies.findById(movieId)
    movie.userReviews.forEach(e=>{
        totalRating.push(e.userRating)
    })
    if(totalRating != 0 ){
        totalRating = Math.round(totalRating.reduce((a,b)=>a+b)/movie.userReviews.length)
    }
    else{
        totalRating = 0
    }
    await Movies.findByIdAndUpdate(movieId,{rating :totalRating})
}

function findIndex(arr,value){
    const result = arr.map((e,i)=>{
        if(e.userId == value ) return i
    })
    return Number(result.filter(e=>e).join())
}



class ReviewController {

    static async createReview (req, res) {
        const movieId = req.params.movieId
        const userId = req.user._id
        const username = req.user.name
        const checkReview = await Movies.find({ _id: movieId, "userReviews.userId": userId})
    try {
        if(checkReview.length !=0){
            return res.status(404).json({
                status : "failed",
                message : "You already created review for this movie"
            });
        }
        const saveReview = await Movies.findByIdAndUpdate(movieId,{
            $push:{ 
                "userReviews": {
                "userId" : userId, "userRating": req.body.userRating, "userReview": req.body.userReview, "username": username } }
        }, {new:true}).select("userReviews");
        saveReview.totalUserReview = saveReview.userReviews.length
        calculateRating();
        return res.status(201).json({
            status: "success",
            message: "Review created sucessfully",
            data: saveReview.userReviews.reverse(),
            totalReview: saveReview.totalUserReview
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
    }
    
    static async readAllReview (req, res) {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const movieId = req.params.movieId
        try {
            const findReview = await Movies.findById(movieId)
            const pagReview = findReview.userReviews.reverse().slice((0)*limit, limit*page)
            res.status(200).json({
                status: "success",
                message: "Review retrieved successfully",
                data: pagReview,
                limit: pagReview.length,
                total: findReview.userReviews.length
            });
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                status: "failed",
                message: "Cannot get review"
            });
        }
    }

    static async updateUserReview(req,res){
        const token = req.headers.authorization.split(" ")[1]
        const { id } = verify(token,process.env.JWT_SECRET)
        
    
       try{
        const movie = await Movies.findOneAndUpdate({"_id": req.params._id ,"userReviews.userId" : id},{
            '$set' : {"userReviews.$.userRating" : req.body.userRating,"userReviews.$.userReview" : req.body.userReview }
        })
        calculateRating(req.params._id)
           if(movie.length !=0) return res.status(200).json({status : "success" , data : await Movies.find({_id : req.params._id})})
           else throw new Error
       }catch(e){
           return res.status(400).json({status : "failed", message : "User reviews / movie is not found !",error : e})
       }
    }
       
    static async deleteUserReview(req,res){
        const token = req.headers.authorization.split(" ")[1]
        const { id } = verify(token,process.env.JWT_SECRET)
         
        
        try{
            const findMovie = await Movies.findOne({_id :req.params._id ,"userReviews.userId" : id})
            const deleteIndex = findIndex(findMovie.userReviews, id)
            findMovie.userReviews.splice(deleteIndex,1)
            await Movies.findOneAndUpdate({_id :req.params._id ,"userReviews.userId" : id},findMovie)
            calculateRating(req.params._id)
            const result = await Movies.findOne({_id:req.params._id})
            return  res.status(200).json({status : "success", message: "movie review has been deleted !",totalReview : result.userReviews.length})
        }
        catch(e){
            return res.status(500).json({status : "failed" , message : "Cannot find the review from that user", error : e})
        }
    }


}
module.exports = ReviewController