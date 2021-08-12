var lerp = require('lerp');

var PI = Math.PI;
var TWO_PI = Math.PI * 2;

function interpolateAngle(fromAngle, toAngle, t) {
    fromAngle = (fromAngle + TWO_PI) % TWO_PI;
    toAngle = (toAngle + TWO_PI) % TWO_PI;

    var diff = Math.abs(fromAngle - toAngle);
    if (diff < PI) {
        return lerp(fromAngle, toAngle, t);
    }
    else {
        if (fromAngle > toAngle) {
            fromAngle = fromAngle - TWO_PI;
            return lerp(fromAngle, toAngle, t);
            return from;
        }
        else if (toAngle > fromAngle) {
            toAngle = toAngle - TWO_PI;
            return lerp(fromAngle, toAngle, t);
            return from;
        }
    }
}

module.exports = interpolateAngle;
