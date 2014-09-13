// jsaSound code by National University of Singapore, Inquiries: director@anclab.org
require.config({
  paths: {
    "jsaSound": 'http://animatedsoundworks.com:8001'
  }
});

require([ "jsaSound/jsaModels/jsaFMnative2"],

function (sndFactory) {
  var snd = sndFactory();

  var mdown=function(e){
    snd.setParamNorm("play", 1);
  };

  var mup=function(e){
    snd.setParamNorm("play", 0);
  };

  // sensors
  var ipaddress = prompt("Enter your phone's IP \neg. 192.168.0.0:8765")
  var data = JSON.parse(httpGet('http://' + ipaddress));
  var accIndex = 0;
  var soundIndex = 0;

  data.sensors.forEach(function(element, index, array) {
    console.log(element.type + ' [' + index + ']');
    if(element.type === 'accelerometer') {
      accIndex = index;
    } else if(element.type === 'sound') {
      soundIndex = index;
    }
  })

  function httpGet(theUrl)
  {
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
  }

  snd.setParamNorm("play", 1);

  window.setInterval(function() {
    var response = JSON.parse(httpGet('http://' + ipaddress));
    // console.log(response);

    // Detect noise level
    var sound = response.sensors[soundIndex].values;
    document.getElementById('sound').innerText = sound;
    if(sound > 20000) {
      document.getElementById('alert').innerText = 'Kids! Turn down the volume!';
      document.getElementById('alert').style.background = 'red';
    } else{
      document.getElementById('alert').innerText = 'Thank you for being quiet';
      document.getElementById('alert').style.background = 'green';
    }

    // Theramin
    var acc = response.sensors[accIndex].values[1] / (-90);
    document.getElementById('acc').innerText = acc;
    snd.setParamNorm(1, acc);
  }, 50);

}
);
