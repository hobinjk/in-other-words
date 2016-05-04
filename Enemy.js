/* global demWordsDatabase, repWordsDatabase, Typing */

function Enemy(game, targetDifficulty) {
  this.game = game;
  this.targetDifficulty = targetDifficulty;
  this.boss = false;
  this.sprite = document.getElementById('sprite');

  this.x = this.game.width + 2;
  this.y = Math.random() * (this.game.height - 80) + 40;
  this.alive = true;
  this.words = [];

  var count = Math.ceil(Math.random() * Math.random() * 6 * targetDifficulty / 10);
  // int 2 <= wordLength <= 14
  var wordLength = Math.floor(Math.min(Math.max(targetDifficulty / count, 2),
                                       14));
  var lastWord = '';
  var words = [];
  for (var i = 0; i < count; i++) {
    var chosenWord = '';
    do {
      chosenWord = this.game.biasedRandomChoice(
        demWordsDatabase[wordLength].concat(demWordsDatabase[wordLength + 1]),
        repWordsDatabase[wordLength].concat(repWordsDatabase[wordLength + 1]),
        0.2
      );
    } while(chosenWord === lastWord);
    words.push(chosenWord);
  }
  this.speed = 1;
  this.setWords(words);
}

Enemy.prototype.setWords = function(words) {
  this.words = words;
  this.typing = new Typing(words);
  // Go faster if we're under difficulty budget
  this.speed = Math.max(Math.min(this.targetDifficulty / this.difficulty(), 2), 0.3);
};

Enemy.prototype.difficulty = function() {
  var difficulty = 0;
  for (var word of this.words) {
    difficulty += word.length;
  }
  difficulty *= this.speed;
  return difficulty;
};

Enemy.prototype.update = function(dt) {
  this.x -= this.speed * dt * this.game.speedMult;
};

Enemy.prototype.updateTypedWord = function(typedWord) {
  var res = this.typing.updateTypedWord(typedWord);
  this.alive = this.alive && this.typing.alive;
  return res;
};

Enemy.prototype.draw = function(gfx) {
  if (this.boss) {
    gfx.font = '36px sans-serif';
  } else {
    gfx.font = '24px sans-serif';
  }
  this.typing.draw(gfx, this.x, this.y);
};
