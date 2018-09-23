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
  .then(callback(response));
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
var credentials = '{“accessToken”:“e49e2cdd-07e5-4f83-aec6-38ee8c776e89",“refreshToken”:“88e382ef-155c-4295-9b1a-ab538b590b27",“expiration”:“2018-09-23T02:06:55.435Z”,“refreshExpiration”:“2018-11-22T00:06:55.435Z”}';

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




