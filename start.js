/* global DialogEnemy, Game */

// Copy-pasted from Game because deadlines
function StartState() {
  this.enemies = [];
  this.questions = [];
  this.enemyCount = 0;
  this.typedChars = [];
  this.bias = 0;

  this.canvas = document.getElementById('game');
  this.gfx = this.canvas.getContext('2d');

  this.onResize();
  this.titleX = this.width / 2;

  this.onKeyDown = this.onKeyDown.bind(this);
  document.body.addEventListener('keydown', this.onKeyDown);

  this.lastUpdate = Date.now();

  this.update = this.update.bind(this);
  window.requestAnimationFrame(this.update);

  this.tutorialEnemy = new DialogEnemy(30, this.height / 2 - 200, 'Type the words that you agree with:');
  this.easyEnemy = new DialogEnemy(this.width / 3, this.height / 2 - 100, 'I am bad at typing');
  this.mediumEnemy = new DialogEnemy(this.width / 3, this.height / 2, 'I am good at typing');
  this.hardEnemy = new DialogEnemy(this.width / 3, this.height / 2 + 100, 'I am great at typing');
  this.affirmEnemy = new DialogEnemy(this.width * 0.6, this.height / 2 - 100, 'I want my views to be affirmed');
  this.challengeEnemy = new DialogEnemy(this.width * 0.6, this.height / 2, 'I want my views to be challenged');
  this.otherTutorialEnemy = new DialogEnemy(30, this.height / 2 + 200, 'Do not let any words get away');

  this.enemies = [
    this.tutorialEnemy,
    this.easyEnemy,
    this.mediumEnemy,
    this.hardEnemy,
    this.affirmEnemy,
    this.challengeEnemy,
    this.otherTutorialEnemy
  ];
}

StartState.prototype.onResize = function() {
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

StartState.prototype.onKeyDown = function(event) {
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
  if (event.key === "Backspace" || event.key === "Delete") {
    if (this.typedChars.length > 0) {
      this.typedChars.pop();
    }
    preventTyping();
  }
};

StartState.prototype.difficultyChosen = function() {
  return this.easyEnemy.chosen || this.mediumEnemy.chosen || this.hardEnemy.chosen;
};
StartState.prototype.biasChosen = function() {
  return this.affirmEnemy.chosen || this.challengeEnemy.chosen;
};

StartState.prototype.update = function() {
  var dt = Date.now() - this.lastUpdate;

  this.gfx.fillStyle = 'white';
  this.gfx.fillRect(0, 0, this.width, this.height);

  this.gfx.font = '36px sans-serif';
  this.gfx.fillStyle = 'rgba(0, 0, 0, 1.0)';
  this.gfx.textAlign = 'center';
  this.gfx.fillText('In Other Words', this.titleX, 36);
  var targetTitleX = this.width / 2 + this.width / 3 * Math.tanh(this.bias / 4);
  this.titleX += dt / 500 * (targetTitleX - this.titleX);

  this.gfx.textAlign = 'start'; // restore

  var typedWord = this.typedChars.join('');
  var anyTyped = false;

  if (!this.difficultyChosen()) {
    this.easyEnemy.updateTypedWord(typedWord);
    this.mediumEnemy.updateTypedWord(typedWord);
    this.hardEnemy.updateTypedWord(typedWord);
  }

  if (!this.biasChosen()) {
    this.affirmEnemy.updateTypedWord(typedWord);
    this.challengeEnemy.updateTypedWord(typedWord);
  }

  if (this.difficultyChosen() && this.biasChosen()) {
    this.done = true;
    var biasMult = 1;
    if (this.challengeEnemy.chosen) {
      biasMult = -1;
    }
    var speedMult = 0.04;
    if (this.mediumEnemy.chosen) {
      speedMult = 0.08;
    }
    if (this.hardEnemy.chosen) {
      speedMult = 0.12;
    }

    document.body.removeEventListener('keydown', this.onKeyDown);

    var game = new Game(biasMult, speedMult);
    window.game = game;
    return;
  }

  for (var enemy of this.enemies) {
    enemy.draw(this.gfx);
  }

  if (anyTyped) {
    this.typedChars = [];
  }

  this.lastUpdate += dt;
  window.requestAnimationFrame(this.update);
};

StartState.prototype.biasedRandomChoice = function(leftArr) {
  return leftArr[0];
};
