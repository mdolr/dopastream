const http = require('http');
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');

let stream = 'https://tv.kakao.com/channel/2781080';
let state = require('./state.json').state;

function getStream() {
    axios
        .get('https://web-tv.kakao.com/channel/2781080/video')
        .then((body) => {
            let $ = cheerio.load(body.data);

            let videos = $('.link_contents').toArray();

            if (videos[0] && videos[0].attribs && videos[0].attribs.href && videos[0].attribs.href.includes('livelink')) {
                stream = videos[0].attribs.href;
                state = true;
            } else {
                state = false;
            }

            fs.writeFileSync('./state.json', JSON.stringify({ state: state }));
        })
        .catch(console.error);
}

getStream();
setInterval(() => { getStream(); }, (60 * 1000));

const api = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });
    res.write(JSON.stringify({ state: state, link: stream }));
    res.end();
});

api.listen(7005);