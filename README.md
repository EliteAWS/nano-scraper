

## nano-scraper


Uses a configuration and two callbacks for making super lightweight change detection scrapers for structured content.


### Sample Usage
```
// in an index.js file for a Lambda
var NanoScraper = require('nano-scraper');
var ScrapeFunctor = require('./scrape');
var EmitFunctor = require('./emit');
var CONFIG = JSON.parse(fs.readFileSync(__dirname + '/config.json').toString());

exports.handler = NanoScraper({
	scraper: ScrapeFunctor,
	emitter: EmitFunctor, 
	config: CONFIG
});
```

### A `scraper` functor
```
function ScrapeFunctor(config, document, callback) {
	// config is the config object (defined below)
	// document is a JS DOM document object
	// callback(err, arrayOfHashesForAllScrapedObjects)
}
```

### An `emitter` functor
```
function EmitFunctor(config, data, callback) {
	// config is the config object (defined below)
	// data is the array of hashes for all new / diffed content
	// callback(err, completionOrSuccessMessageWhichIsOptional)
}
```

### A `config` object 
```
{
	// The URL to monitor
	"url": "https://aws.amazon.com/new/",
	// Frequency with
	"schedule": "rate(10 minutes)",
	// Custom user emitter config.
	"slack": {
		"hook": {
			"host": "hooks.slack.com",
			"path": "<Your Slack Path>"
		},
		"username": "AWS Feature Bot",
		"channel": "#random"
	},
	// The unique key used on the objects to perform diffs on. Often a URL.
	"key": "name",
	// Must be defined for diffs to work at all. This is your "database".
	"storage": {
		"s3": {
			"bucket": "scraper-storage",
			"key": "aws-whats-new.json"
		}
	}
}
```
