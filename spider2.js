'use strict';
// 引入依赖
var express = require('express');
var cheerio = require('cheerio');
var charset = require('superagent-charset');
var request = require('superagent');
charset(request);


// 建立 express 实例
var app = express();

app.get('/', function (req, res, next) {
    request
    .get('https://www.zhihu.com/search?type=content&q=%E8%A5%BF%E5%AE%89%E4%BA%A4%E9%80%9A%E5%A4%A7%E5%AD%A6')
    .charset('UTF-8')
    .end(function (err, sres) {
      if (err) {
        console.log("****************error***********************");
        return next(err);
      }

      var $ = cheerio.load(sres.text);
      var items = [];
      var str = "";
      var news = $('.contents .js-title-link').each(function(idx,element){
        var $element = $(element);
        items.push({
          related_dialoge_title: $element.text()
        });
      });
      console.log("****************success***********************");
      res.send(items);
    });
});

app.listen(3000, function (req, res) {
  console.log('spider is running at port 3000');
});