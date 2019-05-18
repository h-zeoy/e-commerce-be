var fs = require('fs');
const path = require('path');
// 引入七牛模块  
var qiniu = require("qiniu");
//要上传的空间名
var bucket = 'hxy_commerce';
var imageUrl = 'pr66pkeg3.bkt.clouddn.com'; // 域名名称
var accessKey = 'jC2AWS2XlVesMlHXVaM4b7HZ-MOZ8HxsCH1Evg3J';
var secretKey = 'hlfI6BfngSqJRnjf0nAErdC7Kkj61Q7xndAcHuXe';
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
var options = {
    scope: bucket,
};
var putPolicy = new qiniu.rs.PutPolicy(options);
var uploadToken = putPolicy.uploadToken(mac);
// 修改地区 华北
var config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z1;

const random = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
// 单张图片上传
const cloneupload = ({imgData, imgName}) => {
    //过滤data:URL
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = Buffer.from(base64Data, 'base64');
    return new Promise((resolve, reject) => {
        // 构建图片名
        var fileName = imgName + '.png';
        // 构建图片路径
        var filePath = path.resolve(__dirname, '../public/uploads/' + fileName);

        fs.writeFile(filePath, dataBuffer, function (err) {
            if (err) {
                reject({
                    status: 102,
                    msg: '文件写入失败',
                    error: err
                });
            } else {
                var localFile = filePath;
                var formUploader = new qiniu.form_up.FormUploader(config);
                var putExtra = new qiniu.form_up.PutExtra();
                var key = fileName;
                // 文件上传
                formUploader.putFile(uploadToken, key, localFile, putExtra, function (respErr,
                    respBody, respInfo) {
                    if (respErr) {
                        reject({
                            status: '-1',
                            msg: '上传失败',
                            error: respErr
                        })
                    }
                    if (respInfo.statusCode == 200) {
                        var imageSrc = 'http://' + imageUrl + '/' + respBody.key;
                        resolve(imageSrc);
                    } else {
                        reject({
                            status: '-1',
                            msg: '上传失败',
                            error: JSON.stringify(respBody)
                        });
                    }
                    // 上传之后删除本地文件
                    fs.unlinkSync(filePath);
                });
            }
        });
    });
}


// 多张图片上传
const moreupload = ({imgData, imgName}) => {
    // imgName = imgName.splice(',');
    console.log(imgName);
    let qiniuPromise = imgData.map((baseUrl, index)=> {
        //过滤data:URL
        // console.log(index, baseUrl);
        var base64Data = baseUrl.replace(/^data:image\/\w+;base64,/, "");
        var dataBuffer = Buffer.from(base64Data, 'base64');
        return new Promise((resolve, reject) => {
            // 构建图片名
            var fileName = imgName[index] + '.png';
            // 构建图片路径
            var filePath = path.resolve(__dirname, '../public/uploads/' + fileName);
            fs.writeFile(filePath, dataBuffer, function (err) {
                if (err) {
                    reject({
                        status: 102,
                        msg: '文件写入失败',
                        error: err
                    });
                } else {
                    var localFile = filePath;
                    var formUploader = new qiniu.form_up.FormUploader(config);
                    var putExtra = new qiniu.form_up.PutExtra();
                    var key = fileName;
                    // 文件上传
                    formUploader.putFile(uploadToken, key, localFile, putExtra, function (respErr,
                        respBody, respInfo) {
                        if (respErr) {
                            reject({
                                status: '-1',
                                msg: '上传失败',
                                error: respErr
                            })
                        }
                        if (respInfo.statusCode == 200) {
                            var imageSrc = 'http://' + imageUrl + '/' + respBody.key;
                            resolve(imageSrc);
                        } else {
                            reject({
                                status: '-1',
                                msg: '上传失败',
                                error: JSON.stringify(respBody)
                            });
                        }
                        // 上传之后删除本地文件
                        fs.unlinkSync(filePath);
                    });
                }
            });
        });
    });
    return Promise.all(qiniuPromise);
}
module.exports = {
    //   upload,
    cloneupload,
    moreupload
}