const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {

    try {
        const token = req?.cookies?.token; // using cookie-parser
        if (!token) return res.status(401).json({ message: "No token found" });

        const data = jwt.verify(token, "iloveyoumyan");
        req.id = data.id; // match your payload property
        next();
    } catch (err) {
 
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = { checkAuth };
