var smartthings = require('smartthings');
var Gpio = require('gpio');
var gpio = new Gpio();

var LED_ON = true,
  LED_OFF = false;

var SWITCH_URL = '/switch/main/0';


var gpio41 = gpio.open({
    pin: 41,
    direction: gpio.DIRECTION.OUT,
  }, function() {
    gpio41.writeSync(LED_OFF);
    console.log('complete GPIO');
  }
);

var st = smartthings.create({});

var power_status = ["on", "off"];
var g_switch_value = false;

st.on('getRequest', function(msg, req) {
  var uri = msg.resourceUri;

  if (uri === SWITCH_URL) {
    if (msg.hasPropertyKey('power')) {
      req.set('power', g_switch_value ? power_status[0] : power_status[1]);
      req.set('userInfo', {
        company: "Samsung",
        sdk: "ST Things SDK"
      });
    }
  }
});

st.on('setRequest', function(msg, req) {
  var uri = msg.resourceUri;
  console.log('js: setrequest', uri);
  if (uri === SWITCH_URL) {

    var power = msg.req.getString('power');
    if (power) {
      if (power === 'off') {
        g_switch_value = false;
        gpio41.writeSync(LED_OFF);
      } else {
        g_switch_value = true;
        gpio41.writeSync(LED_ON);
      }

      req.set('power', g_switch_value ? power_status[0] : power_status[1]);
      st.notifyObservers(uri);
    }
  }
});

infinite();

function infinite() {
  setTimeout(function() {
    console.log('loop');
    infinite();
  }, 100000);
}
