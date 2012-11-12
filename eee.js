
//right click menu
document.addEventListener("mousedown", function(event){
    if(event.button == 2) {
      var select_text = getSelectionInPage();
      chrome.extension.sendRequest({cmd: "createSelectionMenu", data:select_text});
    }
}, true);

var getSelectionInPage = function() {
  var select_text = window.getSelection().toString();
  // if contain iframe, add iframe's getSelection
  var iframes = $('iframe');
  if(iframes.length > 0) {
    var selects = iframes.map(function() {
      var idoc = this.contentDocument;
      if(idoc !== null) {
        return idoc.getSelection().toString();
      } else {
        return '';
      }
    });
    select_text += selects.get().join(' ');
  }
  return select_text;
};

// try stackoverflow tutor-01.
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.method == "getSelection") {
    var select_text = getSelectionInPage();
    sendResponse({ data: select_text });
  } else {
    sendResponse({}); // snub them.
  }
});
// try stackoverflow tutor-1.
// because english_7000 are sorted, we can use better search algorithm.
var getIndexOf = function(words, word) {
    var lowercase_word = word.toLowerCase(),
      wordnum = words.length,
      index = 0,
      upperbound = wordnum - 1,
      lowerbound = 0,
      old_index = 0;

    index = Math.floor(wordnum / 2);
    while(true) {
      old_index = index;
      if(words[index].toLowerCase() > lowercase_word) {
        upperbound = index;
        index = Math.floor((lowerbound + index) / 2);
      } else if(words[index].toLowerCase() < lowercase_word) {
        lowerbound = index;
        index = Math.floor((upperbound + index) / 2);
      } else {
        return index;
      }
      // console.log("\tlowerbound:"+lowerbound+"\tindex:"+index+"upperbound:"+upperbound+"\tvs. "+words[old_index]);
      if(old_index === index) {
        break;
      }
    }
    return -1;
  };

var getLevel = function(word) {
    var level, ii;
    for(level = 1; level <= 9; level++) {
      if(getIndexOf(english_7000[level], word) >= 0) {
        return level;
      }
    }

    if(word[word.length - 1] === 's') {
      ii = getLevel(word.slice(0, word.length - 1)); // remove_s
      if (ii > 0) { return ii; }
      if(word[word.length - 2] === 'e') {
        ii = getLevel(word.slice(0, word.length - 2)); // remove_es
        if (ii > 0) { return ii; }
        if(word[word.length - 3] === 'i') {
          ii = getLevel(word.slice(0, word.length - 3) + 'y'); // remove_ies_add_y
          if (ii > 0) { return ii; }
        }
      } else if((word[word.length - 2] === "'") || (word[word.length - 2] === "’")) {
        ii = getLevel(word.slice(0, word.length - 2)); // remove -'s or -’s
        if (ii > 0) { return ii; }
      }
    } else if(word.slice(word.length - 2, word.length) === 'ed') {
      ii = getLevel(word.slice(0, word.length - 2)); // remove_ed
      if (ii > 0) { return ii; }
      ii = getLevel(word.slice(0, word.length - 1)); // remove_d
      if (ii > 0) { return ii; }
      if(word[word.length - 3] === 'i') { // -ied
        ii = getLevel(word.slice(0, word.length - 3) + 'y'); // remove_ied_add_y
        if (ii > 0) { return ii; }
      }
    }  else if ((word.slice(word.length - 2, word.length) === 'en') && (word[word.length - 3] === word[word.length - 4])) {
      ii = getLevel(word.slice(0, word.length - 3) + 'e'); // ex: hidden -> hide
      if (ii > 0) { return ii; }
    } else if(word.slice(word.length - 1, word.length) === 'y') {
      ii = getLevel(word.slice(0, word.length - 1)); // remove_y
      if (ii > 0) { return ii; }
      if(word.slice(word.length - 2, word.length) === 'ly') {
        ii = getLevel(word.slice(0, word.length - 2)); // remove_ly
        if (ii > 0) { return ii; }
        if(word[word.length - 3] === 'i') {
          ii = getLevel(word.slice(0, word.length - 3) + 'y'); // remove_ily_add_y
          if (ii > 0) { return ii; }
        }
      }
    } else if(word.slice(word.length - 3, word.length) === 'ing') {
      ii = getLevel(word.slice(0, word.length - 3)); // ex: going -> go
      if (ii > 0) { return ii; }
      ii = getLevel(word.slice(0, word.length - 3) + 'e'); // ex: hiding -> hide
      if (ii > 0) { return ii; }
      if (word[word.length - 4] === word[word.length - 5]) {
        ii = getLevel(word.slice(0, word.length - 4)); // ex: mapping -> map
        if (ii > 0) { return ii; }
      }
    } else if(word.slice(word.length - 3, word.length) === 'est') {
      ii = getLevel(word.slice(0, word.length - 3)); // remove_est
      if (ii > 0) { return ii; }
      ii = getLevel(word.slice(0, word.length - 3) + 'e'); // remove_est_add_e
      if (ii > 0) { return ii; }
      if(word[word.length - 4] === word[word.length - 5]) {
        ii = getLevel(word.slice(0, word.length - 4)); // ex: biggest -> big
        if (ii > 0) { return ii; }
      }
    } else {}

    // if(word.slice(word.length - 4, word.length) === 'ment') {
    //   ii = getLevel(word.slice(0, word.length - 4)); // remove_ment
    //   if (ii > 0) { return ii; }
    // }

    if(word.slice(word.length - 4, word.length) === 'less') {
      ii = getLevel(word.slice(0, word.length - 4)); // remove_less
      if (ii > 0) { return ii; }
    }
    return 0;
  };

