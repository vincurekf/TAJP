<?php
// require composer autoload
require 'vendor/autoload.php';
// require needed classes an functions
require 'helpers/jwt.php';
require 'helpers/crypto_rand.php';

// include config
require 'config/config.php';

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
  "path" => ["/api", "/api/user"] ,
  "callback" => function ($options) use ($app) {
    $app->jwt = $options["decoded"];
  }
]));

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
    $db_id = $users[0]["id"];
    $db_name = $users[0]["user_name"];
    $db_password = $users[0]["password"];
    
    // if password matches
    if( $db_password === $credentials->password ){
      // setup token data
      $tokenId    = getToken(64);
      $issuedAt   = time();
      $notBefore  = $issuedAt;   //Adding 10 seconds
      $expire     = $notBefore + 600; // Adding 60 seconds
      $serverName = gethostname(); // $config->get('serverName');
      $secretKey = base64_decode(JWT_SECRET);
      // Create the token as an array
      $data = [
        'iat'  => $issuedAt,          // Issued at: time when the token was generated
        'jti'  => $tokenId,           // Json Token Id: an unique identifier for the token
        'iss'  => $serverName,        // Issuer
        'nbf'  => $notBefore,         // Not before
        'exp'  => $expire,            // Expire
        'data' => [                   // Data related to the signer user
          'userId'   => $db_id,       // userid from the users table
          'userName' => $db_name,     // User name
        ]
      ];
      // encode with JWT
      $jwt = JWT::encode(
        $data,      //Data to be encoded in the JWT
        $secretKey, // The signing key
        'HS512'     // Algorithm used to sign the token, see https://tools.ietf.org/html/draft-ietf-jose-json-web-algorithms-40#section-3
      );
      // return the final array with token
      $returning = Array(
        "success" => true,
        "token" => $jwt
      );
      echo json_encode($returning);
    }else{
      echo json_encode( Array( "error" => "Wrong password!" ) );
    }
  }else{
    echo json_encode( Array( "error" => "No match for username ".$credentials->user_name ) );
  };
});

// Run app
$app->run();

?>