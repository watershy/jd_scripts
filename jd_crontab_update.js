const $ = new Env('京东cron定时任务');
const ck = require('./jdCookie')
const exec = require('child_process').execSync
const fs = require('fs')
$.notice = ''
!(async () => {
    //拼接js路径和log路径。后续存储至数据库
    const jsPath = 'mkdir -p /app/jd/logs/$(date +\\%Y-\\%m-\\%d)/dirPath && /usr/local/bin/node /app/jd/jd_scripts/js_path'
    const logPath = '/app/jd/logs/$(date +\\%Y-\\%m-\\%d)/dirPath/dirPath_$(date +\\%H)'
    const regexStr = await getCronFile()
    const fileNameList = []
    console.log(`定时任务总数：${regexStr.length - 1}`)
    for (let i = 1; i < regexStr.length; i++) {
        const str = regexStr[i].split(/>>/g)[0].split(/node \/scripts\/| cd \/scripts && node /g)
        //插入数据库
        if (str.length === 2) {
            const notifyTable = []
            const cron = str[0]
            const fileName = str[1].replace('undefined').replace(' ','')
            const dirPath = fileName.replace(/jd_|.js/g,'')
            fileNameList.push(fileName)
            notifyTable.push(cron)
            notifyTable.push(new Date().toLocaleString())
            notifyTable.push(fileName)
            notifyTable.push(jsPath.replace(/dirPath/g,dirPath).replace(/js_path/g,fileName))
            notifyTable.push(logPath.replace(/dirPath/g,dirPath).replace(/js_path/g,fileName))
            let sql = 'select cron from jd_cron_table where file_name = ? and cron is not null'
            let res = await ck.query(sql, [fileName])
            if (res.length === 0) {
                $.notice += `\n新增`
                $.notice += `\n文件名：${fileName} cron：${cron}`
                sql = 'insert into jd_cron_table(cron,date,file_name,js_path,log_path) value(?,?,?,?,?)'
                await ck.query(sql, notifyTable)
            } else if (res[0].cron !== cron ) {
                $.notice += `\n更新`
                $.notice += `\n文件名：${fileName} cron：${cron}`
                sql = 'update jd_cron_table set cron = ?, date = ? where file_name = ?'
                await ck.query(sql, notifyTable)
            }
        }
    }
    //查询是否存在过期活动
    let sql = 'select file_name from jd_cron_table where file_name not in (?) and flag == 0'
    let res = await ck.query(sql, [fileNameList])
    if (res.length !== 0) {
        $.notice += `过期活动：\n`
        for (let i = 0; i <res.length; i++) {
            $.notice += `${res[i].file_name}\n`
        }
        //删除不存在的活动
        sql = 'delete from jd_cron_table where file_name not in (?) and flag == 0'
        await ck.query(sql, [fileNameList])
    }
    await execShell()

})() .catch((e) => {
    $.name += '错误'
    $.notice = e
}).finally(async () => {
    if ($.notice) {
        await ck.methodEnd($)
    } else {
        console.log('没有更新或新增')
        console.log(new Date().toLocaleString())
    }
})
//执行shell命令
function execShell() {
    return new Promise(async resolve => {
        try {
            //从数据库查询所有数据
            let cron = `\n# 定时更新git文件\n`
            cron += `0 18 * * * sh /app/shell/jd_updateGit >> /app/jd/logs/updateGit 2>&1\n\n\n`
            const sql = 'select n.active_name,c.file_name,c.cron,c.js_path,c.log_path,c.flag from jd_cron_table c left join jd_notify_table n on c.file_name = n.file_name where status = 1'
            const cronList = await ck.query(sql)
            for (let i = 0; i < cronList.length; i++) {
                if (cronList[i].flag === 1) {
                    cron += `# ${cronList[i].active_name}\n`
                    cron += `${cronList[i].cron} ${cronList[i].js_path} >> ${cronList[i].log_path} 2>&1\n`
                }
            }
            const cronPath = '/app/jd/cron'
            await fs.writeFileSync(cronPath, cron, 'utf8');
            await exec(`crontab ${cronPath}`);
            // 查看文件result.txt是否存在,如果存在,先删除
            const fileExists = await fs.existsSync(cronPath);
            if (fileExists) {
                await fs.unlinkSync(cronPath);
            }
        }catch (e) {
$.name += `错误`
            $.name += '错误'
            $.notice = e
        } finally {
            resolve();
        }
    })
}
//获取定时任务文件数据
function getCronFile(url = 'https://gitee.com/lxk0301/jd_scripts/raw/master/docker/crontab_list.sh') {
    return new Promise(async resolve => {
        $.get({url,
            headers:{
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
            }}, async (err, resp, data) => {
            const cronList = []
            try {
                if (data) {
                    data = data.split(/\n/g)
                    for (let i = 0; i <data.length; i++) {
                        if (data[i] && !data[i].match(/^#/g)) {
                            cronList.push(data[i])
                        }
                    }
                }
            } catch (e) {
                $.name += `错误`
                await ck.methodEnd($,e)
            } finally {
                resolve(cronList);
            }
        })
        await $.wait(3000)
        resolve();
    })
}

function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
