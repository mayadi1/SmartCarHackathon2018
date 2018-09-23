var https = require('https');

const get_street_address = function(api_key, lat, lng, callback) {
  var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&key=" + api_key;
  https.get(url, (res) => {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];
  
    let error;
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
                        `Status Code: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error('Invalid content-type.\n' +
                        `Expected application/json but received ${contentType}`);
    }
    if (error) {
      console.error(error.message);
      // consume response data to free up memory
      res.resume();
      callback(null);
      return;
    }
  
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);

        if (parsedData && parsedData.results && parsedData.results.length > 0) {
          // return first formatted_address
          for(var i=0; i<parsedData.results.length; i++) {
            var formatted_address = parsedData.results[i].formatted_address;
            if (formatted_address && formatted_address != "") {
              callback(formatted_address);
              return;
            }
          }

          // no formatted_address found
          callback(null);
        } else {
          console.log(parsedData);
          callback(null);
        }
      } catch (e) {
        console.error(e.message);
        callback(null);
      }
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
    callback(null);
  });
};

module.exports.get_street_address = get_street_address;