window.getLevel = getLevel;


var startCount = function(selected_text) {
    var i, words, words_level, sum, analytic, word_box, info_text, info_html, level_name, analytic_html;
    words = selected_text.split(/[0-9\=\`\~\!\@\#\$\%\^\&\*\(\)\_\+\s<>\,\.\\\/\"\;\:\|\[\]\{\}\?\■\…\♦\–\»\▼\“\”\—\‘\’]+/);
    words = _.map(words, function(word) {
      return word.replace(/^['"]|['"]$/g, '');
    });
    analytic = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    word_box = [[], [], [], [], [], [], [], [], [], []];
    level_name = ['undefined', 'level 1', 'level 2', 'level 3', 'level 4', 'level 5', 'level 6', 'Toefl-500', 'GRE-basic-1000', 'GRE-advence-500'];
    words_level = _.map(_.uniq(words), function(word) {
      var level = getLevel(word);
      word_box[level].push(word);
      return level;
    });
    sum = _.reduce(words_level, function(score, level) {
      analytic[level] += 1;
      return score + level;
    }, 0);

    info_html = "<h1>sum of level*wordsNum : <span class='icyee_num'>" + sum + "</span></h1>";

    for(i = 1; i <= 9; i++) {
      if(i === 9) { i = 0; }
      if(word_box[i].length > 0) {
        info_html += "<h3>" + level_name[i] + ": (<span class='icyee_num'>" + word_box[i].length + "</span>)</h3><span class='icyee_word'>";
        info_html += word_box[i].join("</span>, <span class='icyee_word'>") + "</span>";
      }
      if(i === 0) { break; }
    }

    if($('#icyee_text').length === 0) {
      $('body').append('<iframe id="icyee_text" />');
    }

    $('#icyee_text').width('96%').height(400).css('margin', '0 17px 40px 17px').contents().find('body').css('background', '#ffc').html(info_html).find('.icyee_num').css('color', 'maroon').parent('body').find('.icyee_word').css('color', '#333');

    var icyee_text_height = $('#icyee_text').contents().find('body').height() + 24;
    $('#icyee_text').height(icyee_text_height);
  };
window.startCount = startCount;

// run startCount in google translate.
var getHashText = function() {
    if(location.host === "translate.google.com") {
      startCount(location.hash.slice(10)); // slice(10) remove "#en/zh-TW/"
    }
  };
$(getHashText);
$(window).bind('hashchange', getHashText);
