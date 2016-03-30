
module.exports = ScrapeFunctor;

function ScrapeFunctor(config, document, callback) {
  var areaSelector = 'table.table.table-striped.directory-list.table_whats-new-detail';
  var itemSelector = 'tr.directory-item.text.whats-new';
  var area = document.querySelector(areaSelector);
  if (!area) {
    callback({
      message: 'Could not find the main area to select.'
    });
  }
  var result = [].map.call(area.querySelectorAll(itemSelector), getNewPostData);
  console.log('Found results: %j', result);
  callback(null, result);
  function getNewPostData(node) {
    return {
      name: node.querySelector('a').textContent,
      date: node.querySelector('td').textContent,
      link: node.querySelector('a').getAttribute('href')
    };
  }
};