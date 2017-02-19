import 'babel-polyfill'
import {Wechaty, Room} from 'wechaty'
import apiai from 'apiai'
import chalk from 'chalk'
import randomItemInArray from 'random-item-in-array'

const app = apiai("5af28f3bc4774737a5b127cd7f5a1d4f");
const bot = Wechaty.instance()

const defaults = [
  'ちょっと分かりませんでした。',
  '今、なんておっしゃいましたか？',
  'What the fuck are you saying?',
  'あなたは何を言っているの？',
  '你在说他妈的什么？',
  '说啥鸡巴玩意儿',
  '干蛋呢？'
]

const greetings = [
  '拝啓',
  'もしもし',
  '今日は',
  '你好',
  'Hello',
  'Greetings',
  'G\'day mate, how\'s it goin?'
]

bot
.on('scan', (url, code)=>{
    let loginUrl = url.replace('qrcode', 'l')
    require('qrcode-terminal').generate(loginUrl)
    console.log(url)
})

.on('login', user=>{
    console.log(`${user} login`)
})

.on('friend', async function (contact, request){
    if(request){
        await request.accept()
        console.log(`Contact: ${contact.name()} send request ${request.hello}`)
    }
})

.on('message', async function(m){
    let skipSpeech;
    const contact = m.from()
    const content = m.content()
    const room = m.room()

    if(m.self()){
        return
    }

    if (/请先发送朋友验证请求|view it on mobile]/i.test(content)) {
        return
    }

    if (/分享的二维码加入群聊|现在可以开始聊天了。/i.test(content)) {
        m.say(randomItemInArray(greetings))
        return
    }

    if(room){
        console.log(`Room: ${room.topic()} Contact: ${contact.name()} Content: ${content}`)
        if (/mitsuyo|美鶴代|美鹤代/i.test(content)) {
            console.log('Someone mentioned me in the room...')
        } else {
            skipSpeech = true
        }
    } else{
        console.log(`Contact: ${contact.name()} Content: ${content}`)
    }

    const noAtMention = content.replace(/@\w+/ig, '')

    // @ mention doesn't count in the text!
    const request = app.textRequest(noAtMention, {
        sessionId: '1234567890'
    });

    request.on('error', function(error) {
        console.log(chalk.red(error));

        if (!skipSpeech) {
          console.log('Fallback to default response...');
          const doNotUnderstand = randomItemInArray(defaults)
          console.log(chalk.yellow(doNotUnderstand))
          m.say(doNotUnderstand)
        }
    });

    if (!skipSpeech) {
      request.on('response', function(response) {
          const speech = response.result.fulfillment.speech
          console.log(chalk.green(speech));

          m.say(speech)
      });
    }

    request.end();

    if(/ルーム|グループ/.test(content)){
        let keyroom = await Room.find({topic: "test"})
        if(keyroom){
            await keyroom.add(contact)
            await keyroom.say("ようこそ!", contact)
        }
    }

    if(/でる|終了する/.test(content)){
        let keyroom = await Room.find({topic: "test"})
        if(keyroom){
            await keyroom.say("グループから連絡先を削除する: ", contact)
            await keyroom.del(contact)
        }
    }
})

.init()
