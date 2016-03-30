
var https = require('https');

module.exports = PublishToSlack;

function PublishToSlack(config, data, callback) {
  console.log('About to publish data to Slack: %j', data);
  var textContent = [
      '*Found some stuff in AWS What\'s new!*',
      '>>>'
    ]
    .concat(data.map(function(item) {
      return ' - (' + item.date + ') <https:' + item.link + '|' + item.name + '>';
    }))
    .join('\n');
  console.log('This is raw Slack text: \n' + textContent);
  var req = https.request({
    method: 'POST',
    host: config.slack.hook.host,
    path: config.slack.hook.path
  }, function(res) {
    var buffer = [];
    res.on('data', function(chunk) {
      buffer.push(chunk);
    });
    res.on('end', function() {
      var result = buffer.join('');
      console.log('Request to Slack finished: ', result);
      callback(null, result);
    });
  });
  req.on('error', callback);
  req.write(JSON.stringify({
    channel: config.slack.channel || '#general',
    username: config.slack.username,
    text: textContent
  }));
  req.end();
}