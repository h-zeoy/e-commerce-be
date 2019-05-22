const codeModel = require('../models/code.model')

const send = async (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header('Content-Type', 'application/json; charset=utf8')
    let {
        tel,
        TemplateCode
    } = req.body;
    //发送短信
    let send = await codeModel.send(tel, TemplateCode)
    if (send.Code === 'OK') {
        res.render('user.view.ejs', {
            success: JSON.stringify(true),
            data: JSON.stringify({
                msg: '短信已发送'
            }),
            code: JSON.stringify(0),
        })
    } else {
        res.render('user.view.ejs', {
            success: JSON.stringify(false),
            data: JSON.stringify({
                msg: send.Message
            }),
            code: JSON.stringify(1),
        })
    }
};
const getDetail = async (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header('Content-Type', 'application/json; charset=utf8');
    let SendDate = getyyyyMMdd();
    let {
        tel,
        TemplateCode,
        code
    } = req.body;
    let sec = await codeModel.getDetail(tel, SendDate, TemplateCode, code);
    if (sec.flag) {
        res.render('user.view.ejs', {
            success: JSON.stringify(true),
            data: JSON.stringify(sec.data),
            code: JSON.stringify(0),
        })
    } else {
        res.render('user.view.ejs', {
            success: JSON.stringify(false),
            data: JSON.stringify(sec.msg),
            code: JSON.stringify(1),
        })
    }
}

function getyyyyMMdd() {
    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1;
    var curr_year = d.getFullYear();
    String(curr_month).length < 2 ? (curr_month = "0" + curr_month) : curr_month;
    String(curr_date).length < 2 ? (curr_date = "0" + curr_date) : curr_date;
    var yyyyMMdd = curr_year + "" + curr_month + "" + curr_date;
    return yyyyMMdd;
}

module.exports = {
    send,
    getDetail
};