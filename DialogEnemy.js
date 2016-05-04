/* global Typing */

function DialogEnemy(x, y, phrase) {
  this.x = x;
  this.y = y;
  this.chosen = false;
  this.typing = new Typing([phrase]);
}

DialogEnemy.prototype.updateTypedWord = function(typedWord) {
  if (this.chosen) {
    return false;
  }
  var res = this.typing.updateTypedWord(typedWord);
  this.chosen = !this.typing.alive;
  return res;
};

DialogEnemy.prototype.draw = function(gfx) {
  gfx.font = '36px sans-serif';
  if (this.chosen) {
    this.typing.progress = 0;
    this.typing.wordIndex = 0;
    this.typing.draw(gfx, this.x, this.y, '#bf360c');
  } else {
    this.typing.draw(gfx, this.x, this.y);
  }
};
