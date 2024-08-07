const jwt = require("jsonwebtoken")

function tokenValidation(req, res, next) {
  try {
    const tokenArr = req.headers.authorization.split(" ")
    const token = tokenArr[1]

    const payload = jwt.verify(token, process.env.TOKEN_SECRET)
    
    req.payload = payload

    next()
  } catch (error) {
    res.status(401).json({errorMessage: "Token doesn´t exist mate!"})
  }
}

module.exports = tokenValidation