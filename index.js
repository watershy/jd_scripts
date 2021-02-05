//'use strict';
let notify = require('./sendNotify');
const jsUtils = require('./jsUtils')
exports.main_handler = async (event, context, callback) => {
    let notice
    if (event.queryString) {
        const message = jsUtils.getFileMap(event.queryString.fileName)
        console.log('开始执行' + message + '.js');
        notice = await jsUtils.requireJS(message)
        await notify.sendNotify(message + '.js', notice);
    } else {
        const message = event["Message"]
        for (const v of message.split("&")) {
            console.log('开始执行' + v + '.js');
            delete require.cache[require.resolve('./' + v + '.js')];
            try {
                require('./' + v + '.js')
            } catch (e) {
$.name += `错误`
                console.log(e.message)
                await notify.sendNotify(v + '.js', e.message);
                notice = v + '.js 文件执行失败，请查看日志处理'
            }
        }
    }
    return {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": {"Content-Type": "plain/text"},
        "body": notice
    }
}
