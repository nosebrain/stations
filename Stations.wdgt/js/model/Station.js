function Station() {

}

Station.prototype.getName = function() {
  return this.name;
}

Station.prototype.setName = function(name) {
  this.name = name;
}

Station.prototype.setId = function(id) {
  this.id = id;
}

Station.prototype.getId = function() {
  return this.id;
}