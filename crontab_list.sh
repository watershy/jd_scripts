#必须要的默认定时任务请勿删除
52 */1 * * * sh /app/jd/jd_scripts/docker/default_task.sh >> /app/jd/logs/$(date +\%Y-\%m-\%d)/default_task_$(date +\%H) 2>&1
# 每3天的23:50分清理一次日志
50 23 */3 * * rm -rf /app/jd/logs/$(date +\%Y-\%m-\%d)/*_$(date +\%H)

0 18 * * * sh /app/shell/jd_updateGit >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_updateGit 2>&1

##############短期活动##############
#年货节(活动时间：2021年1月9日-2021年2月9日)
10 8 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /app/jd/jd_scripts/jd_nh.js >> /app/jd/jd_scripts//logs/$(date +\%Y-\%m-\%d)/jd_nh_$(date +\%H) 2>&1
##############长期活动##############
# 签到
0 0,18 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d)/bean_sign && /usr/local/bin/node /app/jd/jd_scripts/jd_bean_sign.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/bean_sign/jd_bean_sign_$(date +\%H) 2>&1
# 京小超兑换奖品
0,30 0 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d)/blueCoin && /usr/local/bin/node /app/jd/jd_scripts/jd_blueCoin.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/blueCoin/jd_blueCoin_$(date +\%H) 2>&1
# 摇京豆
0 0 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /app/jd/jd_scripts/jd_club_lottery.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_club_lottery_$(date +\%H) 2>&1
# 东东农场
5 6-18/6 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d)/fruit && /usr/local/bin/node /app/jd/jd_scripts/jd_fruit.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/fruit/jd_fruit_$(date +\%H) 2>&1
# 京喜财富岛
0 8,13,18 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d)/cfd && /usr/local/bin/node /app/jd/jd_scripts/jx_cfd.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/cfd/jd_cfd_$(date +\%H) 2>&1
# 宠汪汪
15 */2 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /app/jd/jd_scripts/jd_joy.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_joy_$(date +\%H) 2>&1
# 宠汪汪喂食
15 */1 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /app/jd/jd_scripts/jd_joy_feedPets.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_joy_feedPets_$(date +\%H) 2>&1
# 宠汪汪积分兑换奖品
0 0-16/8 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /app/jd/jd_scripts/jd_joy_reward.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_joy_reward_$(date +\%H) 2>&1
# 宠汪汪偷好友积分与狗粮
0 0,6 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /app/jd/jd_scripts/jd_joy_steal.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_joy_steal_$(date +\%H) 2>&1
# 摇钱树
0 */2 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /app/jd/jd_scripts/jd_moneyTree.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_moneyTree_$(date +\%H) 2>&1
# 东东萌宠
5 6-18/6 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_pet && /usr/local/bin/node /app/jd/jd_scripts/jd_pet.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_pet_$(date +\%H) 2>&1
# 京东种豆得豆
0 7-22/1 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /app/jd/jd_scripts/jd_plantBean.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_plantBean_$(date +\%H) 2>&1
# 京东全民开红包
1 1 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /app/jd/jd_scripts/jd_redPacket.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_redPacket_$(date +\%H) 2>&1
# 进店领豆
10 0 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /app/jd/jd_scripts/jd_shop.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_shop_$(date +\%H) 2>&1
# 京东天天加速
8 */3 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /app/jd/jd_scripts/jd_speed.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_speed_$(date +\%H) 2>&1
# 东东超市
11 1-23/5 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d)/superMarket && /usr/local/bin/node /app/jd/jd_scripts/jd_superMarket.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/superMarket/superMarket_$(date +\%H) 2>&1
# 取关京东店铺商品
55 23 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /app/jd/jd_scripts/jd_unsubscribe.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_unsubscribe_$(date +\%H) 2>&1
# 京豆变动通知
0 10 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d)/bean_change && /usr/local/bin/node /app/jd/jd_scripts/jd_bean_change.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/bean_change/jd_bean_change_$(date +\%H) 2>&1
# 京东抽奖机
11 1 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /app/jd/jd_scripts/jd_lotteryMachine.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_lotteryMachine_$(date +\%H) 2>&1
# 京东排行榜
11 9 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /app/jd/jd_scripts/jd_rankingList.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_rankingList_$(date +\%H) 2>&1
# 天天提鹅
18 * * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /app/jd/jd_scripts/jd_daily_egg.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_daily_egg_$(date +\%H) 2>&1
# 金融养猪
12 * * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /app/jd/jd_scripts/jd_pigPet.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_pigPet_$(date +\%H) 2>&1
# 点点券
20 0,20 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /app/jd/jd_scripts/jd_necklace.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_necklace_$(date +\%H) 2>&1
# 京喜工厂
20 * * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /app/jd/jd_scripts/jd_dreamFactory.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_dreamFactory_$(date +\%H) 2>&1
# 东东小窝
16 6 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /app/jd/jd_scripts/jd_small_home.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_small_home_$(date +\%H) 2>&1
# 东东工厂
36 * * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /app/jd/jd_scripts/jd_jdfactory.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_jdfactory_$(date +\%H) 2>&1
# 十元街
36 8,18 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /app/jd/jd_scripts/jd_syj.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_syj_$(date +\%H) 2>&1
# 京东快递签到
23 1 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /app/jd/jd_scripts/jd_kd.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_kd_$(date +\%H) 2>&1
# 京东汽车(签到满500赛点可兑换500京豆)
0 0 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /app/jd/jd_scripts/jd_car.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_car_$(date +\%H) 2>&1
# 领京豆额外奖励(每日可获得3京豆)
33 4 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /app/jd/jd_scripts/jd_bean_home.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_bean_home_$(date +\%H) 2>&1
# 京东直播(每日18豆)
10-20/5 11 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /app/jd/jd_scripts/jd_live.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_live_$(date +\%H) 2>&1
# 微信小程序京东赚赚
10 11 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /app/jd/jd_scripts/jd_jdzz.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_jdzz_$(date +\%H) 2>&1
# 宠汪汪邀请助力
10 10,11 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /app/jd/jd_scripts/jd_joy_run.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_joy_run_$(date +\%H) 2>&1
# 注销京东已开的店铺会员，不是注销京东plus会员，个别店铺无法注销
44 4 * * 6 mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /app/jd/jd_scripts/jd_unbind.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_unbind_$(date +\%H) 2>&1
# crazyJoy自动每日任务
10 7 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /app/jd/jd_scripts/jd_crazy_joy.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_crazy_joy_$(date +\%H) 2>&1
# 京东汽车旅程赛点兑换金豆
0 0 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /app/jd/jd_scripts/jd_car_exchange.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_car_exchange_$(date +\%H) 2>&1
# 导到所有互助码
47 7 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /app/jd/jd_scripts/jd_get_share_code.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_get_share_code_$(date +\%H) 2>&1
# 口袋书店
7 8,12,18 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /app/jd/jd_scripts/jd_bookshop.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_bookshop_$(date +\%H) 2>&1
# 京喜农场
0 9,12,18 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /app/jd/jd_scripts/jd_jxnc.js >> /app/jd/logs/$(date +\%Y-\%m-\%d)/jd_jxnc_$(date +\%H) 2>&1
# 签到领现金
27 7 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /scripts/jd_cash.js >> /scripts/logs/$(date +\%Y-\%m-\%d)/jd_cash_$(date +\%H) 2>&1
# 京喜app签到
39 7 * * * mkdir -p /app/jd/logs/$(date +\%Y-\%m-\%d) && /usr/local/bin/node /scripts/jx_sign.js >> /scripts/logs/$(date +\%Y-\%m-\%d)/jx_sign_$(date +\%H) 2>&1
