const routes = require('next-routes')();

routes
    .add('/battle', '/battle')
    .add('/market', '/market')
    .add('/my_units', '/my_units')
    .add('/buy', '/buy');

module.exports = routes;