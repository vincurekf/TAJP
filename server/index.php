<?php
// require composer autoload
require 'vendor/autoload.php';
// include config
require 'config/config.php';
// automacally require API classes and helpers
require 'autoload.php';

// Initialize database connection
$database = new medoo([
  'database_type' => 'mysql',
  'charset' => 'utf8',
  'database_name' => DB_NAME,
  'server' => DB_HOST,
  'username' => DB_USER,
  'password' => DB_PASS
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
    $app->oldJwt = $options["decoded"];
    $decodedData =  (array) $app->oldJwt->data;
    $user_id = $decodedData['user_id'];
    $user_name = $decodedData['user_name'];
    $app->newToken = Authenticate::reissueToken( $user_id, $user_name );// $options["decoded"];
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
  $resultArr['token'] = $app->newToken;
  $resultArr['result'] = UsersAPI::get( $database );
  echo json_encode( $resultArr );
});
// add new user
$app->post('/api/users', function () use ($app, $database) {
  $data = json_decode( $app->request->getBody() );
  $user_id = UsersAPI::post( $database, $data );
  echo $user_id;
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
  $credentials = json_decode( $app->request->getBody() );
  // log in the user with given credentials
  $loginStatus = Authenticate::login( $credentials, $database );
  // return the succes/error state to javascript
  echo json_encode( $loginStatus );
});
/*
 * REGISTER route, handles registration
 */
$app->post('/register', function () use ($app, $database) {
  $data = json_decode( $app->request->getBody() );
  $user_id = UsersAPI::post( $database, $data );
  echo json_encode( $user_id );
});

// Run Slim app
$app->run();

?>