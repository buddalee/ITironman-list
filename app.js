const request = require("request");
const async = require("async");
const cheerio = require("cheerio");

const urls = pageNums(1, 131);
function pageNums(first, last) {
  var i = first;
  var arr = [];
  do {
    arr.push(`https://ithelp.ithome.com.tw/ironman/self?page=${i}#ir-list`);
    i++;
  } while (i <= last);
  return arr;
}

async.map(urls, getInfo, (err, results) => {
  let total = 0;
  let totalDatas = [];
  results.map((_results, idx) => {
    let length = 0;

    _results.postList.map(_result => {
      length++;
      totalDatas.push(_result);
    });
    console.log(`page(${idx + 1})length: `, length);
    total = total + length;
  });
  console.log("total: ", total);
  console.log("totalDatas: ", totalDatas);
  let tempDatas = [];
  let ansDatas = [];
  let ansStr = "";
  totalDatas.filter(_data => {
    if (tempDatas.indexOf(_data.title) === -1) {
      // console.log("_data.title", _data.title);
      tempDatas.push(_data.title);
      ansDatas.push(_data);
      ansStr += _data.title + ", " + _data.url + ", ";
      // console.log("tempDatas: ", tempDatas.length);
    }
    // console.log("_data", _data);
    return tempDatas;
  });
  console.log("tempDatas: ", tempDatas.length);
  console.log("ansDatas: ", ansDatas);
  // console.log("ansStr: ", ansStr);
  // writeDoc(ansStr);
});
function getInfo(url, callback) {
  request(url, function(err, res, body) {
    var $ = cheerio.load(body);
    var link = url;
    var postList = $(".ir-list")
      .map((index, obj) => {
        return {
          title: $(obj)
            .find(".ir-list__group-topic a")
            .text()
            .trim(),
          url: $(obj)
            .find(".ir-list__group-topic a")
            .attr("href")
            .trim()
        };
      })
      .get();

    callback(null, {
      postList
    });
  });
}

function writeDoc(datas) {
  var options = {
    method: "GET",
    url:
      "https://script.google.com/macros/s/AKfycbxlb0UwqAckRlRlRHC-sL9PZgL-zwMo0IC7Ri6e-5Peyc5quYxz/exec",
    qs: {
      data: datas,
      sheetUrl:
        "https://docs.google.com/spreadsheets/d/13e7Kyda0gkwzS5MzeiQ_vURoCDS5A2lpb0rK5y5PBSA/edit",
      sheetTag: "工作表1"
    },
    headers: {
      // "Postman-Token": "10df8620-e2e8-fdc2-53a3-a879cfc84477",
      "Cache-Control": "no-cache"
    }
  };

  request(options, function(error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
  });
}
