<?php

/**
 * The compiled Shopware administration bundle is installed by Composer.
 * Two boot failures leave a blank page after login, so both are patched here:
 * an API error before Vue exists crashes on a null $tc, and a 502 while the
 * container is busy rejects the whole boot before the router exists.
 */

chdir(dirname(__DIR__));

$paths = [
    'vendor/shopware/administration/Resources/public/static/js/commons.js',
    'public/bundles/administration/static/js/commons.js',
];

$httpVersions = [
    'function(t){t.interceptors.response.use((function(t){return t}),(function(t){var e=Shopware.Application.view.root,n=e.$tc.bind(e),r=t.response,a=r.status,o=r.data.errors;',
    'function(t){t.interceptors.response.use((function(t){return t}),(function(t){var e=Shopware.Application.view.root;if(!e||!t.response)return Promise.reject(t);var n=e.$tc.bind(e),r=t.response,a=r.status,o=(r.data&&r.data.errors)||[];',
];

$httpReplacement = 'function(t){Shopware.__adminHttp=t;t.interceptors.response.use((function(t){return t}),(function(t){if(t.config&&(!t.response||t.response.status===502||t.response.status===503||t.response.status===504)){t.config.__retryCount=(t.config.__retryCount||0)+1;if(t.config.__retryCount<=3){return new Promise(function(resolve){setTimeout(resolve,700);}).then(function(){return Shopware.__adminHttp.request(t.config);});}}var e=Shopware.Application.view.root;if(!e||!t.response)return Promise.reject(t);var n=e.$tc.bind(e),r=t.response,a=r.status,o=(r.data&&r.data.errors)||[];';

$errorNeedle = '{key:"createApplicationRootError",value:function(t){console.error(t);var e=this.getContainer("init").router.getRouterInstance();this.view.init("#app",e,this.getContainer("service")),this.view.root.initError=t,e.push({name:"error"})}}';

$errorReplacement = '{key:"createApplicationRootError",value:function(t){console.error(t);try{this.view.initDependencies()}catch(n){}var e=this.getContainer("init").router.getRouterInstance();this.view.init("#app",e,this.getContainer("service")),this.view.root.initError=t;if(e&&e.push){e.push({name:"error"})}}}';

$patched = 0;

foreach ($paths as $path) {
    if (!is_file($path)) {
        continue;
    }

    $contents = file_get_contents($path);
    $original = $contents;

    if (strpos($contents, 'Shopware.__adminHttp=t') === false) {
        $replaced = false;

        foreach ($httpVersions as $version) {
            if (substr_count($contents, $version) === 1) {
                $contents = str_replace($version, $httpReplacement, $contents);
                $replaced = true;
                break;
            }
        }

        if (!$replaced) {
            fwrite(STDERR, "Admin HTTP patch target missing in {$path}\n");
            exit(1);
        }
    }

    if (strpos($contents, 'try{this.view.initDependencies()}catch(n){}') === false) {
        if (substr_count($contents, $errorNeedle) !== 1) {
            fwrite(STDERR, "Admin error-handler patch target missing in {$path}\n");
            exit(1);
        }

        $contents = str_replace($errorNeedle, $errorReplacement, $contents);
    }

    if ($contents !== $original) {
        file_put_contents($path, $contents);
        $patched++;
    }
}

if ($patched === 0 && !is_file($paths[0]) && !is_file($paths[1])) {
    fwrite(STDERR, "Admin boot patch did not find commons.js\n");
    exit(1);
}

fwrite(STDOUT, "Patched administration boot in {$patched} file(s)\n");
