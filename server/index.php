<?php
// require composer autoload
require 'vendor/autoload.php';
// include config
require 'config/config.php';
// require helpers autoload
require 'helpers/autoload.php';
// require API autoload
require 'api/autoload.php';

// Initialize database connection
$database = new medoo([
  'database_type' => 'mysql',
  'database_name' => 'test',
  'server' => DB_HOST,
  'username' => DB_USER,
  'password' => DB_PASS,
  'charset' => 'utf8'
]);

/*
 * Configure Slim app
 * 1. Create Slim app
 * 2. Add JWT middleware for json web token authentication
 * 3. Allow CORS request so itl will accept calls from other domains
 */
// 1
$app = new \Slim\Slim();
// 2
$app->add(new \Slim\Middleware\JwtAuthentication([
  "secret" => base64_decode(JWT_SECRET),
  "path" => ["/api"] ,
  "callback" => function ($options) use ($app) {
    $app->jwt = $options["decoded"];
  }
]));
// 3
$app->add(new \CorsSlim\CorsSlim( array(
  "origin" => "*",
  "allowCredentials" => True
)));

/*
 * API ROUTES
 */

// get all users
$app->get('/api/users', function () use ($app, $database) {
  $users = $database->select("accounts","*");
  echo json_encode( $users );
});
// add new user
$app->post('/api/users', function () use ($app, $database) {
  /*
    // Insert entry
    $last_user_id = $database->insert('accounts', [
      'user_name' => 'foo',
      'user_email' => 'foo@bar.com',
      'password' => 'pass'
    ]);
    echo $last_user_id;
  */
});
// update user
$app->put('/api/users', function () use ($app, $database) {
});
// delete user
$app->delete('/api/users', function () use ($app, $database) {
});

/*
 * LOGIN route, handles login
 * based on given username and password
 */
$app->post('/login', function () use ($app, $database) {
  $credentials = json_decode($app->request->getBody());
  // log in the user with given credentials
  $loginStatus = Login( $credentials, $database );
  // return the succes/error state to javascript
  echo json_encode( $loginStatus );
});

// Run Slim app
$app->run();

?>