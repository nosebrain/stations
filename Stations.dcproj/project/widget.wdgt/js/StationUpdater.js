function StationUpdater() {
  this.request = undefined;
}

StationUpdater.prototype.update = function(board) {
  if (this.request != undefined) {
    alert('killing running request');
    this.request.abort();
  }

  var self = this;
  
  var now = new Date();
  var today = now.getFullYear() + "" + format((now.getMonth() + 1)) + "" + format(now.getDate());
  var time = format(now.getHours()) + ":" + format(now.getMinutes()) + ":" + format(now.getSeconds());
  
  // get config
  var station = board.getStation();
  var stationId = station.getId();
  
  // TODO: config
  var productFilter = board.getFilter().join('');
  var boardType = board.getType();
  
  // build request
  var requestData = "<?xml version='1.0' encoding='iso-8859-1'?>\n<ReqC ver='1.1' prod='JP' lang='de' clientVersion='2.1.2'>\n<STBReq boardType='" + boardType + "' detailLevel='2'><Time>" + time + "</Time>\n<Period>\n<DateBegin>" + today + "</DateBegin>\n<DateEnd>" + today + "</DateEnd></Period>\n<TableStation externalId='" + stationId + "#80'/>\n<ProductFilter>" + productFilter + "</ProductFilter></STBReq></ReqC>";
  this.request = $.ajax({
    url: "http://reiseauskunft.bahn.de/bin/mgate.exe",
    type: "POST",
    data: requestData,
    contentType: "application/xml",
    dataType: 'text', // TODO:remove
    success: function(data) {
      // alert(data);
      var response = $(data);
          
      var trains = new Array();
      var messages = new Array();
          
      response.find('StationBoardEntry').each(function() {
        var train = new Train();
        var dir = $(this).attr("direction");
        var category = $(this).attr('category');
        train.setCategory(category);
        train.setDirection(dir);
              
        var scheduledPlaform = $(this).attr('scheduledPlatform');
        var actualPlatform = $(this).attr('actualPlatform');
        
        var platform = scheduledPlaform;
        
        if (actualPlatform != undefined) {
          train.addMessage('Gleiswechsel'); // TODO: i18n
          platform = actualPlatform;
        }
        
        train.setPlatform(platform);
        
        var scheduledTimeStr = $(this).attr('scheduledTime');
        train.setTime(scheduledTimeStr);
        
        var actualTimeStr = $(this).attr('actualTime');
        
        if ((actualTimeStr != undefined) && actualTimeStr != scheduledTimeStr) {                    
          var delayed = calcDelay(scheduledTimeStr, actualTimeStr);
          
          var message = delayed  + " min. verspätet"; // TODO: i18n
          train.addMessage(message);
        }
        
        // TODO: remove first?
        $(this).find('Messages').first().find('Message').each(function() {
            train.addMessage($(this).attr('text'));
        });
        
        // TODO: second Message also contains the annotext info
        $(this).find('AnnoText').each(function() {
            train.addMessage($(this).text());
        });
        
        trains.push(train);
      });
      
      response.find('STBResIPhone > MessageContainerHeader Message').each(function() {
        messages.push($(this).attr('text'));
      });
    
      board.updatedBoard(trains, messages);
      self.request = undefined;
    }
  });
}

StationUpdater.prototype.setStation = function(station) {
  this.station = station;
}