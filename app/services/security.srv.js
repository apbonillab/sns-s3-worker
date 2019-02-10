const jwt = require('jsonwebtoken')
//const { JWT_SECRET } = process.env.JWT_SECRET;
var conf = require('../../config.js');
const JWT_SECRET = conf.get('JWT_SECRET')
module.exports = {
generateToken: (email) => {
    return new Promise((resolve, reject) => {
      jwt.sign({email }, JWT_SECRET, { expiresIn: '12h' }, (err, res) => {
        if (err) reject(err)
        else resolve(res)
      })
    })
  },
verifyToken: (token) => {
  return new Promise((resolve, reject) => {
    return jwt.verify(token, JWT_SECRET,(err,res)=>{
      if (err) reject(err)
      else resolve(res)
    })
  })
  }
}