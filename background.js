var translate_tabid = false;

// try stackoverflow tutor-02.
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.sendMessage(tab.id, {method: "getSelection"}, function(response){
    sendServiceRequest(response.data);
  });
});

function sendServiceRequest(selectedText) {
  var serviceCall = 'http://translate.google.com/#en/zh-TW/' + selectedText;
  if (translate_tabid === false) {
    chrome.tabs.create( {url: serviceCall}, function(tab) {
      translate_tabid = tab.id;
    });
  } else {
    chrome.tabs.update( translate_tabid, {url: serviceCall} );
  }
}

chrome.tabs.onRemoved.addListener( function(tabid, info) {
  if (translate_tabid === tabid) {
    translate_tabid = false;
  }
});
// try stackoverflow tutor-02.

// http://stackoverflow.com/questions/6382467/chrome-extension-context-menus-how-to-display-a-menu-item-only-when-there-is-no
var select_text;
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  sendServiceRequest(select_text);
});

chrome.contextMenus.create({
  "title": "icyEE selection text",
  "contexts":["selection"]
});

chrome.extension.onRequest.addListener(function(request) {
  if(request.cmd === "createSelectionMenu") {
    select_text = request.data;
  }
});

// todo: study http://developer.chrome.com/stable/extensions/event_pages.html
