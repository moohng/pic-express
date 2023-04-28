// const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const request = require('request');
const { init: initDB } = require('./models/db');
const { MediaCheckResult } = require('./models/MediaCheckResult');

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

/**
 * 图片安全检测
 */
app.post('/api/media_check', async (req, res) => {
  const { media_url } = req.body;

  request.post(
    {
      url: 'https://api.weixin.qq.com/wxa/media_check_async',
      json: {
        openid: req.headers['x-wx-openid'],
        version: 2,
        scene: 1,
        media_type: 2,
        media_url: media_url,
      },
    },
    function (error, response, body) {
      if (!error) {
        res.send(body);
      } else {
        res.send(error);
      }
    },
  );
});

/**
 * 获取图片检测结果
 */
app.get('/api/media_check_result', async (req, res) => {
  const { trace_id } = req.query;

  const item = await MediaCheckResult.findByPk(trace_id);
  if (!item) {
    res.send({ code: 100, msg: '未找到检测结果' });
  } else {
    res.send(JSON.parse(item.result));
  }
});

/**
 * 异步推送接口
 */
app.post('/api/media_check_push', async (req, res) => {
  const { trace_id } = req.body;
  console.log('------------=========', trace_id, JSON.stringify(req.body));

  await MediaCheckResult.create({ trace_id, result: JSON.stringify(req.body) });

  res.send('success');
});

// 小程序调用，获取微信 Open ID
app.get('/api/wx_openid', async (req, res) => {
  if (req.headers['x-wx-source']) {
    res.send(req.headers['x-wx-openid']);
  }
});

const port = process.env.PORT || 80;

async function bootstrap() {
  await initDB();
  app.listen(port, () => {
    console.log('启动成功', port);
  });
}

bootstrap();
