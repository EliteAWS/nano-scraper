
var AWS = require('aws-sdk');
var S3 = new AWS.S3();

module.exports = Handler;

function Handler(config, data, callback) {
  S3.getObject({
    Bucket: config.storage.s3.bucket,
    Key: config.storage.s3.key
  }, function(err, rawHistory) {
    if (err && err.statusCode != 404) {
      console.error('Had an issue hitting S3 Storage backend: %j', err);
      callback(err);
    } else {
      var historyIndex;
      var firstSet;
      if (!err) {
        console.log('Got history back from S3: ', historyIndex);
        historyIndex = JSON.parse(rawHistory.Body.toString());
      } else {
        console.log('Did not find any history, setting to {}...');
        historyIndex = {};
        firstSet = true;
      }
      var newItems = data.filter(function(item) {
        return !historyIndex[item[config.key]];
      });
      console.log('Found %s new items.', newItems.length);
      newItems.forEach(function(item) {
        historyIndex[item[config.key]] = item;
      });
      if (!newItems.length) {
        console.log('Nothing new in page, exiting.');
        return callback(null, []);
      }
      console.log('About to write these back into history: %j', historyIndex);
      S3.putObject({
        Body: JSON.stringify(historyIndex),
        Bucket: config.storage.s3.bucket,
        Key: config.storage.s3.key
      }, function(err, putResult) {
        if (err) {
          console.error('Something went wrong during the publication of the new history information: %j', err);
          return callback(err);
        }
        console.log('Finished putting back the history into the storage backend in S3...');
        if (firstSet) {
          console.log('First time scanning page, exiting.');
          return callback(null, []);
        }
        callback(null, newItems);
      });
    }
  }); 
}

 
