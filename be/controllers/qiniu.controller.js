const qn = require('../utils/qiniu');
let result = function (obj,bool){
    if(bool){
        return {status:0,data:obj};
    }else{
        return {status:1,data:obj};
    }
}
const upload = (req, res, next) =>{
    try{
        qn.upImg(req,function(res){
            console.log('res',res);
        });
    }catch(err){
        if(err){
            console.log(err);
        }
    }
}
module.exports = {
    upload
}