'use strict';

const Hapi = require('hapi');
const Vision = require('vision');
const Inert = require('inert');
const Pug = require('pug');
const HapiSwagger = require('hapi-swagger');
const ApiRouters = require('./app_api/routes');
const WebRouters = require('./app_server/routes');
const Pack = require('./package');

const internals = {
    templatePath: '.'
};

internals.main = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    const swaggerOptions = {
        info: {
            title: 'DailyReading API Documentation',
            version: Pack.version
        }
    };

    await server.register([
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    server.views({
        engines: { pug: Pug },
        relativeTo: __dirname,
        path: `app_server/views/${internals.templatePath}`
    });

    server.route(ApiRouters.routes);
    server.route(WebRouters.routes);

    await server.start();

    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

internals.main();
