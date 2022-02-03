<?php

function responseJson($data, $httpCode = 200) {
    http_response_code($httpCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

$workspaceFolderAbsolutePath = '/Users/max/Laravel/filemanager';
$path = $_GET['path'];
if (! $path) {
    responseJson('path param is required', 442);
}
$filePath = (substr($path, 0, 1) == '/') ? $path : $workspaceFolderAbsolutePath.'/'.$path;
if (! is_file($filePath)) {
    responseJson('file not found for path: '.$filePath, 442);
}

preg_match('/\.([a-z]*)$/', $path, $match);
$ext = (is_array($match) && count($match) == 2) ? $match[1] : null;
$mimes = [
    'json' => 'application/json',
];

http_response_code(200);
if (array_key_exists($ext, $mimes)) {
    header('Content-Type: '.$mimes[$ext]);
}
readfile($filePath);
