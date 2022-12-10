const bcrpt = require('bcryptjs')

const genHashPassword = (password)=>{
    let salt = bcrpt.genSaltSync(10)
    let hash = bcrpt.hashSync(password, salt)
    return hash
}

const comparePassword = (password, hash)=>{
    let equalsPassword = bcrpt.compareSync(password, hash)
    return equalsPassword
}

module.exports = {genHashPassword, comparePassword}