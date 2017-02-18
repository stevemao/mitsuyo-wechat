import 'babel-polyfill'
import {Wechaty, Room} from 'wechaty'
import apiai from 'apiai'

const app = apiai("5af28f3bc4774737a5b127cd7f5a1d4f");
const bot = Wechaty.instance()

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
    const contact = m.from()
    const content = m.content()
    const room = m.room()

    if(m.self()){
        return
    }

    if(room){
        console.log(`Room: ${room.topic()} Contact: ${contact.name()} Content: ${content}`)
    } else{
        console.log(`Contact: ${contact.name()} Content: ${content}`)
    }

    var request = app.textRequest(content, {
        sessionId: '1234567890'
    });

    request.on('response', function(response) {
        const speech = response.result.fulfillment.speech
        console.log(speech);

        m.say(speech)
    });

    request.on('error', function(error) {
        console.log(error);
    });

    request.end();

    if(/room/.test(content)){
        let keyroom = await Room.find({topic: "test"})
        if(keyroom){
            await keyroom.add(contact)
            await keyroom.say("welcome!", contact)
        }
    }

    if(/out/.test(content)){
        let keyroom = await Room.find({topic: "test"})
        if(keyroom){
            await keyroom.say("Remove from the room", contact)
            await keyroom.del(contact)
        }
    }
})

.init()
