# [Discontinued] - TAJP - Template Angular+Javascript+PHP

Supersimple template/boilerplate for starting small projects with separated client side and server/api.

## Install & Config
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
define("DB_NAME", "test");

// Password salt
define('PASS_SALT', "some_strong_random_string");

// Json Web Tokens
// Secret key, change this to your unique key, do not share or public anywhere
define("JWT_SECRET", "some_strong_random_string");
// Expiration of cookies in minutes
define("JWT_EXPIRE", 15);
```
Change the server address in **client/js/app.js** (right on the top):
```javascript
$rootScope.globals = {
	serverUrl: 'http://localhost/tajp/server'
}
```

Run **_install/create_table.sql** in your mysql database manager (phpmyadmin, adminer).
This will create table 'accounts'.

And you are good to go.

## Used libraries
- [Slim](http://www.slimframework.com/): Great PHP framework (v2)
- [slim-jwt-auth](https://github.com/tuupola/slim-jwt-auth) by Mika Tuupola
- [corsslim](https://github.com/palanik/corsslim) by palanik
- [Medoo](http://medoo.in/) simple fast PHP database framework by Catfan
- [BRICKst](https://github.com/allienworks/BRICKst) neat CSS framework by Martin Allien

## License
Released under [MIT license](http://opensource.org/licenses/MIT), Copyright © 2015 Filip Vincůrek
