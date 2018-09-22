var express = require('express');
const _ = require('lodash');
const smartcar = require('smartcar');
var router = express.Router();

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

/**
 * Helper function that redirects to the /error route with a specified
 * error message and action.
 */
const redirectToError = (res, message, action) => res.redirect(url.format({
  pathname: '/error',
  query: {message, action},
}));

/**
 * Render home page with a "Connect your car" button.
 */
router.get('/auth', function(req, res, next) {
  res.redirect(client.getAuthUrl());
});

/**
 * Called on return from the Smartcar authorization flow. This route extracts
 * the authorization code from the url and exchanges the code with Smartcar
 * for an access token that can be used to make requests to the vehicle.
 */
router.get('/callback', function(req, res, next) {
  const code = _.get(req, 'query.code');
  if (!code) {
    return res.redirect('/');
  }

  // Exchange authorization code for access token
  client.exchangeCode(code)
    .then(function(access) {
      req.session = {};
      req.session.vehicles = {};
      req.session.access = access;
      console.log(JSON.stringify(access));
      return res.redirect('/');
    })
    .catch(function(err) {
      const message = err.message || `Failed to exchange authorization code for access token`;
      const action = 'exchanging authorization code for access token';
      return redirectToError(res, message, action);
    });
});

module.exports = router;