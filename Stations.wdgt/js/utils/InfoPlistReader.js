var PATH = "Info.plist";

var VERSION_KEY = 'CFBundleVersion';

var DICT_KEY = "dict";
var ARRAY_KEY = "array";

function InfoPlistReader() {
  // gets the info.plist file and saves it
  var infoPlist = new XMLHttpRequest(); 
  infoPlist.open("GET", PATH, false); 
  infoPlist.send(null); 

  this.file = infoPlist.responseXML;
  this.dict = this.parseDict(this.file.getElementsByTagName(DICT_KEY)[0].childNodes);
}

InfoPlistReader.prototype.parseDict = function(nodes) {
  var dict = {};
  // loop though all dicts that are not whitespaces
  for (var i = 1; i < nodes.length; i = i + 4) {
    var key = nodes[i].firstChild.data;
    var valueNode = nodes[i+2].firstChild;
    
    var value = "";
    if (valueNode) {
      if (DICT_KEY == nodes[i+2].nodeName) {
        value = this.parseDict(nodes[i+2].childNodes);
      } else if (ARRAY_KEY == nodes[i+2].nodeName) {
        value = this.parseArray(nodes[i+2].childNodes);
      } else {
        value = valueNode.data;
      }
    } else {
      value = nodes[i+2].nodeName;
    }
    
    dict[key] = value;
  }
  
  return dict;
}

InfoPlistReader.prototype.parseArray = function(nodes) {
  var array = new Array();
  // loop though all items
  for (var i = 1; i < nodes.length; i = i + 2) { // + 2 => new line is also a node
    var valueNode = nodes[i].firstChild;
    
    var value = "";
    if (valueNode) {
      if (DICT_KEY == nodes[i].nodeName) {
        value = this.parseDict(nodes[i].childNodes);
      } else if (ARRAY_KEY == nodes[i].nodeName) {
        value = this.parseArray(nodes[i].childNodes);
      } else {
        value = valueNode.data;
      }
    } else {
      value = nodes[i].nodeName;
    }
    array.push(value);
  }
  
  return array;
}


InfoPlistReader.prototype.getValueForKey = function(key) {
  return this.dict[key];
}
