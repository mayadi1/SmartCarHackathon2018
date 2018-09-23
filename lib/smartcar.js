'use strict';

const smartcar = require('smartcar');

// Set Smartcar configuration
const SMARTCAR_CLIENT_ID = '4a86ba96-2e0d-4c9b-a960-f79fb3487e53';
const SMARTCAR_SECRET = 'aeac4157-9c6a-4cbe-9bff-1af55c995c0e';

// Redirect uri must be added to the application's allowed redirect uris
// in the Smartcar developer portal
const SMARTCAR_REDIRECT_URI = 'http://localhost:3000/smartcar/callback';

// Setting MODE to "development" will show Smartcar's mock vehicle
const SMARTCAR_MODE = 'development';

// Initialize Smartcar client
const client = new smartcar.AuthClient({
  clientId: SMARTCAR_CLIENT_ID,
  clientSecret: SMARTCAR_SECRET,
  redirectUri: SMARTCAR_REDIRECT_URI,
  development: SMARTCAR_MODE === 'development',
});

const get_vehicles = function(access_token, callback) {
  smartcar.getVehicleIds(access_token)
  .then(callback);
}

const get_vehicle = function(access_token, vehicle_id) {
  return new smartcar.Vehicle(vehicle_id, access_token);
}

const get_vehicle_location = function(vehicle, callback) {
  vehicle.location().then(callback);
}

const lock_vehicle = function(vehicle, callback) {
  vehicle.lock().then(callback);
}

const unlock_vehicle = function(vehicle, callback) {
  vehicle.unlock().then(callback);
};

const renew_access = function(refresh_token) {
  return client.exchangeRefreshToken(refresh_token);
}

// TODO: Hardcoded for now. Fix later.
var credentials = JSON.parse('{"accessToken":"e49e2cdd-07e5-4f83-aec6-38ee8c776e89","refreshToken":"88e382ef-155c-4295-9b1a-ab538b590b27","expiration":"2018-09-23T02:06:55.435Z","refreshExpiration":"2018-11-22T00:06:55.435Z"}');

// Source: http://stackoverflow.com/questions/497790
var dates = {
  convert:function(d) {
      // Converts the date in d to a date-object. The input can be:
      //   a date object: returned without modification
      //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
      //   a number     : Interpreted as number of milliseconds
      //                  since 1 Jan 1970 (a timestamp) 
      //   a string     : Any format supported by the javascript engine, like
      //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
      //  an object     : Interpreted as an object with year, month and date
      //                  attributes.  **NOTE** month is 0-11.
      return (
          d.constructor === Date ? d :
          d.constructor === Array ? new Date(d[0],d[1],d[2]) :
          d.constructor === Number ? new Date(d) :
          d.constructor === String ? new Date(d) :
          typeof d === "object" ? new Date(d.year,d.month,d.date) :
          NaN
      );
  },
  compare:function(a,b) {
      // Compare two dates (could be of any type supported by the convert
      // function above) and returns:
      //  -1 : if a < b
      //   0 : if a = b
      //   1 : if a > b
      // NaN : if a or b is an illegal date
      // NOTE: The code inside isFinite does an assignment (=).
      return (
          isFinite(a=this.convert(a).valueOf()) &&
          isFinite(b=this.convert(b).valueOf()) ?
          (a>b)-(a<b) :
          NaN
      );
  },
  inRange:function(d,start,end) {
      // Checks if date in d is between dates in start and end.
      // Returns a boolean or NaN:
      //    true  : if d is between start and end (inclusive)
      //    false : if d is before start or after end
      //    NaN   : if one or more of the dates is illegal.
      // NOTE: The code inside isFinite does an assignment (=).
     return (
          isFinite(d=this.convert(d).valueOf()) &&
          isFinite(start=this.convert(start).valueOf()) &&
          isFinite(end=this.convert(end).valueOf()) ?
          start <= d && d <= end :
          NaN
      );
  }
}

const get_credentials = function() {
  var access_token_expiration_dt = new Date(credentials.expiration);
  var curr_dt = new Date();

  if (dates.compare(access_token_expiration_dt, curr_dt) >= 0) {
    return renew_access(access_token.refreshToken);
  } else {
    return credentials;
  }
}

module.exports.client = client;
module.exports.get_vehicles = get_vehicles;
module.exports.get_vehicle = get_vehicle;
module.exports.get_vehicle_location = get_vehicle_location;
module.exports.lock_vehicle = lock_vehicle;
module.exports.unlock_vehicle = unlock_vehicle;
module.exports.get_credentials = get_credentials;




