// const rateLimiter = require('')

const getReq = (req, res, next) => {
  res.status(200).send("This worked")
}

module.exports = getReq;