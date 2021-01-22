/*
京喜工厂互助码
此文件为Node.js专用。其他用户请忽略
支持京东N个账号
 */
//云服务器腾讯云函数等NOde.js用户在此处填写东东萌宠的好友码。
// 同一个京东账号的好友互助码用@符号隔开,不同京东账号之间用&符号或者换行隔开,下面给一个示例
// 如: 京东账号1的shareCode1@京东账号1的shareCode2&京东账号2的shareCode1@京东账号2的shareCode2
let shareCodes = [
  'KGnNX6FcLu0etmT_9E8Wgw==@0NzyWUvcLtaNniU6d7DXAg==@ArsWwfx8AMkC92Q2WBbJIg==',// 麋鹿 2 4
  'Wl_FnG0MmzVm8AwKLpsQNQ==@wUjR_aJ43-uLjZU5cS9KGg==@Hx705dOpE2QyGxxK9OxqGA==', // 别人 1 5
  'Wl_FnG0MmzVm8AwKLpsQNQ==@wUjR_aJ43-uLjZU5cS9KGg==@ArsWwfx8AMkC92Q2WBbJIg==', // 别人 1 4
  'wUjR_aJ43-uLjZU5cS9KGg==@0NzyWUvcLtaNniU6d7DXAg==@VEU-3CwOjHW8q0UgooOdgw==', // 1 2 3
  'wUjR_aJ43-uLjZU5cS9KGg==@0NzyWUvcLtaNniU6d7DXAg==@HRARCsjCw94QjvC-BWdVPg==', // 1 2 8
  'wUjR_aJ43-uLjZU5cS9KGg==@wzUfjiJJDs3UluV3eLmK4Q==@VEU-3CwOjHW8q0UgooOdgw==', // 1 7 3
  'wUjR_aJ43-uLjZU5cS9KGg==@EBc-AgTDJf0ROw5IBI9Jlg==@VEU-3CwOjHW8q0UgooOdgw==', // 1 6 3
  'wUjR_aJ43-uLjZU5cS9KGg==@ArsWwfx8AMkC92Q2WBbJIg==', // 1 4
  'wUjR_aJ43-uLjZU5cS9KGg==',
  'wUjR_aJ43-uLjZU5cS9KGg==',
  'wUjR_aJ43-uLjZU5cS9KGg==',
  'wUjR_aJ43-uLjZU5cS9KGg==',
  'wUjR_aJ43-uLjZU5cS9KGg==',
]
// 判断github action里面是否有京喜工厂互助码
if (process.env.DREAM_FACTORY_SHARE_CODES) {
  if (process.env.DREAM_FACTORY_SHARE_CODES.indexOf('&') > -1) {
    console.log(`您的互助码选择的是用&隔开\n`)
    shareCodes = process.env.DREAM_FACTORY_SHARE_CODES.split('&');
  } else if (process.env.DREAM_FACTORY_SHARE_CODES.indexOf('\n') > -1) {
    console.log(`您的互助码选择的是用换行隔开\n`)
    shareCodes = process.env.DREAM_FACTORY_SHARE_CODES.split('\n');
  } else {
    shareCodes = process.env.DREAM_FACTORY_SHARE_CODES.split();
  }
} else if (process.env.DREAM_FACTORY_SHARE_CODES) {
  console.log(`由于您secret里面未提供助力码，故此处运行将会给脚本内置的码进行助力，请知晓！`)
}
for (let i = 0; i < shareCodes.length; i++) {
  const index = (i + 1 === 1) ? '' : (i + 1);
  exports['shareCodes' + index] = shareCodes[i];
}
