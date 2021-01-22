/*
东东萌宠互助码
此文件为Node.js专用。其他用户请忽略
支持京东N个账号
 */
//云服务器腾讯云函数等NOde.js用户在此处填写东东萌宠的好友码。
// 同一个京东账号的好友互助码用@符号隔开,不同京东账号之间用&符号或者换行隔开,下面给一个示例
// 如: 京东账号1的shareCode1@京东账号1的shareCode2&京东账号2的shareCode1@京东账号2的shareCode2
//一人可以助力五次 ,最后一个不助力
//小号风控
/**
 * 2 4 5 6 7
 * 1 4 5 6 7
 * *********
 * 2 1 5 6 7
 * 2 1 4 5 6
 * 2 1 4 5 6
 * 2 1 4 7 8
 * 8 11
 * 8 11
 * 8 11
 * 8 11
 * *********
 */
let PetShareCodes = [
  'MTEzMzI0OTE0NTAwMDAwMDA0MTgwNjI5Nw==@MTE1NDUwMTI0MDAwMDAwMDQxOTcyNzg1@MTE1NDQ5MzYwMDAwMDAwNDI1MDE1MjU=@MTE1NDUwMTI0MDAwMDAwMDM2NTQ1MDgz@MTE1NDUyMjEwMDAwMDAwNDI2NTAwMDk=',
  'MTAxODcxOTI2NTAwMDAwMDAwOTc4MzY5Mw==@MTE1NDUwMTI0MDAwMDAwMDQxOTcyNzg1@MTE1NDQ5MzYwMDAwMDAwNDI1MDE1MjU=@MTE1NDUwMTI0MDAwMDAwMDM2NTQ1MDgz@MTE1NDUyMjEwMDAwMDAwNDI2NTAwMDk=',
  '@',
  'MTEzMzI0OTE0NTAwMDAwMDA0MTgwNjI5Nw==@MTAxODcxOTI2NTAwMDAwMDAwOTc4MzY5Mw==@MTE1NDQ5MzYwMDAwMDAwNDI1MDE1MjU=@MTE1NDUwMTI0MDAwMDAwMDM2NTQ1MDgz@MTE1NDUyMjEwMDAwMDAwNDI2NTAwMDk=',
  'MTEzMzI0OTE0NTAwMDAwMDA0MTgwNjI5Nw==@MTAxODcxOTI2NTAwMDAwMDAwOTc4MzY5Mw==@MTE1NDUwMTI0MDAwMDAwMDQxOTcyNzg1@MTE1NDQ5MzYwMDAwMDAwNDI1MDE1MjU=@MTE1NDUwMTI0MDAwMDAwMDM2NTQ1MDgz',
  'MTEzMzI0OTE0NTAwMDAwMDA0MTgwNjI5Nw==@MTAxODcxOTI2NTAwMDAwMDAwOTc4MzY5Mw==@MTE1NDUwMTI0MDAwMDAwMDQxOTcyNzg1@MTE1NDQ5MzYwMDAwMDAwNDI1MDE1MjU=@MTE1NDUwMTI0MDAwMDAwMDM2NTQ1MDgz',
  'MTEzMzI0OTE0NTAwMDAwMDA0MTgwNjI5Nw==@MTAxODcxOTI2NTAwMDAwMDAwOTc4MzY5Mw==@MTE1NDUwMTI0MDAwMDAwMDQxOTcyNzg1@MTE1NDUyMjEwMDAwMDAwNDI2NTAwMDk=@MTE1NDQ5OTIwMDAwMDAwNDI4NDcyNzc=',
  'MTE1NDQ5OTIwMDAwMDAwNDI4NDcyNzc=@MTEzMzI0OTE0NTAwMDAwMDAzODM4MzU4Nw==',
  'MTE1NDQ5OTIwMDAwMDAwNDI4NDcyNzc=@MTEzMzI0OTE0NTAwMDAwMDAzODM4MzU4Nw==',
  'MTE1NDQ5OTIwMDAwMDAwNDI4NDcyNzc=@MTEzMzI0OTE0NTAwMDAwMDAzODM4MzU4Nw==',
  'MTE1NDQ5OTIwMDAwMDAwNDI4NDcyNzc=@MTEzMzI0OTE0NTAwMDAwMDAzODM4MzU4Nw==',
  '@',
  ]
// 判断github action里面是否有东东萌宠互助码
if (process.env.PETSHARECODES) {
  if (process.env.PETSHARECODES.indexOf('&') > -1) {
    console.log(`您的东东萌宠互助码选择的是用&隔开\n`)
    PetShareCodes = process.env.PETSHARECODES.split('&');
  } else if (process.env.PETSHARECODES.indexOf('\n') > -1) {
    console.log(`您的东东萌宠互助码选择的是用换行隔开\n`)
    PetShareCodes = process.env.PETSHARECODES.split('\n');
  } else {
    PetShareCodes = process.env.PETSHARECODES.split();
  }
} else if (process.env.JD_COOKIE) {
  console.log(`由于您secret里面未提供助力码，故此处运行将会给脚本内置的码进行助力，请知晓！`)
}
for (let i = 0; i < PetShareCodes.length; i++) {
  const index = (i + 1 === 1) ? '' : (i + 1);
  exports['PetShareCode' + index] = PetShareCodes[i];
}
