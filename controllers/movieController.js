
const Movies = require('../models/movie')
const database = require('../movie_data/databaseMovie')
const { verify } = require('jsonwebtoken')



class MovieController {


    static async createMovie(req,res){   
        try{
          const movie = await Movies.create(req.body)
          return res.status(201).json({status:"success",data : movie})   
        }
        catch(e){
            return res.status(400).json({status : "failed", message : "Error has occured", error : e})
        }
    }


    static async uploadFile (req,res){
        const movie = await Movies.create(database)
        return res.status(200).json({status : "success", message : "data has been created"})
    }


    static async updateWatchlist(req,res){
        const token = req.headers.authorization.split(" ")[1]
        const { id } = verify(token,process.env.JWT_SECRET)
        try{
            const movieId = await Movies.findById(req.params._id)
            if(movieId) {
                const movie = await Movies.findOne({_id: req.params._id,"watchlist" : id})
       
        if(!movie){
            await Movies.findByIdAndUpdate(req.params._id,{
                $push : {
                    "watchlist" : id
            }})
            return res.status(200).json({status : "success ", data : "watchlist added"})
        }
        else{
            const updatedWatchlist = movie.watchlist.filter(e=> e != id)
            await Movies.findByIdAndUpdate(req.params._id,{
                $set : {
                    "watchlist" : updatedWatchlist
                }
            })
            return res.status(200).json({status : "success ", data :updatedWatchlist})
        }
        }
        else throw new Error
            
        }catch(e){
            return res.status(400).json({status : "failed", message : "movieId is not founded"})
        }
    }


    static async showUserWatchlist (req,res){
        const token = req.headers.authorization.split(" ")[1]
        const { id } = verify(token,process.env.JWT_SECRET)
         try{
            const userWatchlist = await Movies.find({"watchlist" : id}).select("watchlist")
            if(userWatchlist.length != 0 ) return res.status(200).json({status:"success", data : userWatchlist})
            else throw new Error
         }catch{
            res.status(400).json({status:"failed",message:"watchlist is not found "})
         }
    }
    
    static async findOverviewById (req,res){
        const overview = []
        const movie = await Movies.findById(req.params._id)
        overview.push({movie_info : movie.movie_info},{sypnopsis : movie.sypnopsis})
        try{
            if(movie.length != 0 ) return res.status(200).json({status : "success" , data : overview })
            else throw new Error
        }catch(e){
            res.status(400).json({status : "failed" , message : "Movie is not found !",error : e}, )
        }
    }


    static async findCharacterById(req,res){
        const character = []
        const movie = await Movies.findById(req.params._id)
        character.push(movie.character)

        try{
            if(movie.length != 0) return res.status(200).json({status : "success" , data : character})
            else throw new Error
        }
        catch{
            res.status(400).json({status : "failed" ,message : "Movie is not found", error : e})
        }
    }


    static async findMovieById(req,res){
        try{
            const movie = await Movies.findById(req.params)
            return res.status(200).json({status : "success", data : movie})
        }catch(e){
            return res.status(400).json({status : "failed", message : " ID is not found ", error : e})
        }
        }


    static async findMovieByTitle(req,res){
        const movie = await Movies.find({"title" : {$regex :new RegExp(req.params.title,"gi")}})
        try{
            if(movie.length!=0)
            return res.status(200).json({status : "success", data : movie})
            else{
                throw new Error
            }
        }catch(e){
            return res.status(400).json({status : "failed", message : " Title is not found ", error : e})
        }
        }

    
    static async findAllMovie(req,res){
        try{
            const movie = await Movies.find()
            return res.status(200).json({status : "success", data : movie})
        }catch(e){
            return res.status(400).json({status : "failed", error : e})
        }
        }


    static async deleteMovieById(req,res){
        try{
            const movie = await Movies.findByIdAndDelete({"_id" : req.params._id})
            return res.status(200).json({status : "success",deletedMovie : movie})
        }catch(e){
            return res.status(400).json({status : "failed", message : e })
        }
    }


    static async updateMovieById(req,res){
        try{
            const movieById = await Movies.findById(req.params._id)
            await Movies.findByIdAndUpdate(req.params._id,{
                "title" : req.body.title ? req.body.title : movieById.title,
                "trailer" : req.body.trailer ? req.body.trailer : movieById.trailer,
                "poster" : req.body.poster ? req.body.poster : movieById.poster,
                "sypnopsis" :req.body.sypnopsis ? req.body.sypnopsis : movieById.sypnopsis,
                "movie_info" : req.body.movie_info ? req.body.movie_info : movieById.movie_info,
                "character" : req.body.character ?req.body.character : movieById.character
            },
            {
                new : true
            })    
            return res.status(200).json({status : "success",data :await Movies.findById(req.params._id)})
        }catch(e){
            return res.status(400).json({status : "failed",message: "_id is not defined", error : e })
        }
    }
    
    static async findByGenre(req,res){  
        const options = {
            page: parseInt(req.query.page,10) || 0,
            limit: parseInt(req.query.limit,10) || 10,
            collation: {
              locale: 'en',
            },
          } 
        try{
            const movie = await Movies.paginate({"movie_info.Genre" : new RegExp(req.query.genre||"","i")},options)
            if(movie.length != 0)
            return res.status(200).json({status : "success",data : movie})
            else{
                throw new Error
            }
        }catch(e){
            return res.status(400).json({status : "failed" , message : "NO SUCH GENRE IS FOUNDED", error : e})
        }
    }

    static async findAllGenre(req,res){
        console.log("ini findAllGenre")
            const allGenre = []
            const movie = await Movies.find()
            movie.forEach(e=>{
                e.movie_info.Genre.forEach(g=>{
                    allGenre.includes(g) ? g :  allGenre.push(g)
                })
            })
            try{
                if(allGenre.length != 0 ) return res.status(200).json({status : "success" , data : allGenre })   
            }catch(e){
                res.status(400).json({status : "failed" , message : "No Genre Found", error : e})
            }                  
    }     
}

module.exports = MovieController