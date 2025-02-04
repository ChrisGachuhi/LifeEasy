//Enforce role-based-access-control

function authorizeRole(allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: 'Access Denied: insufficient permission' })
    }

    next()
  }
}

module.exports = authorizeRole
