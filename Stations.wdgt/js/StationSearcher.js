function StationSearcher() {

}

StationSearcher.prototype.search = function(searchTerm, callback) {
  if (searchTerm == undefined || searchTerm.length <= 2) {
    // TODO
    return;
  }
  // TODO: locale settings
  var requestData = "<?xml version='1.0' encoding='iso-8859-1'?><ReqC ver='1.1' prod='JP' lang='de' clientVersion='2.1.2'><LocValReq id='L' maxNr='20' sMode='1'><ReqLoc type='ST' match='" + searchTerm + "'/></LocValReq></ReqC>"
  
  $.ajax({
    url: "http://reiseauskunft.bahn.de/bin/mgate.exe",
    data: requestData,
    contentType: "application/xml",
    type: "POST",
    dataType: "text", // TODO: remove
    success: function(data) {
      alert(data); // TODO: remove
      var stations = new Array();
      $(data).find('Station').each(function() {
        var stationName = $(this).attr('name');
        var id = $(this).attr('externalStationNr');
        
        var station = new Station();
        station.setName(stationName);
        station.setId(id);
        
        stations.push(station);
      });
      
      // call the callback
      callback(stations);
    }
  });
  
}