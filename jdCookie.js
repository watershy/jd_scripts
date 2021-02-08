const db = require('./utils/db_util')
const notify = require('./sendNotify');

//获取助力码
let getShareCode = function (name, userName) {
    return new Promise(async resolve => {
        let newShareCodes = []
        console.log('开始获取配置文件\n')
        try {
            let sql = 'select help_info from jd_share_code_info where active_name = ? and pt_pin = ?'
            const valueList = [name, userName]
            const helpInfo = await query(sql, valueList)
            if (helpInfo.length !== 0 && helpInfo[0]['help_info']) {
                const values = helpInfo[0]['help_info'].split(',')
                sql = 'select share_code from jd_share_code_info where active_name = ? and cookie_id in (?)'
                const shareCodes = await query(sql, [name, values])
                for (let i = 0; i < shareCodes.length; i++) {
                    newShareCodes.push(shareCodes[i].share_code)
                }
            } else {
                sql = 'select share_code from jd_share_code_info where active_name = ? and cookie_id in (?)'
                const shareCodes = await query(sql, [name, '1'])
                for (let i = 0; i < shareCodes.length; i++) {
                    newShareCodes.push(shareCodes[i].share_code)
                }
            }
            console.log(`助力码： ${newShareCodes}`)
        } catch (e) {
            $.noticeName =  `错误`
            console.log(`错误：${e}`)
        } finally {
            resolve(newShareCodes)
        }
    })
}

//获取cookie数据
let getCookie = function (sql) {
    return new Promise(async resolve => {
        let cookieArr = []
        try {
            if (!sql) {
                // sql = 'select * from jd_cookie where id = 1'
                sql = 'select * from jd_cookie where possessor = \'hyk\''
                // sql = 'select * from jd_cookie'
            }
            let res = await query(sql)
            for (let i = 0; i < res.length; i++) {
                cookieArr.push('pt_pin=' + res[i]['pt_pin'] + ';pt_key=' + res[i]['pt_key'])
            }
            console.log(`共有账号${cookieArr.length}个`)
        } finally {
            resolve(cookieArr)
        }
    })
}

//查询sql
let query = function (sql, value) {
    return new Promise(async resolve => {
        let res;
        try {
            res = await db.query(sql, value)
        } finally {
            resolve(res)
        }
    })
}

//关闭连接池
let methodEnd = function ($,notice) {
    return new Promise(async resolve => {
        try {
            if (notice) {
                console.log(notice)
                await notify.sendNotify(`${$.name}`, `${notice}`)
            } else if ($.noticeName) {
                console.log($.notice)
                await notify.sendNotify(`${$.noticeName}`, `${$.notice}`)
            } else if($.notice){
                //查询是否需要通知
                let sql = 'select notify from jd_notify_table where active_name = ?'
                let res = await query(sql, [$.name])
                if (res.length !== 0 && res[0].notify === 1) {
                    console.log('数据库设置推送开启，开始推送')
                    await notify.sendNotify(`${$.name}`, `${$.notice}`)
                } else {
                    console.log('未开启推送通知')
                }
                $.done()
            }
        } catch (e) {
            $.noticeName =  `错误`
            await notify.sendNotify(`${$.name}通知错误`, `${e}`)
            $.done()
        }finally {
            resolve()
        }
    })
}

//插入助力码到数据库
let addShareCode = function ($) {
    return new Promise(async resolve => {
        try {
            let sql = 'select cookie_id from jd_share_code_info where pt_pin = ? and active_name = ?'
            let res = await query(sql, [$.UserName, $.name])
            if (res.length === 0) {
                sql = 'insert into jd_share_code_info(cookie_id,pt_pin,active_name,share_code) select id,pt_pin,?,? from jd_cookie where pt_pin = ?;'
                await query(sql, [$.name, $.shareCode, $.UserName])
            }
        } catch (e) {
            $.noticeName =  `错误`
            console.log('错误')
        } finally {
            resolve()
        }
    })
}

//更新助力码到数据库
let updateShareCode = function ($) {
    return new Promise(async resolve => {
        try {
            let sql = 'select cookie_id from jd_share_code_info where pt_pin = ? and active_name = ?'
            let res = await query(sql, [$.UserName, $.name])
            if (res.length === 0) {
                sql = 'insert into jd_share_code_info(cookie_id,pt_pin,active_name,share_code) select id,pt_pin,?,? from jd_cookie where pt_pin = ?;'
                await query(sql, [$.name, $.shareCode, $.UserName])
            } else {
                sql = 'update jd_share_code_info set share_code = ?,remark = ?  where pt_pin = ? and active_name = ?'
                await query(sql, [$.shareCode, new Date().toLocaleString(), $.UserName, $.name])
            }

        } catch (e) {
            $.noticeName =  `错误`
            console.log(`错误: ${e}`)
        } finally {
            resolve()
        }
    })
}

//notice数据处理
let notice = function ($) {
    return new Promise(async resolve => {
        try {
            $.notice += `\n----------------------------\n`
            if ($.nickName) {
                $.notice += `【京东账号${$.index}】${$.nickName}`;
            } else {
                $.notice += `【京东账号${$.index}】${$.UserName}`;
            }

        } catch (e) {
            $.noticeName =  `错误`
            console.log(`错误: ${e}`)
        } finally {
            resolve()
        }
    })
}

//导出方法
module.exports = {
    getShareCode,
    getCookie,
    methodEnd,
    query,
    addShareCode,
    updateShareCode,
    notice
}
