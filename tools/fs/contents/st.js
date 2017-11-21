var smartthings = require('smartthings');
var PWM = require('pwm'),
      pwm = new PWM();

var SWITCH_URL = '/switch/main/0';
var DIMMING_URL = '/switchLevel/main/0';
var TEMPERATURE_URL = '/colorTemperature/main/0';

var W = 0,
      R = 1,
      G = 2,
      B = 3;

var powerStatus = ["on", "off"];
var switchValue = false;

var dimmingSetting = 50;
var colorTemp = 50;
var whiteLed = false;
var led = [];

function setRedLed() {
  var cv = 0;
  if (colorTemp <= 60) {
    cv = (60 - colorTemp) * 1.65;
  }

  led[R].setDutyCycleSync(dimmingSetting * cv / 10000);
}

function setGreenLed() {
  var cv = 0;
  if (colorTemp >= 20 && colorTemp <= 50) {
    cv = colorTemp * 1.2; 
  } else if (colorTemp >= 70 && colorTemp <= 90) {
    cv = (90 - colorTemp) * 2.5;
  }
 
  led[G].setDutyCycleSync(dimmingSetting * cv / 10000);  
}

function setBlueLed() {
  var cv = 0;
  if (colorTemp >= 70) {
    cv = (colorTemp - 70) * 3.3;
  }
  led[B].setDutyCycleSync(dimmingSetting * cv / 10000);    
}

function setWhiteLed() {
  var cv = 0;
  if (colorTemp >= 50 && colorTemp <= 70) {
    cv = 60;
    whiteLed = true;
  } else if (colorTemp > 70 && colorTemp <= 80) {
    cv = 30;
    whiteLed = true;
  } else {
    if (!whiteLed) {
      return;
    }
    whiteLed = false;
  }
  led[W].setDutyCycleSync(dimmingSetting * cv / 10000);      
}


function setLed() {
  if (led.length === 0) {
    return;
  }

  if (!switchValue) {
    for (var i = 0; i < led.length; i++) {
      led[i].setDutyCycleSync(0);
    }
  } else {
    setRedLed();
    setGreenLed();
    setBlueLed();
    setWhiteLed();
  }
}

for (var i = 0; i < 4; i++) {
  (function(i) {
    led[i]  = pwm.open({
      period:0.001,
      dutyCycle: 0.2,
      pin: i
    }, function(err) {
      if (err) {
        return;
      }
      console.log("[IOTJS] start pwm ", i);
      led[i].setDutyCycleSync(0);
      led[i].setEnableSync(1);

      if (i === 3) {
        startSmartThings();
      }
    });
  })(i);
}


function startSmartThings() {
  var st = smartthings.create({}, function() {
    // Create and enable LED(RGBW)
    console.log('[IOTJS] start smart things');
  });
  
  st.on('getRequest', function(msg, req) {
    var uri = msg.resourceUri;
  
    if (uri === SWITCH_URL) {
      if (msg.hasPropertyKey('power')) {
        req.set('power', switchValue ? powerStatus[0] : powerStatus[1]);
        req.set('userInfo', {
          company: "Samsung",
          sdk: "ST Things SDK"
        });
      }
    } else if (uri === DIMMING_URL) {
      if (msg.hasPropertyKey('dimmingSetting')) {
        req.set('dimmingSetting', dimmingSetting);
      }
    } else if (uri === TEMPERATURE_URL) {
      if (msg.hasPropertyKey('ct')) {
        req.set('ct', colorTemp);
      }
    }
  });
  
  st.on('setRequest', function(msg, req) {
    var uri = msg.resourceUri;
    if (uri === SWITCH_URL) {
  
      var power = msg.req.getString('power');
      if (power) {
        if (power === 'off') {
          switchValue = false;
          setLed();
        } else {
          switchValue = true;
          setLed();
        }
  
        req.set('power', switchValue ? powerStatus[0] : powerStatus[1]);
      }
    } else if (uri === DIMMING_URL) {
      dimmingSetting = msg.req.getInt('dimmingSetting');
      req.set('dimmingSetting', dimmingSetting);
      setLed();
    } else if (uri === TEMPERATURE_URL) {
      colorTemp = msg.req.getInt('ct');
      req.set('ct', colorTemp);
      setLed();
    }
    
    st.notifyObservers(uri);
  });
}

infinite();

function infinite() {
  setTimeout(function() {
    console.log('loop');
    infinite();
  }, 100000);
}