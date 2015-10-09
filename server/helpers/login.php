<?php
/*
 * Login function
 */

function Login( $user, $credentials ){
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
    $returning = Array(
      "success" => true,
      "token" => $jwt
    );
    echo json_encode($returning);
  }else{
    echo json_encode( Array( "error" => "Wrong password!" ) );
  }
}