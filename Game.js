/* global Enemy, randomChoice, demPhrases, repPhrases, Question */

function Game(biasMult, speedMult) {
  this.enemies = [];
  this.questions = [];
  this.enemyCount = 0;
  this.typedChars = [];
  this.displayedScore = 0;
  this.realScore = 0;
  this.bias = 0;
  this.biasMult = biasMult;
  this.speedMult = speedMult;
  this.lost = false;

  this.canvas = document.getElementById('game');
  this.gfx = this.canvas.getContext('2d');

  this.onResize();
  this.titleX = this.width / 2;

  this.onKeyDown = this.onKeyDown.bind(this);
  document.body.addEventListener('keydown', this.onKeyDown);

  this.lastUpdate = Date.now();
  this.lastSpawn = Date.now();
  this.lastScoreTick = Date.now();
  this.spawnDelay = 0;
  this.difficulty = 5;
  this.levelLength = this.difficulty;

  this.update = this.update.bind(this);
  window.requestAnimationFrame(this.update);
}

Game.prototype.onResize = function() {
  var ratio = window.devicePixelRatio || 1;
  var rect = this.canvas.getBoundingClientRect();
  this.canvas.width = rect.width * ratio;
  this.canvas.height = rect.height * ratio;
  this.width = rect.width;
  this.height = rect.height;
  this.canvas.style.width = rect.width + 'px';
  this.canvas.style.height = rect.height + 'px';
  this.gfx.scale(ratio, ratio);
};

Game.prototype.onKeyDown = function(event) {
  function preventTyping() {
    if (event.ctrlKey || event.metaKey || event.metaKey) {
      return;
    }
    event.preventDefault();
  }

  var charMatch = event.key.toLowerCase().match(/^[a-z0-9'\-\/ ]$/);
  if (charMatch) {
    this.typedChars.push(charMatch[0]);
    preventTyping();
  }
  if (event.key === "Backspace" || event.key === "Delete"
     || event.keyCode == 8 || event.keyCode == 48) {
    if (this.typedChars.length > 0) {
      this.typedChars.pop();
    }
    preventTyping();
  }
};

Game.prototype.update = function() {
  var dt = Date.now() - this.lastUpdate;

  this.gfx.fillStyle = 'white';
  this.gfx.fillRect(0, 0, this.width, this.height);

  this.gfx.font = '36px sans-serif';
  this.gfx.fillStyle = 'rgba(0, 0, 0, 1.0)';
  this.gfx.textAlign = 'center';
  this.gfx.fillText('In Other Words', this.titleX, 36);
  var targetTitleX = this.width / 2 + this.width / 3 * Math.tanh(this.bias / 4);
  this.titleX += dt / 500 * (targetTitleX - this.titleX);

  if (this.lost) {
    this.gfx.fillText('You Lose', this.width / 2, this.height / 2 - 18 - 6);
    this.gfx.fillText(this.realScore, this.width / 2, this.height / 2 + 18 + 6);
    return;
  }

  this.gfx.textAlign = 'end';
  this.gfx.fillText(this.displayedScore, this.width - 12, 12 + 18);
  this.gfx.textAlign = 'start'; // restore


  if (this.questions.length > 0) {
    this.questions = this.questions.filter(function(question) {
      var effect = question.getEffect();
      if (effect === 0) {
        return true;
      }
      this.addBias(effect);
      question.enemies.forEach(function(enemy) {
        enemy.alive = false;
      });
      return false;
    }.bind(this));
    if (this.questions.length === 0) {
      this.difficulty += 5;
      this.levelLength = this.difficulty;
      this.enemyCount = 0;
    }
  } else {
    if (this.enemyCount < this.levelLength) {
      if (this.lastSpawn + this.spawnDelay < Date.now()) {
        this.lastSpawn = Date.now();
        var targetDifficulty = Math.floor(this.difficulty);
        var newEnemy = new Enemy(this, targetDifficulty);
        if (Math.random() < 0.1) {
          var bossPhrase = this.biasedRandomChoice(demPhrases, repPhrases, 0.4);
          newEnemy.setWords(bossPhrase.split(' '));
          newEnemy.boss = true;
        }
        this.spawnDelay = newEnemy.difficulty() / targetDifficulty * (Math.random() * 2000 + 2000) +
          Math.random() * 1000;
        this.enemies.push(newEnemy);
        this.enemyCount += 1;
      }
    } else if (this.enemies.length === 0) {
      var newQuestion = new Question(this, Math.floor(this.difficulty));
      this.questions.push(newQuestion);
      this.enemies = this.enemies.concat(newQuestion.enemies);
    }
  }

  var typedWord = this.typedChars.join('');
  var anyTyped = false;
  for (var enemy of this.enemies) {
    enemy.update(dt);
    anyTyped = anyTyped || enemy.updateTypedWord(typedWord);
    if (enemy.x < 0) {
      this.lose();
      enemy.alive = false;
    }
    enemy.draw(this.gfx);
  }

  if (anyTyped) {
    this.typedChars = [];
  }

  var deaths = this.enemies.filter(function(enemy) {
    return !enemy.alive;
  });

  this.addPoints(deaths.reduce(function(score, enemy) {
    return score + Math.round(enemy.difficulty());
  }, 0));

  this.enemies = this.enemies.filter(function(enemy) {
    return enemy.alive;
  });

  if (this.realScore > this.displayedScore && this.lastScoreTick + 60 < Date.now()) {
    this.displayedScore += 1;
    this.lastScoreTick = Date.now();
  }

  this.lastUpdate += dt;
  window.requestAnimationFrame(this.update);
};

Game.prototype.addPoints = function(points) {
  this.realScore += points;
};

Game.prototype.lose = function() {
  this.lost = true;
};

Game.prototype.addBias = function(bias) {
  this.bias += this.biasMult * bias;
};

Game.prototype.biasedRandomChoice = function(leftArr, rightArr, biasFactor) {
  var rightProb = Math.tanh(this.bias * biasFactor) * 0.5 + 0.5;
  if (Math.random() < rightProb) {
    return randomChoice(rightArr);
  }
  return randomChoice(leftArr);
};
