var express = require('express');
var router = express.Router();
var request = require('request');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Web IDE - Online' });
});


router.post('/compile', function (req, res, next) {

  var url = "https://judge0-ce.p.rapidapi.com/submissions";
  request.post({
    url: url, headers: {
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "x-rapidapi-key": "970fff4b9fmshc5bd7be3c828f55p11c03fjsnc0721a037cff", // Get yours for free at https://rapidapi.com/judge0-official/api/judge0-ce/
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      source_code: req.body.source_code,
      language_id: req.body.codeid,
    })
  }, async function (error, response, token) {
    let id = JSON.parse(token);
    if (id.token) {
      let url = "https://judge0-ce.p.rapidapi.com/submissions/" + id.token + "?base64_encoded=true";
      request.get(url, {
        headers: {
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "x-rapidapi-key": "970fff4b9fmshc5bd7be3c828f55p11c03fjsnc0721a037cff", // Get yours for free at https://rapidapi.com/judge0-official/api/judge0-ce/
          "content-type": "application/json",
        }
      }, function (error, response, body) {
        let jsonGetSolution = JSON.parse(body);
        if (jsonGetSolution.stdout) {
          const compilation_out = Buffer.from(jsonGetSolution.stdout, 'base64').toString();
          res.json({ success: compilation_out, status: 200 });
        } else if (jsonGetSolution.stderr) {
          const compilation_err = Buffer.from(jsonGetSolution.stderr, 'base64').toString();
          res.json({ success: compilation_err, status: 500 });
        } else if (jsonGetSolution.stderr == null) {
          res.json({ success: 'An error has been detected', status: 500 });
        }
      });
    }
  });
});


module.exports = router;
