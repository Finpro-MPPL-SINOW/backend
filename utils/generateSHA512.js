const crypto = require('crypto')

const generateSHA512 = (data) => {
  const hash = crypto.createHash('sha512')
  hash.update(data)
  return hash.digest('hex')
}

module.exports = generateSHA512
