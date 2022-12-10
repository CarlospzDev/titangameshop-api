const fs = require('fs')


const unlinkFile = async (filePath)=>{

    let response = await fs.unlink(filePath, (err)=>{
        if(err){
            return false
        }else{
            return true
        }
    })

    return response

}

module.exports = {unlinkFile}