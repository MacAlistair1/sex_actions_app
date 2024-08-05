// middleware/authenticate.js
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables from .env file

// Placeholder for a blacklist. In a real application, use a database or cache.
const tokenBlacklist = new Set();

function authenticateToken(req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).json({ error: "Access denied" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  // Check if the token is blacklisted
  if (tokenBlacklist.has(token)) {
    return res.status(401).json({ error: "Token is blacklisted" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;

    // Check if token is close to expiring and refresh it
    const now = Math.floor(Date.now() / 1000);
    const expiryTime = verified.exp;
    const refreshTime = 300; // Time in seconds before expiry to refresh

    if (expiryTime - now < refreshTime) {
      const newToken = jwt.sign({ id: verified.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.setHeader("Authorization", `Bearer ${newToken}`);
    }

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(400).json({ error: "Invalid token" });
  }
}

// Function to blacklist a token
function blacklistToken(token) {
  tokenBlacklist.add(token);
}

module.exports = { authenticateToken, blacklistToken };
