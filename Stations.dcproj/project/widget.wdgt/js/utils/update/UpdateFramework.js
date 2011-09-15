function UpdateFramework(updater, guiElement) {
  this.setGUIElement(guiElement);
  this.setUpdater(updater);
  this.retrieveCurrentVersion();
}

UpdateFramework.prototype.retrieveCurrentVersion = function() {
  this.currentVersion = '0.0.1a'; // TODO: extract from widget.plist
}

UpdateFramework.prototype.setIncludeBetaUpdates = function(includeBetaUpdates) {
  // TODO: save beta setting
  this.includeBetaUpdates = includeBetaUpdates;
}

UpdateFramework.prototype.setGUIElement = function(guiElement) {
  this.gui = $(guiElement);
}

UpdateFramework.prototype.setUpdater = function(updater) {
  this.updater = updater;
}

UpdateFramework.prototype.checkForUpdates = function() {
  if (this.updater === undefined) {
    alert('no updater set');
    return;
  }
  
  this.updater.checkForUpdates(this.foundVersions);
}

UpdateFramework.prototype.foundVersions = function(versions) {
  // TODO: 
}

/*
 * helper classes
 */
function Version() {
  
}

Version.prototype.setUrl = function(url) {
  this.url = url;
}

Version.prototype.getUrl = function() {
  return this.url;
}

Version.prototype.getVersionString = function() {
  return this.versionString;
}

Version.prototype.setVersionString = function(versionString) {
  this.versionString = versionString;
}