/* global Enemy, randomChoice, phrases */

function Game() {
  this.enemies = [];
  this.bosses = [];
  this.enemyCount = 0;
  this.levelLength = 5;
  this.typedChars = [];

  this.canvas = document.getElementById('game');
  this.gfx = this.canvas.getContext('2d');

  this.onResize();

  this.onKeyDown = this.onKeyDown.bind(this);
  document.body.addEventListener('keydown', this.onKeyDown);

  this.lastUpdate = Date.now();
  this.lastSpawn = Date.now();
  this.spawnDelay = 0;
  this.difficulty = 5;

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
  var charMatch = event.key.toLowerCase().match(/^[a-z0-9']$/);
  if (charMatch) {
    this.typedChars.push(charMatch[0]);
  }
  event.preventDefault();
};

Game.prototype.update = function() {
  var dt = Date.now() - this.lastUpdate;

  this.gfx.fillStyle = 'white';
  this.gfx.fillRect(0, 0, this.width, this.height);

  if (this.bosses.length > 0) {
    this.bosses = this.bosses.filter(function(boss) {
      return boss.alive;
    });
    if (this.bosses.length === 0) {
      this.difficulty += 1;
      this.levelLength = Math.floor(Math.pow(this.difficulty, 1.3));
      this.enemyCount = 0;
    }
  } else {
    if (this.lastSpawn + this.spawnDelay < Date.now()) {
      this.lastSpawn = Date.now();
      var targetDifficulty = Math.floor(this.difficulty);
      var newEnemy = new Enemy(this, targetDifficulty);
      this.spawnDelay = newEnemy.difficulty() / targetDifficulty * (Math.random() * 2000 + 2000) +
        Math.random() * 1000;
      this.enemies.push(newEnemy);
      this.enemyCount += 1;
      if (this.enemyCount >= this.levelLength) {
        var bossPhrase = randomChoice(phrases);
        var newBoss = new Enemy(this, targetDifficulty);
        newBoss.setWords(bossPhrase.split(' '));
        newBoss.boss = true;
        this.bosses.push(newBoss);
        this.enemies.push(newBoss);
      }
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

  this.enemies = this.enemies.filter(function(enemy) {
    return enemy.alive;
  });

  this.lastUpdate += dt;
  window.requestAnimationFrame(this.update);
};

Game.prototype.lose = function() {
  console.log('loss');
};
