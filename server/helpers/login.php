<?php

/*
 * Login function
 * takes given credentials and runs them agains database
 * returns success+token array or error array with message what went wrong
 */
function Login( $credentials, $database ){
  // select user from table accounts, lines id, user_name and password where user_name == $credentials->user_name;
  $users = $database->select("accounts", [ "id", "user_name", "password" ],[ "user_name" => $credentials->user_name ]);
  // if user was found
  if( count($users) > 0 ){
    $user = $users[0];
    $db_id = $user["id"];
    $db_name = $user["user_name"];
    $db_password = $user["password"];
    // if password matches
    if( $db_password === $credentials->password ){
      // setup token data
      $tokenId    = getToken(64);
      $issuedAt   = time();
      $notBefore  = $issuedAt;   //Adding 10 seconds
      $expire     = $notBefore + (JWT_EXPIRE*60); // Adding 60 seconds
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
      return Array( "success" => true, "token" => $jwt );
    }else{
      return Array( "error" => "Wrong password." );
    }
  }else{
    return Array( "error" => "User ".$credentials->user_name." does not exist." );
  };
}