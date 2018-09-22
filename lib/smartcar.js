'use strict';

const smartcar = require('smartcar');

const client = new smartcar.AuthClient({
  clientId: '4a86ba96-2e0d-4c9b-a960-f79fb3487e53',
  clientSecret: 'aeac4157-9c6a-4cbe-9bff-1af55c995c0e',
  redirectUri: 'http://localhost:3000/callback',
  scope: ['read_vehicle_info'],
  testMode: true, // launch the Smartcar auth flow in test mode
});
