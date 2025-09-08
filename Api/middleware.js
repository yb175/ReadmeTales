/**
 * Middleware to protect routes by validating a password header.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Callback to pass control to next middleware
 */
import dotenv from "dotenv";
dotenv.config();
const midleware =(req,res,next)=>{
    if(req.headers.password === process.env.PASSWORD){
        next();
    }
    else {
        res.status(401).send("Unauthorized");
    }
}

export default midleware ; 