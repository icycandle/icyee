// try stackoverflow tutor-02.
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.sendRequest(tab.id, {method: "getSelection"}, function(response){
     sendServiceRequest(response.data);
  });
  console.log('Hello');
});

function sendServiceRequest(selectedText) {
  var serviceCall = 'http://www.google.com/search?q=' + selectedText;
  chrome.tabs.create({url: serviceCall});
  console.log(selectedText);
}
// try stackoverflow tutor-02.


// chrome.browserAction.onClicked.addListener(function(tab) {
//   var viewTabUrl = chrome.extension.getURL('image.html');
//   var imageUrl = 'Hypatia.jpeg';

//   // Look through all the pages in this extension to find one we can use.
//   var views = chrome.extension.getViews();
//   for (var i = 0; i < views.length; i++) {
//     var view = views[i];

//     // If this view has the right URL and hasn't been used yet...
//     if (view.location.href == viewTabUrl && !view.imageAlreadySet) {

//       // ...call one of its functions and set a property.
//       view.setImageUrl(imageUrl);
//       view.imageAlreadySet = true;
//       break; // we're done
//     }
//   }
// });
