//'use strict';
exports.main_handler = async (event, context, callback) => {
    try {
        //如果想在一个定时触发器里面执行多个js文件需要在定时触发器的【附加信息】里面填写对应的名称，用 & 链接
        //例如我想一个定时触发器里执行jd_speed.js和jd_bean_change.js，在定时触发器的【附加信息】里面就填写 jd_speed&jd_bean_change
        for (const v of event["Message"].split("&")) {
            //1.执行自己上传的js文件
            delete require.cache[require.resolve('./' + v + '.js')];
            require('./' + v + '.js')
        }
    } catch (e) {
        console.error(e)
    }
}
