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