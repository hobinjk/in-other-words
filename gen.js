/*global thousand*/

// Gen:
/*
var zn = document.querySelector('.zn-body__read-all');
var words = {};
for (var k of zn.textContent.split(/[ :?";,()\[\].]+/g)) {
  var key = k.toLowerCase();
  if (!words[key]) words[key] = {
    count: 0,
    text: k
  };

  words[key].count += 1;
  // Default to lower-case
  if (words[key].text != k) {
    words[key].text = key;
  }
}

window.occWords = Object.keys(words).sort(function(a, b) {
  return words[b] - words[a];
});
*/

var common = {};
thousand.forEach(function(word) {
  common[word.toLowerCase()] = true;
});

console.log(common);

var uncommon = [];
for (var unword of words) {
  if (common[unword]) {
    continue;
  }
  uncommon.push(unword);
}
// document.body.innerHTML = uncommon.join('<br/>');

var wordsDatabase = {};
for (var word of uncommon) {
  if (!wordsDatabase[word.length]) {
    wordsDatabase[word.length] = [];
  }
  wordsDatabase[word.length].push(word);
}

document.body.textContent = JSON.stringify(wordsDatabase);
