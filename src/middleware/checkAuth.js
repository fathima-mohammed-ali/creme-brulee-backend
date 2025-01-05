const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        const decodeToken = jwt.verify(token, "unknown");
        console.log(decodeToken);
        // Add decoded user data to the request object
        req.userData = {
            loginID: decodeToken.loginid,
            username: decodeToken.userId,
            role: decodeToken.role  // Assuming role is stored in the JWT token
        };

        // Check if the user is not a regular user (e.g., admin or other roles)
        if (req.userData.role !== 'user') {
            return res.status(403).json({ message: "Forbidden: Only users can add to the cart!" });
        }


        next();  // Proceed to the next middleware or route handler

    } catch (error) {
        res.status(401).json({ message: "Auth failed!" });
    }
};


