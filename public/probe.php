<?php declare(strict_types=1);

use Shopware\Production\HttpKernel;
use Symfony\Component\HttpFoundation\Request;

header('Content-Type: text/plain; charset=utf-8');

$keys = [
    'HTTP_HOST',
    'SERVER_NAME',
    'HTTPS',
    'REQUEST_SCHEME',
    'SERVER_PORT',
    'HTTP_X_FORWARDED_PROTO',
    'HTTP_X_FORWARDED_HOST',
    'HTTP_X_FORWARDED_PORT',
    'REQUEST_URI',
    'REMOTE_ADDR',
];

foreach ($keys as $key) {
    echo $key . '=' . (isset($_SERVER[$key]) ? (string) $_SERVER[$key] : '(unset)') . "\n";
}

$secret = (string) ($_SERVER['APP_SECRET'] ?? getenv('APP_SECRET') ?: '');
echo 'APP_ENV=' . (string) ($_SERVER['APP_ENV'] ?? $_ENV['APP_ENV'] ?? '(unset)') . "\n";
echo 'APP_DEBUG=' . (string) ($_SERVER['APP_DEBUG'] ?? '(unset)') . "\n";
echo 'SECRET_LEN=' . strlen($secret) . "\n";
echo 'DB=' . (getenv('DATABASE_URL') ? 'yes' : 'no') . "\n";

$classLoader = require __DIR__ . '/../vendor/autoload.php';
$request = Request::createFromGlobals();
echo 'LOOKUP=' . $request->getScheme() . '://' . $request->getHttpHost() . $request->getRequestUri() . "\n";

try {
    $kernel = new HttpKernel((string) ($_SERVER['APP_ENV'] ?? 'prod'), true, $classLoader);
    $result = $kernel->handle($request);
    $body = (string) $result->getResponse()->getContent();
    echo 'STATUS=' . $result->getResponse()->getStatusCode() . "\n";
    if (preg_match('/class="exception-message[^"]*"[^>]*>(.*?)</s', $body, $match)) {
        echo 'EXC=' . trim(html_entity_decode(strip_tags($match[1]))) . "\n";
    }
} catch (Throwable $exception) {
    $message = preg_replace('/mysql:\/\/\S+/', 'mysql://***', $exception->getMessage());
    $message = preg_replace('/def000[a-z0-9]+/', '***', (string) $message);
    echo get_class($exception) . "\n" . $message . "\n";
}
