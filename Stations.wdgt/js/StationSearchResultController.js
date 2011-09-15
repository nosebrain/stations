function StationSearchResultController(input, scrollarea, stations, board) {
  this.stations = stations;
  this.scrollarea = $(scrollarea);
  this.input = input;
  this.board = board;
  
  this.scrollarea.show();
}

StationSearchResultController.prototype.numberOfRows = function() {
  return this.stations.length;
}

StationSearchResultController.prototype.prepareRow = function(rowElement, rowIndex, templateElements) {
  var element = $(templateElements.rowLabel);
  element.text(this.stations[rowIndex].getName());
  
  var self = this;
  $(rowElement).click(function() {
    self.selectedStation(rowIndex);
  });
  
  document.getElementById('searchResultScrollArea').object.refresh();
}

StationSearchResultController.prototype.selectedStation = function(rowIndex) {  
  var station = this.stations[rowIndex];
  this.board.setStation(station);
  
  this.scrollarea.hide();
  this.input.disabled = "";
}