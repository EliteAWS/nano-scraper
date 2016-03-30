// System modules
var fs = require('fs');
// Package modules
var jsdom = require('jsdom-no-contextify');
// Custom modules
var Differ = require('./differ');


module.exports = ScraperFactory;


function ScraperFactory(options) {
  return function Scrape(event, context) {
    console.log('Beginning Scrape cycle: %j', event);
    jsdom.env(options.config.url, [], function(err, window) {
      if (err) {
        console.error('Problem with JSDOM: %j', err);
        return die(err);
      }
      options.scraper(window.document, function(err, data) {
        if (err) {
          console.error(err);
          return die(err);
        }
        console.log('Got data back from functor: %j', data);
        Differ(options.config, data, function(err, newItems) {
          if (err) {
            console.error('Something went wrong during diffing: %j', err);
            return die(err);
          }
          console.log('Result from diffing: %j', newItems);
          if (!newItems.length) {
            console.log('Exiting, because this was the first run.');
            return context.done();
          }
          options.emitter(config, newItems, function(err, publicationResults) {
            if (err) {
              console.error('Something went wrong during emit: %j', err);
              return die(err);
            }
            console.log('Result from emitting: %j', publicationResults);
            // Passes.
            context.done();
          });
        });
      });
    });
    function die(err) {
      return context.done(err && err.message || 'UNKNOWN FATAL ERROR');
    }
  };
};

