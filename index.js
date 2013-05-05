/*
 * module dependencies
 */

var fs     = require('fs'),
    events = require('events');


/*
 * expose Satloc object
 */

module.exports = exports = Satloc;


/*
 * constructor
 * @param {String} filename
 */

function Satloc(filename) {
  events.EventEmitter.call(this);

  this.filename = filename;

  return this;
}

/*
 * Satloc is a subclass of events.EventEmitter
 */

Satloc.prototype = Object.create(events.EventEmitter.prototype);


/*
 * parse
 * make this actually stream (currently waiting til all input is read)
 */

Satloc.prototype.parse = function() {
  var self = this;
  var data = '';

  var stream = fs.createReadStream(self.filename, { encoding: 'utf8' });
  stream.on('data', function(chunk) { data += chunk; });
  stream.on('close', function() {
    self.parseHelper(data);
    self.emit('done')
  });
};
 
var FIELD_REGEX = /\.POL [0-9]+ [0-9]+\r\n\t(?:INC|EXC)\r\n/;

/*
 * parseHelper
 * @api private
 */
Satloc.prototype.parseHelper = function(data) {
  var fields = data.split(FIELD_REGEX);
  for (field in fields) {
    lines = this.parseField(fields[field]);
    if (lines == null) continue;

    this.emit('field', { points: lines });
  }
}

var COORD_REGEX = '(?:-)?[0-9]{1,3}\.[0-9]{1,8}'
var LINE_REGEX = new RegExp('[\t]+(' + COORD_REGEX + ') (' + COORD_REGEX + ')[.\r\n]+');

Satloc.prototype.parseField = function(field) {
  if (field.match(/\.JOB/)) return null; /* drop header */
  field = field.split('\n');

  var result = [];

  for (line in field) {
    var match = field[line].match(LINE_REGEX);
    if (match) {
      result.push({
        lat: parseFloat(match[1]),
        lng: parseFloat(match[2])
      });
    }
  }

  return result;
};

//    var lines = field.split(LINE_REGEX);
//    /*
//     * remove empty lines and whitespace
//     */
//    if (lines.length < 3) continue; /* continue if only two points */
//
//    lines = lines.filter(function(line) { return line.length > 0; });
//    lines = lines.map(function(line) { return line.trim(); });
//
//    /*
//     * Reformat lines
//     */
//    lines = lines.map(function(line) {
//      line = line.split(/[ \t]+/);
//      return {
//        lat: parseFloat(line[0]),
//        lng: parseFloat(line[1])
//      }});
