
const SMSClient = require('@alicloud/sms-sdk')
const accessKeyId = 'LTAIcmp3qWybqdnm';
const secretAccessKey = 'FY4Of0URgNu7fRJGPwmJhKBsIKTYNy';
/*
 * 发送短信验证码
 */
let smsClient = new SMSClient({
    accessKeyId,
    secretAccessKey
});
const send = async (tel, TemplateCode) => {
    var number = "";
    for (var i = 0; i < 6; i++) {
        number += Math.floor(Math.random() * 10)
    }
    let _ = await smsClient.sendSMS({
        OutId: number,
        PhoneNumbers: tel, //发送的电话号码
        SignName: '木淘网', //认证签名
        TemplateCode, //模板id SMS_165676756
        TemplateParam: '{"code":"' + number + '"}' //特别注意，这里的参数名
    });
    return _;
};
const getDetail = async (tel, SendDate, TemplateCode, code) => {
    let _ = await smsClient.queryDetail({
        PhoneNumber: tel, //发送的电话号码
        SendDate,
        PageSize: '10',
        CurrentPage: "1",
    });
    let {
        Code,
        SmsSendDetailDTOs,
        TotalCount
    } = _;
    if (Code === 'OK') {
        const SendDate = new Date(SmsSendDetailDTOs.SmsSendDetailDTO[0].SendDate);
        const endDate = SendDate.setMinutes(SendDate.getMinutes() + 15);
        const nowDate = new Date().getTime();
        var flag = false;
        var index  = 0;
        // console.log(SmsSendDetailDTOs);
        if (endDate >= nowDate) {
            for (let i = 0; i< Number(TotalCount); i++ ) {
                if (SmsSendDetailDTOs.SmsSendDetailDTO[i].OutId === code && SmsSendDetailDTOs.SmsSendDetailDTO[0].TemplateCode === TemplateCode) {
                    flag = true;
                    index = i;
                }
            }
        }
        if (flag) {
            return {
                flag,
                data: SmsSendDetailDTOs.SmsSendDetailDTO[index]
            }
        } else {
            return {
                flag,
                msg: '请重新获取验证码'
            }
        }
    } else {
        return {
            flag,
            msg: sec.sec.Message
        }
    }
}

module.exports = {
    send,
    getDetail
};