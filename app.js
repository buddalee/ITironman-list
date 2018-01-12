const request = require('request')
const async = require('async')
const cheerio = require('cheerio')

// const ironmans = [
//   'https://ithelp.ithome.com.tw/users/20107159/ironman/1325',
//   'https://ithelp.ithome.com.tw/users/20107356/ironman/1315',
//   'https://ithelp.ithome.com.tw/users/20107440/ironman/1355',
//   'https://ithelp.ithome.com.tw/users/20107334/ironman/1335',
//   'https://ithelp.ithome.com.tw/users/20107329/ironman/1286',
//   'https://ithelp.ithome.com.tw/users/20091297/ironman/1330',
//   'https://ithelp.ithome.com.tw/users/20075633/ironman/1375',
//   'https://ithelp.ithome.com.tw/users/20107247/ironman/1312',
//   'https://ithelp.ithome.com.tw/users/20107335/ironman/1337',
//   'https://ithelp.ithome.com.tw/users/20106699/ironman/1283',
//   'https://ithelp.ithome.com.tw/users/20107420/ironman/1381',
// ]
const urls = pageNums(10);
// console.log(urls);
function pageNums(Num) {
  var i = 1;
  var arr = [];
  do {
    arr.push(`https://ithelp.ithome.com.tw/ironman/contest?page=${i}#ir-list`);
    // console.log('url: ', `https: //ithelp.ithome.com.tw/ironman/contest?page=${i}#ir-list`);
    i++;
  } while (i < Num)
  return arr;
}

async.map(urls, getInfo, (err, results) => {
  console.log(results);
})
function getInfo(url, callback) {
  request(url, function (err, res, body) {
    var $ = cheerio.load(body);
    var link = url;
    // var article = $('.profile-header__name').text().trim();
    // var name = $('.profile-header__name a').attr('href').trim();
    // console.log('name: ', name)
    // var title = $('.qa-list__title--ironman').text().trim().replace(' 系列', '')
    // var joinDays = $('.qa-list__info--ironman span').eq(0).text().replace(/[^0-9]/g, '')
    // var posts = $('.qa-list__info--ironman span').eq(1).text().replace(/[^0-9]/g, '')
    // var subscriber = $('.qa-list__info--ironman span').eq(2).text().replace(/[^0-9]/g, '')
    var postList = $('.ir-list').map((index, obj) => {
      console.log($(obj).find('.ir-list__group-topic a').attr('href'));
      return {
        // title: $(obj).find('.qa-list__title').text().trim(),
        // like: $(obj).find('.qa-condition__count').eq(0).text().trim(),
        // comment: $(obj).find('.qa-condition__count').eq(1).text().trim(),
        // view: $(obj).find('.qa-condition__count').eq(2).text().trim(),
        // date: $(obj).find('.qa-list__info-time').text().trim(),
        url: $(obj).find('.ir-list__group-topic a').attr('href').trim(),
      }
    }).get()

    callback(null, {
      postList,
      // name,
      // title,
      link
      // joinDays,
      // posts,
      // subscriber,
      // postList
    });
  })
}
