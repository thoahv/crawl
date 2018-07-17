
var Crawler = require("crawler");
var db = require('../db');

var c = new Crawler({
    maxConnections: 10,
    // This will be called for each crawled page

});

function getBooks(res) {
    var $ = res.$;
    // $ is Cheerio by default
    //a lean implementation of core jQuery designed specifically for the server
    // console.log("res::",res);
    var list = [];
    $('article').each(async function (i, obj) {
        var data = {};
        image = $(obj).find('img').first().attr('src');
        image = image.replace('..', '');
        data.image = 'http://books.toscrape.com' + image;
        price = $(obj).find('.price_color').first().text().trim();
        price = price.replace('£', "");
        data.price = parseFloat(price);

        data.status = $(obj).find('.instock').text().trim();
        if (!data.status)
            data.status
        var classRate = $(obj).find('.star-rating').first().attr('class');
        var rate = 0;
        if (classRate.indexOf('One') > -1)
            rate = 1
        else if (classRate.indexOf('Two') > -1)
            rate = 2;
        else if (classRate.indexOf('Three') > -1)
            rate = 3;
        else if (classRate.indexOf('Four') > -1)
            rate = 4;
        else if (classRate.indexOf('Five') > -1)
            rate = 5;
        data.rate = rate

        var link = $(obj).find('a').first().attr('href');
        var regex = link.match(/(_)([0-9]+)/);
        data.souceId = regex[2];

        list.push(data);
        // console.log("data::", data);
    })
    return list;
}

function crawlerPromise(options) {
    return new Promise((resolve, reject) => {
        options.callback = (err, res, done) => {
            if (err) {
                reject(err);
            } else {
                resolve(getBooks(res));
            }
            done();
        }
        c.queue(options);
    });
}

exports.crawl = async function (pageNumber) {
    var url = "http://books.toscrape.com/catalogue/page-" + pageNumber + ".html"
    return await crawlerPromise({ uri: url })
}

