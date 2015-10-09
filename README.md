# TAJP - Template Angular+Javascript+PHP

Supersimple template/boilerplate for starting small projects with separated client side and server/api.

## Using
Install dependencies via [Composer](https://getcomposer.org/).

Run in **/server** directory:
```shell
php composer.phar install
```

Change the settings in **server/config/config.php**:
```php
// Database settings
define("DB_HOST", "localhost");
define("DB_USER", "root");
define("DB_PASS", "passwd");
// Json Web Tokens
cefine("JWT_SECRET", "z0Q5SrbSOhRU0YvHFE8CRav9I0OIg6TMYt4+jpLwk3w3QqfUMVYQ3C2ntOKV82A6YWo1vrhm3ZcaDzjcVYsBAw==");
```
Change the server address in **client/js/app.js**:
```javascript
$rootScope.globals.serverUrl = 'http://localhost/tajp/server';
$rootScope.globals.token = window.localStorage['jwt_token'] || {};
```

Run **_install/create_table.sql** in your mysql database manager (phpmyadmin, adminer).
This will create table 'test' and insert foo user.

And you are good to go.

## Used libraries
- [Slim](http://www.slimframework.com/) framework (v2)
- [slim-jwt-auth](https://github.com/tuupola/slim-jwt-auth)
- [corsslim](https://github.com/palanik/corsslim)
- [Medoo](http://medoo.in/) PHP database framework
- [BRICKst](https://github.com/allienworks/BRICKst)

## License
Released under [MIT license](http://opensource.org/licenses/MIT), Copyright © 2015 Filip Vincůrek

## WIP
Still in active development.