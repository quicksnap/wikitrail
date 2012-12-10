/***
* WikiTrail
* -Dan Schuman, 2012
*
*/
function WikiTrail() {
  var that = this;
  this.breadcrumbs = {};
  this.storage = chrome.storage.local;

  this.storage.get("breadcrumbs", function(result) {
    that.breadcrumbs = result['breadcrumbs'] || {};
  });
}

WikiTrail.prototype = {
  push: function(url, tabId) {
    tabId = tabId.toString();
    var index = 0;
    this.breadcrumbs[tabId] = this.breadcrumbs[tabId] || [];

    index = this.breadcrumbs[tabId].indexOf(url);
    
    if(index == -1) {
      // If URL isn't found, append the URL
      this.breadcrumbs[tabId].push(url);
    } else {
      // If URL is inside the chain, drop off the tail end
      this.breadcrumbs[tabId] = this.breadcrumbs[tabId].splice(0,index+1);
    }

    this.storage.set({'breadcrumbs': this.breadcrumbs });
  },
  getTrail: function(tabId) {
    return this.breadcrumbs[tabId] || [];
  },
  destroy: function(tabId) {
    delete this.breadcrumbs[tabId];
    this.storage.set({'breadcrumbs': this.breadcrumbs });
  }
};

var wiki_trail = new WikiTrail();

function wikiListener_beforeNavigate(details) {
  var tabId = details.tabId, url = details.url;
  wiki_trail.push(url, tabId);
}

filter = { "url": [ {"hostSuffix": "wikipedia.org"} ] };

chrome.webNavigation.onBeforeNavigate.addListener(wikiListener_beforeNavigate, filter);
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  wiki_trail.destroy(tabId);
});

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {

    if (request.wikitrail == "getTrail" && sender.tab)
      sendResponse({trail: wiki_trail.getTrail(sender.tab.id)});
  });


