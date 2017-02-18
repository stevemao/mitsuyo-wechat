FROM zixia/wechaty

ADD ./dist /opt/webapp/
WORKDIR /opt/webapp

CMD index.js
