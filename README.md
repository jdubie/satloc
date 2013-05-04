satloc
======

Parses satloc job files.

```javascript
var Satloc = require('satloc');

var file = new Satloc('./sioux.job');

file.on('field', function(field) {
  console.dir(field); // { points: [ { lat: 43.207861, lng: -96.330689 }, ... ] }
});

file.on('done', function() {
  console.log("that's all she wrote");
});

file.parse();
```
