function Train() {
    this.messages = new Array();
}

Train.prototype.setCategory = function(category) {
    this.category = category;
}

Train.prototype.getCategory = function() {
    return this.category;
}

Train.prototype.setDirection = function(direction) {
  this.direction = direction;
}

Train.prototype.getDirection = function() {
  return this.direction;
}

Train.prototype.setTime = function(time) {
  this.time = time;
}

Train.prototype.getTime = function() {
  return this.time;
}

Train.prototype.setPlatform = function(platform) {
  this.platform = platform;
}

Train.prototype.getPlatform = function() {
  return this.platform;
}

Train.prototype.addMessage = function(message) {
    this.messages.push(message);
}

Train.prototype.getMessages = function() {
    return this.messages;
}