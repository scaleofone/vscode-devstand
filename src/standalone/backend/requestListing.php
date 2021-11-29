<?php

$responseJson = function ($data, $httpCode = 200) {
    http_response_code($httpCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
};

$workspaceFolderAbsolutePath = '/Users/max/Laravel/filemanager';
$directory = trim(@$_REQUEST['directory'], '\/');
$directoryToScan = $directory ? $workspaceFolderAbsolutePath.'/'.$directory : $workspaceFolderAbsolutePath;

if (! is_dir($workspaceFolderAbsolutePath) || ! is_dir($directoryToScan)) {
    $responseJson([]);
}

$entries = [];
foreach (scandir($directoryToScan) as $entry) {
    $entryPath = $directoryToScan.'/'.$entry;
    if ($entry == '.' || $entry == '..' || is_link($entryPath)) {
        continue;
    }
    if (is_file($entryPath)) {
        $entries[] = $entry;
    }
    if (is_dir($entryPath)) {
        $entries[] = $entry.'/';
    }
}

$responseJson($entries);
