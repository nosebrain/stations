/* 
 This file was generated by Dashcode and is covered by the 
 license.txt included in the project.  You may edit this file, 
 however it is recommended to first turn off the Dashcode 
 code generator otherwise the changes will be lost.
 */
var dashcodePartSpecs = {
    "dateLabel": { "text": "01:01", "view": "DC.Text" },
    "departureArrival": { "creationFunction": "CreatePopupButton", "leftImageWidth": 5, "options": [["Abfahrt", "0"], ["Ankunft", "1"]], "rightImageWidth": 16 },
    "done": { "creationFunction": "CreateGlassButton", "onclick": "showFront", "text": "Done" },
    "info": { "backgroundStyle": "black", "creationFunction": "CreateInfoButton", "foregroundStyle": "white", "frontID": "front", "onclick": "showBack" },
    "list": { "allowsEmptySelection": true, "dataArray": ["Item 1", "Item 2", "Item 3"], "labelElementId": "rowLabel", "listStyle": "List.DESKTOP_LIST", "sampleRows": 3, "selectionEnabled": true, "useDataSource": true, "view": "DC.List" },
    "nothing": { "text": "Zur Zeit verkehren keine Transportmittel.", "view": "DC.Text" },
    "refreshButton": { "view": "DC.ImageLayout" },
    "rowLabel": { "text": "Item", "view": "DC.Text" },
    "scrollArea": { "autoHideScrollbars": true, "creationFunction": "CreateScrollArea", "hasVerticalScrollbar": true, "scrollbarDivSize": 18, "scrollbarMargin": 6, "spacing": 4 },
    "searchResultScrollArea": { "autoHideScrollbars": true, "creationFunction": "CreateScrollArea", "hasVerticalScrollbar": true, "scrollbarDivSize": 18, "scrollbarMargin": 6, "spacing": 4 },
    "searchStatus": { "text": "Suchen Sie eine Haltestelle und wählen Sie aus der erscheindenden Liste.", "view": "DC.Text" },
    "stationLabel": { "text": "Station", "view": "DC.Text" },
    "update": { "text": "Aktualisierung verfügbar.", "view": "DC.Text" }
};







