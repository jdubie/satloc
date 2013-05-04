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
 
// TODO: make LINE_REGEX a function of COORD_REGEX
var COORD_REGEX = '(?:-)?[0-9]{1,3}\.[0-9]{1,8}'
var FIELD_REGEX = /\.POL [0-9]+ [0-9]+\r\n\t(?:INC|EXC)\r\n/;
var LINE_REGEX = /[\r\n\t]+(?:-)?[0-9]{1,3}\.[0-9]{1,8} (?:-)?[0-9]{1,3}\.[0-9]{1,8}[\r\n\t]+/;

/*
 * parseHelper
 * @api private
 */
Satloc.prototype.parseHelper = function(data) {
  var fields = data.split(FIELD_REGEX);
  for (field in fields) {
    field = fields[field];
    var lines = field.split(LINE_REGEX);
    /*
     * remove empty lines and whitespace
     */
    lines = lines.filter(function(line) { return line.length > 0; });
    lines = lines.map(function(line) { return line.trim(); });

    /*
     * Reformat lines
     */
    lines = lines.map(function(line) {
      line = line.split(/[ \t]+/);
      return {
        lat: parseFloat(line[0]),
        lng: parseFloat(line[1])
      }});
    this.emit('field', { points: lines });
  }
}
