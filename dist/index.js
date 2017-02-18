'use strict';

require('babel-polyfill');

var _wechaty = require('wechaty');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var bot = _wechaty.Wechaty.instance();

bot.on('scan', function (url, code) {
    var loginUrl = url.replace('qrcode', 'l');
    require('qrcode-terminal').generate(loginUrl);
    console.log(url);
}).on('login', function (user) {
    console.log(user + ' login');
}).on('friend', function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(contact, request) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (!request) {
                            _context.next = 4;
                            break;
                        }

                        _context.next = 3;
                        return request.accept();

                    case 3:
                        console.log('Contact: ' + contact.name() + ' send request ' + request.hello);

                    case 4:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
}()).on('message', function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(m) {
        var contact, content, room, keyroom, _keyroom;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        contact = m.from();
                        content = m.content();
                        room = m.room();

                        if (!m.self()) {
                            _context2.next = 5;
                            break;
                        }

                        return _context2.abrupt('return');

                    case 5:

                        if (room) {
                            console.log('Room: ' + room.topic() + ' Contact: ' + contact.name() + ' Content: ' + content);
                        } else {
                            console.log('Contact: ' + contact.name() + ' Content: ' + content);
                        }

                        m.say("hello how are you");

                        if (!/room/.test(content)) {
                            _context2.next = 16;
                            break;
                        }

                        _context2.next = 10;
                        return _wechaty.Room.find({ topic: "test" });

                    case 10:
                        keyroom = _context2.sent;

                        if (!keyroom) {
                            _context2.next = 16;
                            break;
                        }

                        _context2.next = 14;
                        return keyroom.add(contact);

                    case 14:
                        _context2.next = 16;
                        return keyroom.say("welcome!", contact);

                    case 16:
                        if (!/out/.test(content)) {
                            _context2.next = 25;
                            break;
                        }

                        _context2.next = 19;
                        return _wechaty.Room.find({ topic: "test" });

                    case 19:
                        _keyroom = _context2.sent;

                        if (!_keyroom) {
                            _context2.next = 25;
                            break;
                        }

                        _context2.next = 23;
                        return _keyroom.say("Remove from the room", contact);

                    case 23:
                        _context2.next = 25;
                        return _keyroom.del(contact);

                    case 25:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function (_x3) {
        return _ref2.apply(this, arguments);
    };
}()).init();