require('dotenv').config()
const linebot = require('linebot')
const rp = require('request-promise')

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.listen('/', process.env.PORT, () => {
  console.log('機器人已開啟')
})

bot.on('message', event => {
  if (event.message.type === 'text') {
    const usermsg = event.message.text
    rp('https://www.nstm.gov.tw/Handlers/OpenDataHandler.ashx?ID=8d2ebef5-cf0e-44b7-ae63-513ba3805865&Type=5')
      .then(htmlString => {
        let json = JSON.parse(htmlString)
        json = json.filter(j => {
          if (j.Category === usermsg) return true
          else return false
        })
        if (json.length > 0) event.reply(json[0].ExhibitionName)
        else event.reply('沒有資料')
      }).catch(() => {
        event.reply('發生錯誤')
      })
  }
})
