function format(minutes) {
    return minutes > 9 ? minutes : "0" + minutes;
}

function calcDelay(time1Str, time2Str) {
    var time1 = time1Str.split(':');
    var time2 = time2Str.split(':');
    
    var hour1 = parseInt(time1[0], 10);
    var hour2 = parseInt(time2[0], 10);
    var minutes1 = parseInt(time1[1], 10);
    var minutes2 = parseInt(time2[1], 10);
    
    var minutesDiv = minutes2 - minutes1;
    
    if (minutesDiv < 0) {
        minutesDiv += 60;
        hour1++;
    }
    
    var minutes = minutesDiv;
    
    if (hour1 > hour2) {
        minutes += 60 * (24 - hour1);
        hour1 = 0;
    }
    
    minutes += 60 * (hour2 - hour1);
            
    return minutes;
}