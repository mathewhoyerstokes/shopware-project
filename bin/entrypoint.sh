#!/bin/sh

set -e

if [ -z $1 ]; then
    if [ ! -f config/jwt/private.pem ] || [ ! -f config/jwt/public.pem ]; then
        mkdir -p config/jwt
        OPENSSL_CONF=/etc/ssl/openssl.cnf php -r '$key = openssl_pkey_new(["private_key_bits" => 2048, "private_key_type" => OPENSSL_KEYTYPE_RSA]); if ($key === false) { fwrite(STDERR, openssl_error_string() . PHP_EOL); exit(1); } openssl_pkey_export_to_file($key, "config/jwt/private.pem"); $details = openssl_pkey_get_details($key); file_put_contents("config/jwt/public.pem", $details["key"]); chmod("config/jwt/private.pem", 0660); chmod("config/jwt/public.pem", 0660);'
    fi
    bin/console theme:compile || true
    /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
else
    bin/console $@
fi