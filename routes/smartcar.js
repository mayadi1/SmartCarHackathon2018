var express = require('express');
const _ = require('lodash');
const smartcar = require('../lib/smartcar');
var router = express.Router();

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
  res.redirect(smartcar.client.getAuthUrl());
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
  smartcar.client.exchangeCode(code)
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