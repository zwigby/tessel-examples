var tessel = require('tessel');
var ambient = require('ambient-attx4').use(tessel.port['A']);
var camera = require('camera-vc0706').use(tessel.port['B']);

var notificationLED = tessel.led[3]; // Set up an LED to notify when we're taking a picture

var cameraReady = false;
var picIndex = 1;

camera.on('ready', function() {
  cameraReady = true;
});


ambient.on('ready', function () {
  ambient.setSoundTrigger(0.1);

  ambient.on('sound-trigger', function(data) {
    console.log('Sound Triggered...');

    ambient.clearSoundTrigger();

    if(cameraReady) {
      takePicture(function(){
        ambient.setSoundTrigger(0.1);
      });
    }
  });
});

var takePicture = function(cb) {
  notificationLED.high();

  camera.takePicture(function(err, image) {
    if (err) {
      console.log('error taking image', err);
    } else {
      notificationLED.low();
      var name = 'picture-' + Math.floor(Date.now()*1000) + '-' + picIndex + '.jpg';
      console.log('Picture saving as', name, '...');
      process.sendfile(name, image);
      picIndex++;
      cb();
    }
  });
};

ambient.on('error', function (err) {
  console.log(err)
});