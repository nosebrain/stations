function compareVersionStr(version1Str, version2Str) {
  var version1 = version1Str.split('.');
  var version2 = version2Str.split('.');
  
  return this.compareVersions(version1, version2);
}

function checkVersion(element) {
  if (element === undefined) {
    return 0;
  }
  
  return parseInt(element, 10);
}

function compareVersions(version1, version2) {
  var firstVersion1 = version1[0];
  var firstVersion2 = version2[0];
  
  if (firstVersion1 === undefined && firstVersion2 === undefined) {
    return 0;
  }

  var compare = compareInt(checkVersion(firstVersion1), checkVersion(firstVersion2));
  
  /*
   * version differs here ignore subversions 
   */
  if (compare != 0) {
    return compare;
  }
  
  // subversion must decide
  return compareVersions(version1.slice(1), version2.slice(1));
}

function compareInt(int1, int2) {
  var diff = int1 - int2;
  
  if (diff == 0) { 
    return 0;
  }
  
  if (diff < 0) {
    return -1;
  }
   
  return 1;
}

function UpdateFramework(updater, guiElement) {
  this.setGUIElement(guiElement);
  this.setUpdater(updater);
  this.retrieveCurrentVersion();
}

UpdateFramework.prototype.retrieveCurrentVersion = function() {
  var reader = new InfoPlistReader();
  this.currentVersion = reader.getValueForKey(VERSION_KEY);
  alert(this.currentVersion);
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
  
  var updateFr = this;
  this.updater.checkForUpdates(function(versions) {
    updateFr.foundVersions(versions);
  });
}

UpdateFramework.prototype.foundVersions = function(versions) {
  var latestVersion = undefined;
  alert(this.currentVersion);
  for (var i = 0; i < versions.length; i++) {
    var version = versions[i];
    if (compareVersionStr(version.getVersionString(), this.currentVersion) > 0) {
      latestVersion = version;
    }
  }
  
  if (latestVersion != undefined) {
    alert('new version available: ' + version.getVersionString());
    $('#myimage').unbind('click');
    this.gui.show().unbind('click').click(function() {
      widget.openURL(latestVersion.getUrl());
    });
  } else {
    alert(this.currentVersion + ' is currently the newest version available.');
    this.gui.hide();
  }
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