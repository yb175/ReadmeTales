/**
 * Middleware to protect routes by validating both a password header
 * and a GitHub OAuth session token.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Callback to pass control to next middleware
 */
import dotenv from "dotenv";
dotenv.config();
const middleware = (req, res, next) => {
  if (req.headers.password !== process.env.PASSWORD) {
    return res.status(401).send("Unauthorized: Wrong password");
  }
  if (!req.session || !req.session.access_token) {
    return res.status(401).json({ error: "Unauthorized: Login first" });
  }

  req.access_token = req.session.access_token;
  next();
};

export default middleware;