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
  'G\'day mate, how\'s it goin?',
  '又有人被骗来了...',
  '我好害羞哦。。。',
  '请勿欺负日本小女子！',
  '希望你不是色狼。。。',
  '好友越来越多了耶。。。',
  '你是好人还是坏人？',
  '你是男生还是女生？',
  '别对我动手动脚哦。。。',
  '你看起来有点色。。。我有点怕',
]

function say(m, speech) {
  m.say(speech)
  console.log(chalk.green(speech));
}

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

    if (/请先发送朋友验证请求/i.test(content)) {
        console.log(`${contact.name()} unfriended me`)
        return
    }

    if (/view it on mobile]/i.test(content)) {
        console.log(`Contact: ${contact.name()} Content: ${content}`)
        const doNotUnderstand = randomItemInArray(defaults)
        say(m, doNotUnderstand)
        return
    }

    if (/分享的二维码加入群聊/i.test(content)) {
        console.log(`${contact.name()} just joined room: ${room.topic()}`)
        say(m, randomItemInArray(greetings))
        return
    }

    if (/现在可以开始聊天了/i.test(content)) {
        console.log(`${contact.name()} just added me`)
        say(m, randomItemInArray(greetings))
        return
    }

    if (/邀请你加入了群聊/i.test(content)) {
      console.log(`I'm invited to room: ${room.topic()}`)
      say(m, '大家好，我是美鶴代， 乖巧的日本小女子')
      say(m, '我要和大家聊天，嘻嘻！')
      say(m, 'ありがとう')
      return
    }

    if (/与群里其他人都不是微信朋友关系，请注意隐私安全/i.test(content)) {
      say(m, `欢迎新人 ${contact.name()}`)
      return
    }

    if(room){
        console.log(`Room: ${room.topic()} Contact: ${contact.name()} Content: ${content}`)
        if (/mitsuyo|美鶴代|美鹤代|日本|妹子/i.test(content)) {
            console.log(`I'm mentioned in the room: ${room.topic()}...`)
        } else if (/mitsuyo|美鶴代|美鹤代/.test(room.topic())) {
            console.log(`My room: ${room.topic()}...`)
        } else {
            skipSpeech = true
        }
    } else{
        console.log(`Contact: ${contact.name()} Content: ${content}`)
    }

    if (skipSpeech) {
        return
    }

    const noAtMention = content.replace(/@\w+/ig, '')

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

    // @ mention doesn't count in the text!
    const request = app.textRequest(noAtMention, {
        sessionId: '1234567890'
    });

    request.on('error', function(error) {
        console.log(chalk.red(error));

        if (!skipSpeech) {
          console.log(chalk.yellow('Fallback to default response...'));
          const doNotUnderstand = randomItemInArray(defaults)
          say(m, doNotUnderstand)
        }
    });

    request.on('response', function(response) {
        const speech = response.result.fulfillment.speech

        say(m, speech)
    });

    request.end();
})

.init()
