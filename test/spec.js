var Satloc = require('../index'),
    should = require('should');

describe('Satloc', function() {
  describe('#parse', function() {
    it('should read basic file', function(done) {
      var fields = [];
      var file = new Satloc('./sioux.job');
      file.on('done', function() {
        fields.should.have.length(3);
        fields[0].should.have.key('points');
        fields[0].points.should.have.length(4);
        fields[0].points[0].should.have.property('lat', 43.207607);
        fields[0].points[0].should.have.property('lng', -96.326266);
        done();
      });
      file.on('field', function(field) {
        fields.push(field);
      });
      file.parse();
    });
  });
});
