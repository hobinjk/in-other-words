// Gen:
/*
words = {};
for (var k of zn.textContent.split(/\W+/g)) {
  k = k.toLowerCase();
  if (!words[k]) words[k] = 0;
  words[k] += 1;
}
var occWords = Object.keys(words).sort(function(a, b) {
  return words[b] - words[a];
})
*/

// var common = {};
// thousand.forEach(function(word) {
//   common[word.toLowerCase()] = true;
// });
// 
// console.log(common);
// 
// var uncommon = [];
// for (var word of words) {
//   if (common[word]) {
//     continue;
//   }
//   uncommon.push(word);
// }
// document.body.innerHTML = uncommon.join('<br/>');

var wordsDatabase = {};
for (var word of words) {
  if (!wordsDatabase[word.length]) {
    wordsDatabase[word.length] = [];
  }
  wordsDatabase[word.length].push(word);
}

document.body.textContent = JSON.stringify(wordsDatabase);
