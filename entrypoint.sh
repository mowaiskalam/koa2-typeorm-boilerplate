#!/bin/sh

# Run Migrations  in local development env
echo "$NODE_ENV"
[ "$NODE_ENV" = 'local' ]\
    && npm run build\
    && npm run build:post\
    && npm run migrate:run:tsc

exec "$@"
