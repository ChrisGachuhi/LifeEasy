const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1] // ✅ Correct token extraction

  if (!token) return res.status(401).json({ message: 'No token provided' })

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decodedToken
    next()
  } catch (err) {
    res
      .status(403)
      .json({ message: 'Invalid or expired token', error: err.message })
  }
}

module.exports = authenticateToken
