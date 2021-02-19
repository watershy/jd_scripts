const db = require('./utils/db_util')
const notify = require('./sendNotify');//获取cookie数据
let getCookie = function ($) {
    return new Promise(async resolve => {
        $.cookieMap = new Map()
        let cookieArr = []
        let obj = {
            sql: 'select * from jd_cookie where possessor = \'hyk\''
        }
        try {
            if ($ && $.sql) {
                // sql = 'select * from jd_cookie where id = 1'
                obj.sql = $.sql
                // sql = 'select * from jd_cookie'
            }
            let res = await query(obj)
            for (let i = 0; i < res.length; i++) {
                cookieArr.push('pt_pin=' + res[i]['pt_pin'] + ';pt_key=' + res[i]['pt_key'])
                $.cookieMap.set(res[i]['pt_pin'],res[i]['name'])
            }
            console.log(`共有账号${cookieArr.length}个`)
        } finally {
            resolve(cookieArr)
        }
    })
}//查询sql
let query = function ($) {
    return new Promise(async resolve => {
        let res;
        try {
            res = await db.query($)
        } catch (e) {
            console.log(e)
        } finally {
            resolve(res)
        }
    })
}//关闭连接池
let methodEnd = function ($, notice) {
    return new Promise(async resolve => {
        try {
            if ($.noticeName && notice) {
                //发生错误时通知
                console.log(`${$.noticeName}\n${notice}`)
                await notify.sendNotify(`${$.noticeName}`, `${notice}`)
            } else if (notice) {
                //活动奖励通知
                console.log(notice)
                await notify.sendNotify(`${$.name}`, `${notice}`)
            } else if ($.notice) {
                //执行结束后通知
                console.log($.notice)
                //查询是否需要通知
                $.sql = 'select notify from jd_notify_table where active_name = ?'
                $.values = [$.name]
                let res = await query($)
                if (res.length !== 0 && res[0].notify === 1) {
                    console.log('数据库设置推送开启，开始推送')
                    await notify.sendNotify(`${$.name}`, `${$.notice}`)
                } else {
                    console.log('未开启推送通知')
                }
                $.done()
            }
        } catch (e) {
            $.noticeName = `${$.name}错误`
            await notify.sendNotify(`${$.name}通知错误`, `${e}`)
        } finally {
            resolve()
        }
    })
}
//插入助力码到数据库
let getShareCode = function ($) {
    return new Promise(async resolve => {
        const newShareCodes = []
        try {
            console.log('开始处理助力码数据\n')
            //插入或更新助力码
            $.sql = 'select share_code from jd_share_code_info where pt_pin = ? and active_name = ?'
            $.values = [$.UserName, $.name]
            let res = await query($)
            if (res.length === 0) {
                $.values = [$.name, $.shareCode, $.UserName]
                $.sql = 'insert into jd_share_code_info(cookie_id,pt_pin,active_name,share_code) select id,pt_pin,?,? from jd_cookie where pt_pin = ?;'
                await query($)
            } else if (res[0]['share_code'] !== $.shareCode) {
                $.values = [$.shareCode, new Date().toLocaleString(), $.UserName, $.name]
                $.sql = 'update jd_share_code_info set share_code = ?,remark = ?  where pt_pin = ? and active_name = ?'
                await query($)
            }
            //获取助力码数据
            $.sql = 'select help_info from jd_share_code_info where active_name = ? and pt_pin = ?'
            $.values = [$.name, $.UserName]
            const helpInfo = await query($)
            if (helpInfo.length !== 0 && helpInfo[0]['help_info']) {
                $.values = [$.name, helpInfo[0]['help_info'].split(',')]
                $.sql = 'select share_code from jd_share_code_info where active_name = ? and cookie_id in (?)'
                const shareCodes = await query($)
                for (let i = 0; i < shareCodes.length; i++) {
                    newShareCodes.push(shareCodes[i].share_code)
                }
            } else {
                $.sql = 'select share_code from jd_share_code_info where active_name = ? and cookie_id in (?)'
                $.values = [$.name, '1']
                const shareCodes = await query($)
                for (let i = 0; i < shareCodes.length; i++) {
                    newShareCodes.push(shareCodes[i]['share_code'])
                }
            }
            console.log(`需要帮助的好友助力码： ${newShareCodes}`)
        } catch (e) {
            $.noticeName = `${$.name}错误`
        } finally {
            resolve(newShareCodes)
        }
    })
}
//notice数据处理
let notice = function ($) {
    return new Promise(async resolve => {
        try {
            $.notice += `----------------------------\n`
            if ($.cookieMap.get($.UserName)) {
                $.notice += `【京东账号】${$.cookieMap.get($.UserName)}\n`;
            } else if ($.nickName) {
                $.notice += `【京东账号】${$.nickName}\n`;
            } else {
                $.notice += `【京东账号】${$.UserName}\n`;
            }
        } catch (e) {
            $.noticeName = `${$.name}错误`
            console.log(`错误: ${e}`)
        } finally {
            resolve()
        }
    })
}
function TotalBean(cookie, $) {
    return new Promise(async resolve => {
        $.cookie = cookie
        console.log(`\n******开始【京东账号${$.index}】${$.UserName}*********\n`);
        const options = {
            "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
            "headers": {
                "Accept": "application/json,text/plain, */*",
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "zh-cn",
                "Connection": "keep-alive",
                "Cookie": cookie,
                "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0")
            }
        }
        $.post(options, async (err, resp, data) => {
            if (err) {
                console.log(`${JSON.stringify(err)}`)
                console.log(`${$.name} API请求失败，请检查网路重试`)
            } else {
                if (data) {
                    data = JSON.parse(data);
                    if (data['retcode'] === 13) {
                        $.noticeName = 'cookie过期'
                        await methodEnd($,$.cookieMap.get($.UserName)?$.cookieMap.get($.UserName):$.UserName)
                        $.isLogin = false; //cookie过期
                    }
                    $.nickName = data['base'].nickname;
                    if (data['retcode'] === 0) {
                        $.beanCount = data['base'].jdNum;
                    }
                } else {
                    console.log(`京东服务器返回空数据`)
                }
            }
            resolve(data);
        })
    })
}//导出方法
module.exports = {
    getShareCode,
    getCookie,
    methodEnd,
    query,
    notice,
    TotalBean
}
