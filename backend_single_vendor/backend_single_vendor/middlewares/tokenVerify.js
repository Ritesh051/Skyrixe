const jwt= require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token is required' });
        }

        //  token from the header
        const token = authHeader.split(' ')[1];

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded payload to the request object for access in routes
        req.user = decoded;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = verifyToken;
