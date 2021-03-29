const express = require('express');
const Link = require('../../models/Link');
const Request = require('../../models/Request');
const router = express.Router();
const CountWordWebsite = require('../../utils/countwordwebsite');
const GetIPFromRequest = require('../../utils/getIPFromRequest');
const requestSocket = require('../../socket/request');

router.get('/:requestId', async (req, res) => {
  try {
    const requestId = req.params.requestId;

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).send({});
    }

    const links = await Link.find({requestId}).lean();

    const returnRequest = request.toObject();
    Object.assign(returnRequest, {links});

    res.json(returnRequest);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error.');
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      home,
      include,
      exclude,
    } = req.body;

    const request = new Request();
    request.home = home;
    request.IP = GetIPFromRequest(req);
    request.include = include;
    request.exclude = exclude;

    await request.save();

    const it = CountWordWebsite({
      home,
      include,
      exclude,
    }, request._id);

    res.status(200).send({
      requestId: request._id,
    });
    const sumary = [];
    let total = 0;

    for await (const site of it) {
      total += site.countWord;
      sumary.push(site);
      const x = Object.assign(site, {
        crawled: sumary.length,
        total: sumary.length + site.remain,
      });
      requestSocket.sendUpdateToRequest(request._id, x);
    }

    await Request.findByIdAndUpdate(request._id, {
      totalLink: sumary.length,
      totalWord: total,
    });
    requestSocket.sendUpdateToRequest(request._id, {remain: 0});

    // console.log('done!');
    // console.log('Total:', total);
    // for (const site of sumary) {
    //   console.log(site.link, site.countWord);
    // }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error.');
  }
});

router.post('/abort', async (req, res) => {
  try {
    const {requestId} = req.body;

    const request = await Request.findById(requestId);
    if (request) {
      request.isAborted = true;
      await request.save();
    }

    res.status(200).send(true);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error.');
  }
});

module.exports = router;
