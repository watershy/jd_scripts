/*
东东农场互助码
此文件为Node.js专用。其他用户请忽略
支持京东N个账号
 */
//云服务器腾讯云函数等NOde.js用户在此处填写京东东农场的好友码。
// 同一个京东账号的好友互助码用@符号隔开,不同京东账号之间用&符号或者换行隔开,下面给一个示例
// 如: 京东账号1的shareCode1@京东账号1的shareCode2&京东账号2的shareCode1@京东账号2的shareCode2
// 一天只能助力四次
let FruitShareCodes = [
  'a9693f789aff4a8a9e487c6ed91ac53e@fe02619c31a148bd8b3259da77a22275@26adcd8683de499392f3aa0998e74a77@44341b8c22664442a504887354a0cca1', // 7 2 4 5
  'e5b40851dd3a4ec9b87b10b27ca2220d@a9693f789aff4a8a9e487c6ed91ac53e@26adcd8683de499392f3aa0998e74a77@44341b8c22664442a504887354a0cca1', // 1 7 4 5
  'e5b40851dd3a4ec9b87b10b27ca2220d@fe02619c31a148bd8b3259da77a22275@26adcd8683de499392f3aa0998e74a77@44341b8c22664442a504887354a0cca1', // 1 2 4 5
  'e5b40851dd3a4ec9b87b10b27ca2220d@fe02619c31a148bd8b3259da77a22275@a9693f789aff4a8a9e487c6ed91ac53e@464e2e6abaf9448ca0bedd4530d86d1a', // 1 2 7 6
  'e5b40851dd3a4ec9b87b10b27ca2220d@fe02619c31a148bd8b3259da77a22275@a9693f789aff4a8a9e487c6ed91ac53e@464e2e6abaf9448ca0bedd4530d86d1a', // 1 2 7 6
  'e5b40851dd3a4ec9b87b10b27ca2220d@fe02619c31a148bd8b3259da77a22275@26adcd8683de499392f3aa0998e74a77@464e2e6abaf9448ca0bedd4530d86d1a', // 1 2 4 6
  '464e2e6abaf9448ca0bedd4530d86d1a@a9693f789aff4a8a9e487c6ed91ac53e@5f729cea296641c5a281d7e6a4921bb3@44341b8c22664442a504887354a0cca1', // 6 7 8 5
  '464e2e6abaf9448ca0bedd4530d86d1a@5f729cea296641c5a281d7e6a4921bb3@44341b8c22664442a504887354a0cca1@26adcd8683de499392f3aa0998e74a77', // 6 8 5 4
  '63aa01bede9748cc993ac65bec9a4d34@e2be75bf898f4744bbba6a81ed4ce3cb',                                                                   // 10 11
  '63aa01bede9748cc993ac65bec9a4d34@e2be75bf898f4744bbba6a81ed4ce3cb',
  '63aa01bede9748cc993ac65bec9a4d34@e2be75bf898f4744bbba6a81ed4ce3cb',
  '63aa01bede9748cc993ac65bec9a4d34@e2be75bf898f4744bbba6a81ed4ce3cb',
  '63aa01bede9748cc993ac65bec9a4d34@e2be75bf898f4744bbba6a81ed4ce3cb',
  '63aa01bede9748cc993ac65bec9a4d34@e2be75bf898f4744bbba6a81ed4ce3cb',
]
// 判断github action里面是否有东东农场互助码
if (process.env.FRUITSHARECODES) {
  if (process.env.FRUITSHARECODES.indexOf('&') > -1) {
    console.log(`您的东东农场互助码选择的是用&隔开\n`)
    FruitShareCodes = process.env.FRUITSHARECODES.split('&');
  } else if (process.env.FRUITSHARECODES.indexOf('\n') > -1) {
    console.log(`您的东东农场互助码选择的是用换行隔开\n`)
    FruitShareCodes = process.env.FRUITSHARECODES.split('\n');
  } else {
    FruitShareCodes = process.env.FRUITSHARECODES.split();
  }
} else if (process.env.JD_COOKIE) {
  console.log(`由于您secret里面未提供助力码，故此处运行将会给脚本内置的码进行助力，请知晓！`)
}
for (let i = 0; i < FruitShareCodes.length; i++) {
  const index = (i + 1 === 1) ? '' : (i + 1);
  exports['FruitShareCode' + index] = FruitShareCodes[i];
}
