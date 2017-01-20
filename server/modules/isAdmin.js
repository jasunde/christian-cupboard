module.exports = function (req, res, next) {
  console.log('req.user', req.user);
  if(req.user.is_admin) {
    next()
  } else {
    res.sendStatus(403)
  }
}
