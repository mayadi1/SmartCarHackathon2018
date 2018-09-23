'use strict';

const smartcar = require('smartcar');
const models = require('../models/user.model');

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
  .then(function(res) {
    if (!res) {
      callback(null);
    } else {
      var vehicles = [];

      if (res.vehicles) {
        var add_to_vehicles = function(vehicle_ids) {
          if (vehicle_ids && vehicle_ids.length > 0) {
            var vehicle_id = vehicle_ids.pop();

            var vehicle = get_vehicle(access_token, vehicle_id);
            vehicle.info().then(function(data) {
              console.log("###1. data: " + JSON.stringify(data));
              get_vin(vehicle, function(vin_data) {
                console.log("###vin_data: " + JSON.stringify(vin_data));
                console.log("###vin: " + vin_data);
                data["vin"] = vin_data;
                vehicles.push(data); 
                console.log("###2. data: " + JSON.stringify(data));
                add_to_vehicles(vehicle_ids);
              });
            });
          } else {
            callback(vehicles);
          }
        }

        add_to_vehicles(res.vehicles);
      }
    }
  });
};

const get_vehicle = function(access_token, vehicle_id) {
  return new smartcar.Vehicle(vehicle_id, access_token);
};

const get_vin = function(vehicle, callback) {
  vehicle.vin().then(callback);
};

const get_vehicle_location = function(vehicle, callback) {
  vehicle.location().then(callback);
};

const lock_vehicle = function(vehicle, callback) {
  vehicle.lock().then(callback);
};

const unlock_vehicle = function(vehicle, callback) {
  vehicle.unlock().then(callback);
};

const renew_access = function(refresh_token, callback) {
  client.exchangeRefreshToken(refresh_token).then(callback);
}

// TODO: Hardcoded for now. Fix later.
var credentials = JSON.parse('{"accessToken":"274e4517-1b93-4d7a-a01e-4abae85ea44c","refreshToken":"df63530a-2730-4a96-be03-043566795383","expiration":"2018-09-23T07:26:13.653Z","refreshExpiration":"2018-11-22T05:26:13.654Z"}');

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

const get_credentials = function(user_name, callback) {
  models.get_user_by_name(user_name, function(err, docs) {
    if (err) {
      console.error(err);
      callback(null);
    } else if (!docs || docs.length == 0) {
      console.error("User, " + user_name + ", not found");
    } else {
      var credentials = docs[0].credentials;

      var access_token_expiration_dt = new Date(credentials.expiration);
      var curr_dt = new Date();
  
      if (dates.compare(access_token_expiration_dt, curr_dt) < 0) {
        console.log("###refreshing token");
        renew_access(credentials.refreshToken, function(credentials) {
          docs[0].credentials = credentials;
          docs[0].save(function(err) {
            if (err) {
              console.error(err);
              callback(null);
            } else {
              callback(credentials);
            }
          });
        });
      } else {
        callback(credentials);
      }    
    }
  });


}

module.exports.client = client;
module.exports.get_vehicles = get_vehicles;
module.exports.get_vehicle = get_vehicle;
module.exports.get_vehicle_location = get_vehicle_location;
module.exports.lock_vehicle = lock_vehicle;
module.exports.unlock_vehicle = unlock_vehicle;
module.exports.get_credentials = get_credentials;




