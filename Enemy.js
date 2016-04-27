/* global randomChoice, wordsDatabase */

function Enemy(game, targetDifficulty) {
  this.game = game;
  this.targetDifficulty = targetDifficulty;
  this.boss = false;
  this.sprite = document.getElementById('sprite');

  this.x = this.game.width + 30;
  this.y = Math.random() * (this.game.height - 80) + 40;
  this.alive = true;
  this.progress = 0;
  this.words = [];
  this.wordIndex = 0;

  var count = Math.ceil(Math.random() * Math.random() * 6 * targetDifficulty / 10);
  // int 2 <= wordLength <= 14
  var wordLength = Math.floor(Math.min(Math.max(targetDifficulty / count, 2),
                                       14));
  var lastWord = '';
  var words = [];
  for (var i = 0; i < count; i++) {
    var potentials = wordsDatabase[wordLength];
    potentials = potentials.concat(wordsDatabase[wordLength + 1]);
    var chosenWord = '';
    do {
      chosenWord = randomChoice(potentials);
    } while(chosenWord === lastWord);
    words.push(chosenWord);
  }
  this.speed = 1;
  this.setWords(words);
}

Enemy.prototype.setWords = function(words) {
  this.words = words;
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
  this.x -= this.speed * dt * 0.03;
};

Enemy.prototype.updateTypedWord = function(typedWord) {
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

Enemy.prototype.draw = function(gfx) {
  if (this.boss) {
    gfx.drawImage(this.sprite, this.x, this.y, 80, 70);
  } else {
    gfx.drawImage(this.sprite, this.x, this.y, 30, 26.25);
  }
  if (this.wordIndex < this.words.length) {
    gfx.font = '24px sans-serif';
    var word = this.words[this.wordIndex];
    gfx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    gfx.fillText(word, this.x, this.y - 12);
    if (this.progress > 0) {
      gfx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      gfx.fillText(word.substr(0, this.progress), this.x, this.y - 12);
    }
  }
};
