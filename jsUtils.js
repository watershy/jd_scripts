const fs = require('fs')
const exec = require('child_process').execSync
const fileMap = new Map()

//用于微信执行
function getFileMap(message) {
    fileMap.set('京喜工厂', 'jd_DreamFactory')
    fileMap.set('京东种豆得豆', 'jd_plantBean')
    fileMap.set('京豆变动', 'jd_bean_change')
    fileMap.set('京豆签到', 'jd_bean_sign')
    fileMap.set('测试', 'test')
    return fileMap.get(message)
}

//用于删除日志文件
async function deleteFile(path) {
    const fileExists = await fs.existsSync(path);
    if (fileExists) {
        await fs.unlinkSync(path);
    }
}

//用于执行js文件
async function requireJS(jsName) {
    await exec(`${process.execPath} ./${jsName}.js >> /tmp/log.txt`, {stdio: "inherit"});
    let notice = await fs.readFileSync('/tmp/log.txt', "utf8");
    const index = notice.indexOf('【notice】')
    notice = notice.substring(index + 8,notice.length)
    console.log(`返回内容\n${notice}`)
    await deleteFile('/tmp/log.txt')
    return notice
    // return '执行成功'
}

module.exports = {
    requireJS,
    getFileMap
}