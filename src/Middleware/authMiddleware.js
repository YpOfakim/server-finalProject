const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "Yoanna@Neomi%FinalProjectSecretKey";

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // שימי את מזהה המשתמש בבקשה - לשימוש בהמשך
    req.userId = decoded.userId;
    next();
  });
}

module.exports = { verifyToken };
