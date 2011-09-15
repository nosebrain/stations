var STATION_ID_PREF_KEY = 'stationId';
var STATION_NAME_PREF_KEY = 'stationName';
var BOARD_TYPE_PREF_KEY = 'boardType';
var FILTER_PREF_KEY = 'filter';

var UPDATE_BITBUCKET_USER = 'nosebrain';
var UPDATE_BITBUCKET_REPO = 'stations';

var DEP_TYPE = 'Dep';
var ARR_TYPE = 'Arr';

function Board() {
  this.refreshing = false;

  this.type = DEP_TYPE;    
  this.filter = new Array(1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
}

Board.prototype.load = function() {
    this.updater = new StationUpdater();
    this.searcher = new StationSearcher();
    
    // TODO: config via xml!?
    var updater = $('#update');
    updater.hide();
    var bitbucket = new BitBucketUpdater(UPDATE_BITBUCKET_USER, UPDATE_BITBUCKET_REPO);
    this.widgetUpdater = new UpdateFramework(bitbucket, updater);
    
    this.loadSettings();
    
    
    /*
     * init bindings
     */
    var board = this;
    
    $('#products input').change(function() {
      var checkbox = $(this);
      // XXX: position == position in product array
      var position = checkbox.parent().index();
      var set = checkbox.is(':checked') ? 1 : 0;
      board.updateFilter(position, set);
    });

    // init bindings
    $('#refreshButton').click(function() {
      board.refresh();
    });
    
    $('#search').bind('keypress', function(e) {
      var code = (e.keyCode ? e.keyCode : e.which);
      if (code == 13) {
        var scrollarea = $('#searchResultScrollArea');
        scrollarea.hide();
        $('#searchStatus').show().text('Suche Haltestelle …'); // TODO: i18n
        var search = $(this).val();
        board.searcher.search(search, function(stations) {
          if (stations.length == 1) {
            var station = stations[0];
            board.setStation(station);
            // TODO: i18n
            $('#searchStatus').show().text('Die Suche ergab nur einen Treffer, daher wurde die Haltestelle ' + station.getName() + ' automatisch ausgewählt.');
            
            setTimeout(function() {
              // TODO: i18n
              $('#searchStatus').show().text('Suchen Sie eine Haltestelle und wählen Sie aus der erscheindenden Liste.');
            }, 4000);
            return;
          }
          
          $('#searchStatus').hide();
          var controller = new StationSearchResultController(this, scrollarea, stations, board);
          // TODO: jquery
          document.getElementById('list').object.setDataSource(controller);
        });
      }
    });
}

Board.prototype.show = function() {
  this.refresh();
  this.widgetUpdater.checkForUpdates();
}

Board.prototype.remove = function() {
  // TODO: refactor
  // clear prefs
  savePref(STATION_ID_PREF_KEY, null);
  savePref(STATION_NAME_PREF_KEY, null);
  savePref(BOARD_TYPE_PREF_KEY, null);
  savePref(FILTER_PREF_KEY, null);
}

Board.prototype.updateFilter = function(position, newValue) {
  // TODO: range check
  this.filter[position] = newValue;
  
  savePref(FILTER_PREF_KEY, this.filter.join(''));
  
  this.refresh();
}

Board.prototype.getFilter = function() {
  return this.filter;
}

Board.prototype.setFilter = function(filter) {
  this.filter = filter;
  
  // TODO: why only 10 filters?
  $('#products input').each(function(index, input) {
    if (filter[index] == 1) {
      $(input).attr('checked', 'checked');
    } else {
      $(input).removeAttr('checked');
    }
  });
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
    $('#search').val(stationName);
    
    savePref(STATION_ID_PREF_KEY, station.getId());
    savePref(STATION_NAME_PREF_KEY, station.getName());
    
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
  
  var boardType = getPref(BOARD_TYPE_PREF_KEY);
  if (boardType === undefined) {
    boardType = DEP_TYPE;
  }
  
  var filterStr = getPref(FILTER_PREF_KEY);
  if (filterStr !== undefined) {
    var filter = filterStr.split('');
    this.setFilter(filter);
  }
  
  // don't use setter => causing refresh
  this.type = boardType;
  this.setStation(station);
}

Board.prototype.refresh = function() {
  if (this.refreshing) {
    alert('board currently refreshing');
    return;
  }
  
  this.refreshing = true;
  this.updater.update(this);
  
  /*
   * rotate the refresh button
   */
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