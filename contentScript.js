function renderTrail(trail) {
  var $trail, linkTitle = '';
  $('body').append('<div class="wikitrail"></div>');
  $trail = $('.wikitrail');
  trail.forEach(function(e) {
    linkTitle = e.split("/").pop();
    $trail.append('<a href="'+ e +'">' + linkTitle + '</a>');
  });
}

chrome.extension.sendMessage({wikitrail: "getTrail"}, function(response) {
  renderTrail(response.trail);
});