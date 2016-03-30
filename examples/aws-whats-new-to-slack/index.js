
var NanoScraper = require('../../index');

var ScrapeFunctor = require('./scrape');
var EmitFunctor = require('./emit');

var CONFIG = JSON.parse(fs.readFileSync(__dirname + '/config.json').toString());

exports.handler = NanoScraper({
  scraper: ScrapeFunctor,
  emitter: EmitFunctor, 
  config: CONFIG
});



