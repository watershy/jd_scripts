const db = require('./utils/db_util')
const notify = require('./sendNotify');

//获取助力码
let getShareCode = function (name, userName) {
    return new Promise(async resolve => {
        const newShareCodes = []
        console.log('开始获取配置文件\n')
        try {
            let sql = 'select help_info from jd_share_code_info where active_name = ? and pt_pin = ?'
            const valueList = [name, userName]
            const helpInfo = await db.query(sql, valueList)
            if (helpInfo.length !== 0) {
                const values = helpInfo[0]['help_info'].split(',')
                sql = 'select share_code from jd_share_code_info where active_name = ? and cookie_id in (?)'
                const shareCodes = await db.query(sql, [name, values])
                for (let i = 0; i < shareCodes.length; i++) {
                    newShareCodes.push(shareCodes[i].share_code)
                }
            }
        } catch (e) {
            console.log(e)
        } finally {
            resolve(newShareCodes)
        }
    })
}

//获取cookie数据
let getCookie = function () {
    return new Promise(async resolve => {
        let res = await db.query('select * from jd_cookie where possessor = \'yyg\'')
        let cookieArr = []
        for (let i = 0; i < res.length; i++) {
            cookieArr.push('pt_pin=' + res[i]['pt_pin'] + ';pt_key=' + res[i]['pt_key'])
        }
        resolve(cookieArr)
    })
}

//查询sql
let query = function (sql, value) {
    return new Promise(async resolve => {
        let res = await db.query(sql, value)
        resolve(res)
    })
}

//关闭连接池
let methodEnd = function ($) {
    return new Promise(async resolve => {
        await notify.sendNotify(`${$.name}`, `${$.notice}`)
        console.log($.notice)
        // await db.close()
        $.done()
        resolve()
    })
}

//导出方法
module.exports = {
    getShareCode,
    getCookie,
    methodEnd,
    query
}
