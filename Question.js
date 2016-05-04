/* global Enemy, randomChoice, questions */

function Question(game, targetDifficulty) {
  this.choices = randomChoice(questions);
  this.enemies = this.choices.map(function(choice) {
    var enemy = new Enemy(game, targetDifficulty);
    enemy.setWords([choice.statement]);
    return enemy;
  });

  this.enemies.forEach(function(enemy) {
    enemy.speed = this.enemies[0].speed;
    enemy.x = this.enemies[0].x;
  }.bind(this));

  for (var i = 0; i < this.enemies.length; i++) {
    this.enemies[i].y = game.height / 2;
    this.enemies[i].y += 48 * (i - this.enemies.length / 2) + 24;
  }
}

Question.prototype.getEffect = function() {
  for (var i = 0; i < this.enemies.length; i++) {
    var enemy = this.enemies[i];
    if (!enemy.alive) {
      return this.choices[i].effect;
    }
  }
  return 0;
};
