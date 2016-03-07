'use strict';
module.exports = {

  areaBetween: function(x0, y0, x1, y1) {
    var result = Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2)
    return result;
  }

};
