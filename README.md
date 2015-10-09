# TAJP - Template Angular+Javascript+PHP

Supersimple template/boilerplate for starting small projects with separated client side and server/api side.

Based on Slim framework using tuupolas slim-jwt-auth and Medoo misqli library

## Using
Install dependencies via composer
```shell
php composer.phar install
```

Change the settings in ```server/config/config.php```:
```php
// Database settings
define("DB_HOST", "localhost");
define("DB_USER", "root");
define("DB_PASS", "passwd");

// Json Web Tokens
cefine("JWT_SECRET", "z0Q5SrbSOhRU0YvHFE8CRav9I0OIg6TMYt4+jpLwk3w3QqfUMVYQ3C2ntOKV82A6YWo1vrhm3ZcaDzjcVYsBAw==");
```
Change the server address in ```client/js/app.js``` on lines 13 and 14:
```javascript
$rootScope.globals.serverUrl = 'http://localhost/tajp/server';
$rootScope.globals.token = window.localStorage['jwt_token'] || {};
```

Create the database tables by running ```_install/create_table.sql``` in your mysql database manager (phpmyadmin, adminer).

And you are good to go.

## License
Released under MIT license, copyright by Filip Vincůrek

## WIP
Still in active development for the Alliens out there.