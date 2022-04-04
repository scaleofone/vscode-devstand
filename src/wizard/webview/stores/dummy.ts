export const dockerignoreAsText = `*
!app
!bootstrap
bootstrap/cache/*
!config
!database
!public
!resources
!routes
!storage
storage/app/*
!storage/app/public
storage/app/public/*
storage/framework/cache/*
storage/framework/sessions/*
storage/framework/testing/*
storage/framework/views/*
storage/logs/*
!tests
!phpunit.xml
!artisan
!composer.json
!composer.lock
!Dockerfile
!entrypoint.sh
!unit.conf.json
!package.json
!yarn.lock
!webpack.mix.js
`

export const dockerfileAsText = `FROM nginx/unit:1.19.0-php7.3 AS base

RUN apt-get update --quiet \\
    && DEBIAN_FRONTEND=noninteractive apt-get install --no-install-recommends --no-install-suggests --yes --no-upgrade \\
        php7.3-xml \\
        php7.3-mbstring \\
        php7.3-zip \\
    && rm -rf /var/lib/apt/lists/*

WORKDIR /dist

RUN useradd --create-home --no-log-init --uid 1001 appuser \\
    && mkdir -p /var/lib/unit/certs     && chown -R appuser /var/lib/unit \\
    && mkdir -p /var/run/unit           && chown -R appuser /var/run/unit


################################################################################


FROM composer:1.9.0 AS composer

WORKDIR /app

COPY composer.json composer.lock ./

RUN composer install --no-scripts --no-autoloader --no-dev \\
    --no-suggest --no-interaction --no-progress

COPY app        ./app/
COPY bootstrap  ./bootstrap/
COPY config     ./config/
COPY database   ./database/
COPY public     ./public/
COPY resources  ./resources/
COPY routes     ./routes/
COPY storage    ./storage/
COPY artisan    ./artisan

RUN mkdir tests \
    && composer dump-autoload --optimize --apcu --no-dev


################################################################################


FROM base

COPY --from=composer /app       /dist

RUN chown -R appuser \\
    bootstrap/cache storage public/uploads

USER appuser

EXPOSE 8080
ENTRYPOINT ["/entrypoint.sh"]
CMD ["web"]
`

export const entrypointAsText = `#!/bin/bash
set -e

if [ "$1" = 'migrate' ]; then

    export ENTRYPOINT_CMD='migrate'
    php artisan migrate --force
    # php artisan db:seed --class=.... --force


elif [ "$1" = 'web' ]; then

    export ENTRYPOINT_CMD='web'
    exec unitd --no-daemon --log /dev/stdout  --pid /var/run/unit/unit.pid  --control unix:/var/run/unit/control.unit.sock


elif [ "$1" = 'worker' ]; then
    export ENTRYPOINT_CMD='worker'

    COMMAND="php artisan queue:work $2"
    echo "Worker command: $COMMAND"
    exec $COMMAND

elif [ -n "$1" ]; then
    exec "$@"
else
    echo "NO COMMAND PASSED TO ENTRYPOINT! Available commands: web, migrate, worker"
    exit 1
fi
`
