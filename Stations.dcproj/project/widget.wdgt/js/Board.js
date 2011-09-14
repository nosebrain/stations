var STATION_ID_PREF_KEY = 'stationId';
var STATION_NAME_PREF_KEY = 'stationName';

var DEP_TYPE = 'Dep';
var ARR_TYPE = 'Arr';

function Board() {
  this.refreshing = false;

  this.type = DEP_TYPE;    
  this.filter = new Array(1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0);
}

Board.prototype.getFilter = function() {
  return this.filter;
}

Board.prototype.getType = function() {
  return this.type;
}

Board.prototype.setType = function(type) {
  this.type = type;
  
  this.refresh();
}

Board.prototype.setStation = function(station) {
  this.station = station;
  
  if (this.station) {
    var stationName = this.station.getName();
    $('#stationLabel').text(stationName);
    $('#stationSearch').val(stationName);
    this.refresh();
  }
}

Board.prototype.getStation = function() {
  return this.station;
}

Board.prototype.getLastUpdated = function() {
    return this.lastUpdated;
}

Board.prototype.setLastUpdated = function(date) {
    this.lastUpdated = date;
}

Board.prototype.updatedBoard = function(trains, messages) {
  this.refreshing = false;
  var now = new Date();
  this.setLastUpdated(now);
  
  var scrollContent = $('#content');
  scrollContent.empty();
  
  var list = $('<ul></ul>');
  
  // first general messages
  for (var i = 0; i < messages.length; i++) {
    var message = messages[i];
    var item = $('<li></li>').addClass('message').text(message);
    list.append(item);
  }
  
  // trains
  for (var i = 0; i < trains.length; i++) {
    var train = trains[i];
    var item = $('<li></li>');
    var wrapper = $('<div></div>').addClass('train');
    var timeSpan = $('<div></div>').addClass('time').text(train.getTime());
    var categorySpan = $('<div></div>').addClass('trainCategory').text(train.getCategory());
    var trainStationSpan = $('<div></div>').addClass('trainStation').text(train.getDirection());
    var platformSpan = $('<div></div>').addClass('platform').text(train.getPlatform());
    
    
    wrapper.append(timeSpan);
    wrapper.append(categorySpan);
    wrapper.append(trainStationSpan);
    wrapper.append(platformSpan);
    
    item.append(wrapper);
    
    var messages = train.getMessages();
    if (messages.length > 0) {
        var messageText = '+++ ' + messages.join(' +++ ') + ' +++';
        
        item.append($('<marquee behavior="scroll" scrollamount="5" direction="left" class="messages" OnMouseOver="this.stop()" OnMouseOut="this.start()"></marquee>').text(messageText));
    }
    
    list.append(item);
  }
  
  scrollContent.append(list);
  
  var formatedTime = format(now.getHours()) + ":" + format(now.getMinutes());
  
  $('#dateLabel').text(formatedTime);
  
  document.getElementById('scrollArea').object.refresh();
}

Board.prototype.load = function() {
    this.updater = new StationUpdater();
    
    this.loadSettings();
    
    
    /*
     * init bindings
     */
    
    var board = this;    

    // init bindings
    $('#refreshButton').click(function() {
      board.refresh();
    });
}

Board.prototype.loadSettings = function() {
  var stationId = getPref(STATION_ID_PREF_KEY);
  var stationName = getPref(STATION_NAME_PREF_KEY);
  
  if (stationName === undefined) {
    stationName = "Berlin Hbf";
    
    // KS-W: 8003200
    // Köln: 8000207
    // Wabern: 8000368
    // Stu: 8000096
    // Berlin: 8011160
    // Würzburg 8000260
    // KS Uni Ing Schule 713384
    stationId = 8011160;
  }
  
  alert(stationId + " " + stationName);
  
  var station = new Station();
  station.setName(stationName);
  station.setId(stationId);
  
  var boardType = getPref('boardType');
  if (boardType === undefined) {
    boardType = DEP_TYPE;
  }
  
  // don't use setter => causing refresh
  this.type = boardType;
  this.setStation(station);
}

Board.prototype.refresh = function() {
  this.refreshing = true;
  this.updater.update(this);
  var board = this;
  var i = 0;
  // Resizing code
  var animation = new AppleAnimation(0, 360 * 3000 * 1000, function(rectAnimation, currentValue, startingValue, finishingValue) {
    if (!board.refreshing && i == 0) {
      rectAnimation.stop();
      return;
    }
    
    i += 30;
    i %= 360;
    $('#refreshButton').css("-webkit-transform", "rotate(" + i + "deg)");
  });
  var currentAnimator = new AppleAnimator(1000 * 1000, 100);
  currentAnimator.addAnimation(animation);
  currentAnimator.start();
}