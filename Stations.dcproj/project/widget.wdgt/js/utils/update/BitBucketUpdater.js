var BASE_TAG_URL = 'https://api.bitbucket.org/1.0/repositories/';
var TAG_URL = '/tags';
var BITBUCKET_BASE = 'https://bitbucket.org/';
var GET_URL = '/get/';
var FORMAT = '.zip';

function BitBucketUpdater() {
  
}

function BitBucketUpdater(user, repository) {
  this.setUser(user);
  this.setRepository(repository);
}

BitBucketUpdater.prototype.setUser = function(user) {
  this.user = user;
}

BitBucketUpdater.prototype.setRepository = function(repository) {
  this.repository = repository;
}

BitBucketUpdater.prototype.getUrl = function() {
  return BASE_TAG_URL + this.user + '/' + this.repository + TAG_URL;
}

BitBucketUpdater.prototype.checkForUpdates = function(callback) {
  var updateUrl = this.getUrl();
  var bitbucketupdater = this;
  $.ajax({
    'url' : updateUrl,
    'success' : function(data) {
      var versions = new Array();
      for (key in data) {
        if ("tip" !== key) {
          var version = new Version();
          version.setVersionString(key);
          var url = BITBUCKET_BASE + bitbucketupdater.user + '/' + bitbucketupdater.repository + GET_URL + key + FORMAT;
          version.setUrl(url);
          alert(key + ' => ' + url);
        }
      }
      // TODO: parse versions
      callback(versions);
    }
  })
}
