<?php
// require composer autoload
require 'vendor/autoload.php';

// include config
require 'config/config.php';
// require needed classes and functions
require 'helpers/jwt.php';
require 'helpers/crypto_rand.php';
require 'helpers/login.php';

// Initialize database connection
$database = new medoo([
  'database_type' => 'mysql',
  'database_name' => 'test',
  'server' => DB_HOST,
  'username' => DB_USER,
  'password' => DB_PASS,
  'charset' => 'utf8'
]);

// Create and configure Slim app
$app = new \Slim\Slim();

// JWT middleware
// handles authentication via json web token
$app->add(new \Slim\Middleware\JwtAuthentication([
  "secret" => base64_decode(JWT_SECRET),
  "path" => ["/api"] ,
  "callback" => function ($options) use ($app) {
    $app->jwt = $options["decoded"];
  }
]));

// allow CORS requests
$corsOptions = array(
  "origin" => "*",
  "allowCredentials" => True
);
$app->add(new \CorsSlim\CorsSlim($corsOptions));

// API for users
// GET all users
$app->get('/api/users', function () use ($app, $database) {
  $users = $database->select("accounts","*");
  echo json_encode( $users );
});
// POST new user (register)
// TODO
$app->post('/api/users', function () use ($app, $database) {
  // add new user
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
// PUT data to user (update)
// TODO
$app->put('/api/users', function () use ($app, $database) {
  // update user
});

// LOGIN route, handles login
// based on given username and password
$app->post('/login', function () use ($app, $database) {
  $credentials = json_decode($app->request->getBody());
  // Get user by username
  $users = $database->select("accounts", 
    [
      "id",
      "user_name",
      "password"
    ],[
      "user_name" => $credentials->user_name
    ]
  );
  // if user was found
  if( count($users) > 0 ){
    $user = $users[0];
    Login( $user, $credentials );
  }else{
    echo json_encode( Array( "error" => "No match for username ".$credentials->user_name ) );
  };
});

// Run app
$app->run();

?>