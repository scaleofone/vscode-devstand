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

export const basesOrder = ['Ubuntu', 'CentOS', 'Alpine']

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

export interface Server {
    package: string
    caption: string
    description: string
    recommended: boolean
}

export const servers = [
    {
        package: 'unit',
        caption: 'Nginx Unit',
        description: [
            'Bundle <a href="http://unit.nginx.org">Nginx Unit</a> application server and the code of your application into <b>one single container</b>.',
            'Nginx Unit utilizes its own process manager to invoke your application.',
            'Running container will expose port 8080 to access your application via HTTP protocol.'
        ].join('<br>'),
        recommended: true,
    },
    {
        package: 'apache',
        caption: 'Apache',
        description: [
            'Bundle Apache web server and the code of your application into <b>one single container</b>. Apache utilizes mod_php to invoke your application.',
            'Running container will expose port 8080 to access your application via HTTP protocol.',
        ].join('<br>'),
        recommended: false,
    },
    {
        package: 'fpm',
        caption: 'PHP-FPM',
        description: [
            'Bundle PHP-FPM (Fast Process Manager) and the code of your application into one single container.',
            'Running container will expose port 9000 to access your application <b>via FastCGI protocol</b>.',
            'To access your application via HTTP protocol you <b>must put yet another container to proxy HTTP calls</b> to the FastCGI server.',
        ].join('<br>'),
        recommended: false,
    },
]
