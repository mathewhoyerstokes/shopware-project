<?php

/**
 * Shopware's built administration bundle crashes when an API error arrives
 * before the Vue app exists: it reads $tc from a null application root and
 * the login screen never appears. The bundle is installed by Composer, so
 * this patch is applied to the compiled file after composer install.
 */

chdir(dirname(__DIR__));

$needle = 'var e=Shopware.Application.view.root,n=e.$tc.bind(e),r=t.response,a=r.status,o=r.data.errors;';
$replacement = 'var e=Shopware.Application.view.root;if(!e||!t.response)return Promise.reject(t);var n=e.$tc.bind(e),r=t.response,a=r.status,o=(r.data&&r.data.errors)||[];';

$paths = [
    'vendor/shopware/administration/Resources/public/static/js/commons.js',
    'public/bundles/administration/static/js/commons.js',
];

$patched = 0;

foreach ($paths as $path) {
    if (!is_file($path)) {
        continue;
    }

    $contents = file_get_contents($path);
    $count = substr_count($contents, $needle);

    if ($count === 0 && strpos($contents, $replacement) !== false) {
        continue;
    }

    if ($count !== 1) {
        fwrite(STDERR, "Admin boot patch expected 1 match in {$path}, found {$count}\n");
        exit(1);
    }

    file_put_contents($path, str_replace($needle, $replacement, $contents));
    $patched++;
}

if ($patched === 0) {
    fwrite(STDERR, "Admin boot patch did not find commons.js\n");
    exit(1);
}

fwrite(STDOUT, "Patched administration boot in {$patched} file(s)\n");
