Satloc = require('../index');

describe('Satloc', function() {
  describe('#parse', function() {
    it('should read basic file', function(done) {
      var file = new Satloc('./sioux.job');
      file.on('done', done);
      file.on('field', function(field) {
        console.log(field);
      });
      file.parse();
    });
  });
});
