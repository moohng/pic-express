// const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const request = require('request');
// const { init: initDB, Counter } = require('./db');

const logger = morgan('tiny');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);

// 首页
// app.get('/', async (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

// 更新计数
app.post('/api/media_check', async (req, res) => {
  const { media_url } = req.query;

  request.post(
    {
      url: 'https://api.weixin.qq.com/wxa/media_check_async',
      json: {
        openid: req.headers['x-wx-openid'],
        version: 2,
        scene: 1,
        media_type: 2,
        media_url,
      },
    },
    function (error, response, body) {
      console.log('============', error, body);
      if (!error) {
        res.send(body);
      } else {
        res.send(error);
      }
    },
  );
});

// 小程序调用，获取微信 Open ID
app.get('/api/wx_openid', async (req, res) => {
  if (req.headers['x-wx-source']) {
    res.send(req.headers['x-wx-openid']);
  }
});

const port = process.env.PORT || 80;

async function bootstrap() {
  // await initDB();
  app.listen(port, () => {
    console.log('启动成功', port);
  });
}

bootstrap();
