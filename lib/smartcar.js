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
  smartcar.getVehicleIds(token)
  .then(callback(response));
}

const get_vehicle_info = function(access_token, vehicle_id, callback) {
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
});


module.exports.client = client;
module.exports.get_vehicles = get_vehicles;
module.exports.get_vehicle_info = get_vehicle_info;
module.exports.get_vehicle_location = get_vehicle_location;
module.exports.lock_vehicle = lock_vehicle;
module.exports.unlock_vehicle = unlock_vehicle;




