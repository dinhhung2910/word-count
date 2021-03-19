const express = require('express');
const router = express.Router();
const CountWordWebsite = require('../../utils/countwordwebsite');

router.post('/countword', async(req, res) => {
  try {
    const { home } = req.body;

    let it = CountWordWebsite(home);

    res.status(200).send('ok');
    let sumary = [];
    let total = 0;

    for await (let site of it) {
      console.log(site, ',');
      total += site.countWord;
      sumary.push(site);
    }
    console.log('done!');
    console.log('Total:', total);
    for (let site of sumary) {
      console.log(site.link, site.countWord);
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).send('Server error.');
  }
});

module.exports = router;