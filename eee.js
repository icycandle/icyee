
// english_7000[level]
// 土法煉鋼以至於越長越肥，不過這邊能用就好。

// try stackoverflow tutor-01.
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.method == "getSelection")
      sendResponse({data: window.getSelection().toString()});
    else
      sendResponse({}); // snub them.
});
// try stackoverflow tutor-1.


chrome.extension.sendMessage({greeting: "hello"}, function(response) {
  console.log(response.farewell);
});

// because english_7000 are sorted, we can use better search algorithm.
var getIndexOf = function(words, word) {
    var wordnum = words.length, index = 0, upperbound = wordnum-1, lowerbound = 0, old_index = 0;
    index = Math.floor( wordnum / 2 );
    while (true) {
        old_index = index;
        if ( words[index].toLowerCase() > word ) { 
            upperbound = index;
            index = Math.floor((lowerbound + index) / 2);
        } else if ( words[index].toLowerCase() < word ) { 
            lowerbound = index;
            index = Math.floor((upperbound + index) / 2);
        } else {
            return index;
        }
        // console.log("\tlowerbound:"+lowerbound+"\tindex:"+index+"upperbound:"+upperbound+"\tvs. "+words[old_index]);
        if (old_index === index) { break; }
    }
    return -1 ;
};


var getLevel = function(word) {
    var level, remove_s = 0, remove_es = 0, remove_quots = 0, remove_ed = 0, remove_d = 0, remove_ly = 0, remove_ing = 0, remove_ing_add_e = 0, remove_ies_add_y = 0, remove_ied_add_y = 0, remove_xest = 0, remove_est = 0, remove_est_add_e = 0, remove_ment = 0;
    for (level=1; level<=9; level++) {
        // if ( english_7000[level].indexOf(word) >= 0 ) {
        if ( getIndexOf(english_7000[level], word) >= 0 ) {
            return level;
        }
    }

    if ( word[word.length-1] === 's' ) {
        remove_s = getLevel( word.slice(0, word.length - 1) );
        if ( remove_s > 0 ) { return remove_s; }
        if ( word[word.length-2] === 'e' ) {  // -es
            remove_es = getLevel( word.slice(0, word.length - 2) );
            if ( remove_es > 0 ) { return remove_es; }
            if ( word[word.length-3] === 'i' ) {  // -ies
                remove_ies_add_y = getLevel( word.slice(0, word.length - 3) + 'y' );
                if ( remove_ies_add_y > 0 ) { return remove_ies_add_y; }                
            }
        } else if (( word[word.length-2] === "'" )||( word[word.length-2] === "’" )) {  // -'s or -’s
            remove_quots = getLevel( word.slice(0, word.length - 2) );
            if ( remove_quots > 0 ) { return remove_quots; }
        }
    } else if ( word.slice(word.length-2, word.length) === 'ed' ) {
        remove_ed = getLevel( word.slice(0, word.length - 2) );
        if ( remove_ed > 0 ) { return remove_ed; }
        remove_d = getLevel( word.slice(0, word.length - 1) );
        if ( remove_d > 0 ) { return remove_d; }
        if ( word[word.length-3] === 'i' ) {  // -ied
            remove_ied_add_y = getLevel( word.slice(0, word.length - 3) + 'y' );
            if ( remove_ied_add_y > 0 ) { return remove_ied_add_y; }                
        }
    } else if ( word.slice(word.length-2, word.length) === 'ly' ) {
        remove_ly = getLevel( word.slice(0, word.length - 2) );
        if ( remove_ly > 0 ) { return remove_ly; }
    } else if ( word.slice(word.length-3, word.length) === 'ing' ) {
        remove_ing = getLevel( word.slice(0, word.length - 3) );
        if ( remove_ing > 0 ) { return remove_ing; }
        remove_ing_add_e = getLevel( word.slice(0, word.length - 3)+'e' );
        if ( remove_ing_add_e > 0 ) { return remove_ing_add_e; }
    } else if ( word.slice(word.length-3, word.length) === 'est' ) {
        remove_est = getLevel( word.slice(0, word.length - 3) );
        if ( remove_est > 0 ) { return remove_est; }
        remove_est_add_e = getLevel( word.slice(0, word.length - 3) + 'e' );
        if ( remove_est_add_e > 0 ) { return remove_est_add_e; }
        if (word[word.length-4] === word[word.length-5]) {  // like biggest
            remove_xest = getLevel( word.slice(0, word.length - 4) );
            if ( remove_xest > 0 ) { return remove_xest; }
        }
    } else if ( word.slice(word.length-4, word.length) === 'ment' ) {
        remove_ment = getLevel( word.slice(0, word.length - 4) );
        if ( remove_ment > 0 ) { return remove_ment; }
    }
    return 0;
};

window.getLevel = getLevel;

var eee_colors = [
    'rgba(255,200,200,0.1)',
    'rgba(255,200,200,0.3)',
    'rgba(255,200,200,0.4)',
    'rgba(255,200,200,0.5)',
    'rgba(255,200,200,0.6)',
    'rgba(255,200,200,0.7)',
    'rgba(255,200,200,0.8)'
];

var startCount = function() {
    var words, words_level, sum, analytic, word_box;
    words = $('body').text().split(/[0-9\=\`\~\!\@\#\$\%\^\&\*\(\)\_\+\s<>\,\.\\\/\"\;\:\|\[\]\{\}\?\■\…\♦\–\»\▼\“\”\—]+/);
    words = _.map( words, function(word) { return word.toLowerCase().replace(/^['"]|['"]$/g,''); });
    analytic = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    word_box = [[],[],[],[],[],[],[],[],[],[]];
    words_level = _.map( _.uniq(words), function(word) { 
        var level = getLevel(word);
        word_box[level].push(word);
        return level;
    });
    sum = _.reduce( words_level, function(score, level) {
        analytic[level] += 1;
        return score + level; 
    }, 0);

    console.log(
        "sum:" + sum + "\nanalytic:" + analytic + "\nword_box:\n" +
        "\n\nlevel 1:\t" + word_box[1].join(', ') +
        "\n\nlevel 2:\t" + word_box[2].join(', ') +
        "\n\nlevel 3:\t" + word_box[3].join(', ') +
        "\n\nlevel 4:\t" + word_box[4].join(', ') +
        "\n\nlevel 5:\t" + word_box[5].join(', ') +
        "\n\nlevel 6:\t" + word_box[6].join(', ') +
        "\n\nlevel Toefl-500:\t" + word_box[7].join(', ') +
        "\n\nlevel GRE-basic-1000:\t" + word_box[8].join(', ') +
        "\n\nlevel GRE-advence-500:\t" + word_box[9].join(', ') +
        "\n\nlevel 0:\t" + word_box[0].join(', ')
        );
};
window.startCount = startCount;


var ttt = [];
var firebrand = function($el, word) {
    $el.contents().each(function () {
        if (this.nodeType == 3) { // Text only
            var t = $(this).text();
            console.log(t);
        } else { // Child element
           firebrand($(this), word);
        }
    });
};

window.firebrand = firebrand;

$(function() {
    startCount();
});

// $('p.hidden:contains("click here")').html().replace('click here', '<a href="url">click here</a>');