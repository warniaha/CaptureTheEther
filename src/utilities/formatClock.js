exports.formatClock = function(seconds) {
    var numhours = parseInt(Math.floor(((seconds % 31536000) % 86400) / 3600), 10);
    var numminutes = parseInt(Math.floor((((seconds % 31536000) % 86400) % 3600) / 60), 10);
    var numseconds = parseInt((((seconds % 31536000) % 86400) % 3600) % 60, 10);
    return ((numhours < 10) ? "0" + numhours : numhours)
        + ":" + ((numminutes < 10) ? "0" + numminutes : numminutes)
        + ":" + ((numseconds < 10) ? "0" + numseconds : numseconds);
}