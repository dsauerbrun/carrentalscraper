var cheerio = require('cheerio');

var html = `
<optgroup value="0" label="Airports"><option value="AHO01@1">Alghero Airport</option><option value="AOI02">Ancona Airport</option><option value="AOT01">Aosta Airport</option><option value="BRI01">Bari Airport</option><option value="BGY01">Bergamo Airport</option><option value="BLQ01">Bologna Airport</option><option value="BZO01">Bolzano Airport</option><option value="BDS01">Brindisi Airport</option><option value="CAG01@1">Cagliari Airport</option><option value="CTA01@1">Catania Airport</option><option value="COM02@1">Comiso Airport</option><option value="CUF02">Cuneo Airport</option><option value="EBA01">Elba Airport</option><option value="FCO01@1">Fiumicino Airport</option><option value="FLR03">Florence Airport</option><option value="FRL01">Forlì Airport</option><option value="GOA01">Genoa Airport</option><option value="SUF01">Lamezia Terme Airport</option><option value="MIA01">Milan Linate Airport</option><option value="MXP01">Milan Malpensa Airport</option><option value="NAP01">Naples Airport</option><option value="OLB01@1">Olbia Airport</option><option value="PMO01@1">Palermo Airport</option><option value="PMF01">Parma Airport</option><option value="PEG03">Perugia Airport</option><option value="PSR03">Pescara Airport</option><option value="PSA01">Pisa Airport</option><option value="REG02">Reggio Calabria Airport</option><option value="RMI02">Rimini Airport</option><option value="CIA01">Rome Ciampino Airport</option><option value="FCO01">Rome Fiumicino Airport</option><option value="AHO01">Sardinia - Alghero Airport</option><option value="CAG01">Sardinia - Cagliari Airport</option><option value="OLB01">Sardinia - Olbia Airport</option><option value="CTA01">Sicily - Catania Airport</option><option value="COM02">Sicily - Comiso Airport</option><option value="PMO01">Sicily - Palermo Airport</option><option value="PNL01">Sicily - Pantelleria Airport</option><option value="TPS01">Sicily - Trapani Airport</option><option value="MXP02">Somma Lombardo Airport</option><option value="TPS01@1">Trapani Airport</option><option value="TSF01">Treviso Airport</option><option value="TRS01">Trieste Airport</option><option value="TRN01">Turin Airport</option><option value="VCE01">Venice Airport</option><option value="VRN01">Verona Airport</option></optgroup>

`
let $ = cheerio.load(html);
let country = [];
console.log($('option').length)

for (let i = 0; i < $('option').length; i++) {
  var option = $('option')[i];
  country.push({code: option.attribs.value, name: option.children.find(x => x.type == 'text').data, type: 'airport'})
 
}
console.log(country)
