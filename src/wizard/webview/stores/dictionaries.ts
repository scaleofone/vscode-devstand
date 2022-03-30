export const allModules: string[] = [
    'bcmath','bz2','calendar','ctype','curl','date','dom','exif','fileinfo','filter','ftp','gd','gettext','gmp','hash','iconv','intl','json','libxml','mbstring','mongodb','openssl','opcache','pcntl','pcre','pdo','pdo_sqlite','phar','posix','reflection','session','shmop','simplexml','sockets','sodium','spl','sqlite3','sysvmsg','sysvsem','template','tokenizer','xdebug','xml','xmlreader','xmlwriter','yaml','zip','zlib'
]

export interface Base {
    caption: string
    image: string
    tag: string
    phpVersion: string
    builtinModules: string[]
}

export const bases: Base[] = [
    {
        caption: 'Alpine',
        image: 'alpine',
        tag: '3.14',
        phpVersion: '7.4',
        builtinModules: ['date','filter','hash','libxml','pcre','readline','reflection','spl','zlib'],
    },
    {
        caption: 'Alpine',
        image: 'alpine',
        tag: '3.13',
        phpVersion: '7.4',
        builtinModules: ['date','filter','hash','libxml','pcre','readline','reflection','spl','zlib'],
    },
    {
        caption: 'Alpine',
        image: 'alpine',
        tag: '3.12',
        phpVersion: '7.3',
        builtinModules: ['date','filter','hash','libxml','pcre','readline','reflection','spl','zlib'],
    },
    {
        caption: 'Alpine',
        image: 'alpine',
        tag: '3.11',
        phpVersion: '7.3',
        builtinModules: ['date','filter','hash','libxml','pcre','readline','reflection','spl','zlib'],
    },
    {
        caption: 'Alpine',
        image: 'alpine',
        tag: '3.10',
        phpVersion: '7.3',
        builtinModules: ['date','filter','hash','libxml','pcre','readline','reflection','spl','zlib'],
    },
    {
        caption: 'Alpine',
        image: 'alpine',
        tag: '3.9',
        phpVersion: '7.2',
        builtinModules: ['date','filter','hash','libxml','pcre','readline','reflection','spl','zlib'],
    },
    {
        caption: 'Ubuntu',
        image: 'ubuntu',
        tag: '21.04',
        phpVersion: '7.4',
        builtinModules: ['ffi','json','pdo','posix','shmop','sodium','sysvmsg','sysvsem','sysvshm','opcache','calendar','ctype','date','filter','exif','fileinfo','ftp','gettext','hash','iconv','libxml','openssl','pcntl','pcre','phar','readline','reflection','session','spl','sockets','tokenizer','zlib'],
    },
    {
        caption: 'Ubuntu',
        image: 'ubuntu',
        tag: '20.04',
        phpVersion: '7.4',
        builtinModules: ['ffi','json','pdo','posix','shmop','sodium','sysvmsg','sysvsem','sysvshm','opcache','calendar','ctype','date','filter','exif','fileinfo','ftp','gettext','hash','iconv','libxml','openssl','pcntl','pcre','phar','readline','reflection','session','spl','sockets','tokenizer','zlib'],
    },
    {
        caption: 'Ubuntu',
        image: 'ubuntu',
        tag: '18.04',
        phpVersion: '7.2',
        builtinModules: ['json','pdo','posix','shmop','sodium','sysvmsg','sysvsem','sysvshm','opcache','calendar','ctype','date','filter','exif','fileinfo','ftp','gettext','hash','iconv','libxml','openssl','pcntl','pcre','phar','readline','reflection','session','spl','sockets','tokenizer','zlib'],
    },
    {
        caption: 'CentOS',
        image: 'centos',
        tag: '8',
        phpVersion: '7.4',
        builtinModules: ['curl','bz2','calendar','ctype','date','filter','exif','fileinfo','ftp','gettext','hash','iconv','libxml','openssl','pcntl','pcre','phar','readline','reflection','session','spl','sockets','tokenizer','zlib'],
    },
    {
        caption: 'CentOS',
        image: 'centos',
        tag: '8',
        phpVersion: '7.3',
        builtinModules: ['curl','bz2','calendar','ctype','date','filter','exif','fileinfo','ftp','gettext','hash','iconv','libxml','openssl','pcntl','pcre','phar','readline','reflection','session','spl','sockets','tokenizer','zlib'],
    },
    {
        caption: 'CentOS',
        image: 'centos',
        tag: '8',
        phpVersion: '7.2',
        builtinModules: ['curl','bz2','calendar','ctype','date','filter','exif','fileinfo','ftp','gettext','hash','iconv','libxml','openssl','pcntl','pcre','phar','readline','reflection','session','spl','sockets','tokenizer','zlib'],
    },
]
