// NOTES
// //////////////////////////////
/*
 * plausible: per day price is based on pick up date(IE. if you change drop off date but keep the same pick up day your per day cost will be the same; whereas, vice versa your price will change... need to just play around with pick up dates to determine best deals)
 * confirmed(w/ mxp): rates are high if renting for under 7 days and more than 28 days
 *
 *
 *
 *
 *
 */


var exec = require('child_process').exec, child;
var fs = require('fs');
let htmlBody = fs.readFileSync("./output.txt").toString('utf-8');
let cheerio = require('cheerio');
let moment = require('moment');
let _ = require('lodash');
let countries = require('./countries')

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function buildBody(country, destination, checkoutMoment, returnMoment) {
  let body = {
    pais: country,
    destino: destination,
    fechaRecogida: encodeURIComponent(checkoutMoment.format('ddd, DD/MM/YYYY')),
    fechaDevolucion: encodeURIComponent(returnMoment.format('ddd, DD/MM/YYYY')),

    chkOneWay: 'SI',
    destino_final: 0,
    horarecogida: 9,
    minutosrecogida: 30,
    horarecogida: 9,
    minutosrecogida: 30,
    chkAge: 'SI',
    edad: 35,
    send: null,
    booster: 0,
    child_seat: 0,
    checkoutMoment: checkoutMoment,
    returnMoment: returnMoment,
  }

  return body;
}

function callUrl(body) {
  let userAgentArray = ['Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0', 'Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36 OPR/38.0.2220.41', 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1', 'Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0)', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36'];
  let selectedUserAgent = userAgentArray[Math.floor(Math.random() * 7)];

  let cookieHeader = 'ASPSESSIONIDCASQABSB=LCJFOIFBKDBLCMLBLJGKBPNC; BIGipServerpool_dys_wwwdoyoucarhirecom=264313260.20480.0000; _vwo_uuid_v2=D67DD854ED761E98E35EB3162D64CA47A|2ab3a0aaec16872a797313e14f28f4a4; _vis_opt_s=1%7C; _vis_opt_test_cookie=1; _vwo_uuid=D67DD854ED761E98E35EB3162D64CA47A; _vwo_ds=3%3Aa_0%2Ct_0%3A0%241526047372%3A94.49856321%3A%3A%3A; LANGUAGE=EN; ER=35; FR=06%2F10%2F2018; ajaxdestinofinal=; MD=30; DYSCookie=172%2E25%2E193%2E15; HD=9; HR=9; MR=30; MSG_EXPR_MOSTRADOR=SEY; FD=20%2F10%2F2018; PR=IT; capa_popup_mostrado=SEY; ajaxdestino=MXP01; AUT=TWlsYW4gTWFscGVuc2EgQWlycG9ydA==||MXP01|; DYSCookieTime=14%2F05%2F2018+3%3A02%3A00'

  let curlString = `curl 'https://www.doyoucarhire.com/formulario.asp?idioma=EN' -H 'Connection: keep-alive' -H 'Cache-Control: max-age=0' -H 'Origin: https://www.doyoucarhire.com' -H 'Upgrade-Insecure-Requests: 1' -H 'Content-Type: application/x-www-form-urlencoded' -H 'User-Agent: ${selectedUserAgent}' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8' -H 'Referer: https://www.doyoucarhire.com/index.htm' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: en-US,en;q=0.9' -H 'Cookie: ${cookieHeader}' --data 'pais=${body.pais}&destino=${body.destino}&chkOneWay=SI&destino_final=0&fechaRecogida=${body.fechaRecogida}&horarecogida=9&minutosrecogida=30&fechaDevolucion=${body.fechaDevolucion}&horadevolucion=9&minutosdevolucion=30&chkAge=SI&edad=35&send=&booster=0&child_seat=0' --compressed`

  child = exec(curlString, function (error, stdout, stderr) {
    lineToFind(stdout, body);
  });
}

function lineToFind(body, params) {
  let keyword = 'price pr-euros';
  let $ = cheerio.load(body);
  if ($('.price.pr-euros')[0]) {
    let firstPrice = $('.price.pr-euros')[0].children.find(x => x.type == 'text');
    firstPrice = parseFloat(firstPrice.data);
    console.log(firstPrice, `(${firstPrice /  params.checkoutMoment.diff(params.returnMoment, 'days')})`, ' :::::: ', params.checkoutMoment.format('MM/DD/YYYY'), ' - ', params.returnMoment.format('MM/DD/YYYY'), params.destino, `days ${params.checkoutMoment.diff(params.returnMoment, 'days')}`);
  } else {
    //console.log('errored out: ', body)
  }
}

async function main(options) {
  let italy = countries.find(x => x.country == 'IT');
  console.log(italy.destinations);
  /*for (let destination of italy.destinations) {
    let i = 0;
    callUrl(buildBody('IT', destination.code, moment('2018-10-04').add(i, 'days'), moment('2018-10-20').add(i, 'days')));
    await sleep(Math.floor(Math.random() * 10) * 1000);
  }*/

  for (let i = 0; i < 30; i++) {
    callUrl(buildBody('IT', 'MXP01', moment('2018-09-15')/*.add(i, 'days')*/, moment('2018-09-21').add(i, 'days')));
    await sleep(Math.floor(Math.random() * 5) * 1000);
  }
}

let options = {
  country: 'IT',
  destinations: ['MXP01'],
  checkoutMoment: moment('2018-10-06'),
  numDays: 14,
  returnMoment: moment('2018-10-06').add(this.numDays, 'days'),
  checkoutFlex: 3,
  returnFlex: 0,
}

main();
