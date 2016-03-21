'use strict';
// 引入依赖
var fs = require('fs');
  //var request = require("request");
var express = require('express');
var cheerio = require('cheerio');
var charset = require('superagent-charset');
var request = require('superagent');
charset(request);


// 建立 express 实例
var app = express();
var dir = './img';

app.get('/', function (req, res, next) {
    request
    .get('https://www.douban.com/photos/album/125096918/')
    .charset('UTF-8')
    .end(function (err, sres) {
      if (err) {
        console.log("****************error***********************");
        return next(err);
      }

      var $ = cheerio.load(sres.text);
      var items = [];
      var str = "";
      var news = $('.photolst img').each(function(idx,element){
        var $element = $(element);
        items.push({
          img_link: $element.attr('src')
        });
        //download($element.attr('src'), dir, Math.floor(Math.random()*100000) + $element.attr('src').substr(-4,4));
        var dest_filename = getFileName($element.attr('src'));
        res.download( '/'+dest_filename, '/img/'+ Math.random()*1000+'.jpg' , function(err){
          if (err) {
              console.log("error");
          } else {
            console.log("correct");
          }
        });
        console.log("Downloading file:" + $element.attr('src') + "...Done.");
      });
      console.log("****************success***********************");
      
      res.send(items);

    });
});

//下载方法
  var download = function(url, dir, filename){
    request.head(url, function(err, res, body){
      request(url).pipe(fs.createWriteStream(dir + "/" + filename));
    });
  };

  var getFileName = function(fullUrl){
    var filename = fullUrl.match("[^/]+$");
    return filename;
  }

app.listen(3000, function (req, res) {
  console.log('spider is running at port 3000');
});