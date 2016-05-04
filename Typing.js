function Typing(words) {
  this.words = words;
  this.wordIndex = 0;
  this.progress = 0;
  this.alive = true;
}

Typing.prototype.updateTypedWord = function(typedWord) {
  this.progress = 0;
  var word = this.words[this.wordIndex].toLowerCase();
  for (var i = 0; i < typedWord.length; i++) {
    if (typedWord[i] !== word[this.progress]) {
      this.progress = 0;
      continue;
    }
    this.progress += 1;
    if (this.progress >= word.length) {
      this.wordIndex += 1;
      this.progress = 0;
      if (this.wordIndex >= this.words.length) {
        this.alive = false;
      }
      return true;
    }
  }
  return false;
};

Typing.prototype.draw = function(gfx, x, y, fillWord, fillTyped) {
  if (this.wordIndex < this.words.length) {
    var word = this.words[this.wordIndex];
    gfx.fillStyle = fillWord || 'rgba(0, 0, 0, 1.0)';
    gfx.fillText(word, x, y);
    if (this.progress > 0) {
      gfx.fillStyle = fillTyped || 'rgba(255, 255, 255, 0.5)';
      gfx.fillText(word.substr(0, this.progress), x, y);
    }
  }
};
