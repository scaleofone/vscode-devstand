<?php
require __DIR__.'/vendor/autoload.php';
use Webmozart\Glob\Glob;
use Webmozart\PathUtil\Path;

function responseJson($data, $httpCode = 200) {
    http_response_code($httpCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    echo PHP_EOL;
    exit;
};

function request($key = null) {
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $req = json_decode(file_get_contents('php://input'), true);
        if (is_string($req)) {
            $req = ['pattern' => $req];
        }
    } else {
        $req = [];
    }
    return $key ? (array_key_exists($key, $req) ? $req[$key] : null) : $req;
}


$workspaceFolderAbsolutePath = '/Users/max/Laravel/filemanager';
$pattern = request('pattern') ?: '**/.gitignore';
if (! $pattern) {
    responseJson('pattern param is required', 442);
}

$exclude = request('exclude') ?: '**/node_modules/**';
$excludes = (substr($exclude, 0, 1) == '{' && substr($exclude, -1, 1) == '}')
    ? explode(',', substr($exclude, 1, strlen($exclude)-2))
    : [$exclude];
for ($e = 0; $e < count($excludes); $e++) {
    if (substr($excludes[$e], -3, 3) == '/**') {
        $excludes[$e] .= '/*';
    }
}
$excludesAbsolute = array_map(function ($exclude) use ($workspaceFolderAbsolutePath) {
    return Path::makeAbsolute($exclude, $workspaceFolderAbsolutePath);
}, $excludes);

$entries = [];
foreach (Glob::glob(Path::makeAbsolute($pattern, $workspaceFolderAbsolutePath)) as $entry) {
    foreach ($excludesAbsolute as $excludeAbsolute) {
        if (Glob::match($entry, $excludeAbsolute)) {
            continue 2; // skip the outer "foreach"
        }
    }
    $entries[] = str_replace($workspaceFolderAbsolutePath.'/', '', $entry);
}
responseJson($entries);
