//Ensure routes by authenticated users

const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split('')[1] //extracting the token

  if (!token) return res.status(401).json({ message: 'No token provided' })

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET) //Verify the token
    req.user(decodedToken) //attach token data to the request
    next()
  } catch (err) {
    res
      .status(403)
      .json({ message: 'Invalid or Expired token', error: err.message })
  }
}

module.exports = authenticateToken
