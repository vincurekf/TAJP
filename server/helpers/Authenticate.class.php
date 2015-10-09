<?php

/*
 * Login class
 * takes given credentials and runs them agains database
 * returns success+token array or error array with message what went wrong
 */

Class Authenticate {
  
  public function __construct(){
    //
  }
  public function login( $credentials, $database ){
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
        $jwt = self::generateToken( $db_id, $db_name );
        $database->update("accounts", [
          "last_login" => date("Y-m-d H:i:s"),
          "last_token" => $jwt
        ], [
          "id" => $db_id
        ]);
        // return the final array with token
        return Array( "success" => true, "token" => $jwt );
      }else{
        return Array( "error" => "Wrong password." );
      }
    }else{
      return Array( "error" => "User ".$credentials->user_name." does not exist." );
    };
  }
  public function generateToken( $user_id, $user_name ){
    // setup token data
    $tokenId    = self::getTokenId(64);
    $issuedAt   = time();
    $notBefore  = $issuedAt;
    $expire     = $notBefore + (JWT_EXPIRE*60);
    $serverName = gethostname();
    $secretKey = base64_decode(JWT_SECRET);
    // Create the token as an array
    $data = [
      'iat'  => $issuedAt,          // Issued at: time when the token was generated
      'jti'  => $tokenId,           // Json Token Id: an unique identifier for the token
      'iss'  => $serverName,        // Issuer
      'nbf'  => $notBefore,         // Not before
      'exp'  => $expire,            // Expire
      'data' => [                   // Data related to the signer user
        'userId'   => $user_id,       // userid from the users table
        'userName' => $user_name,     // User name
      ]
    ];
    // encode with JWT
    $jwt = JWT::encode(
      $data,      //Data to be encoded in the JWT
      $secretKey, // The signing key
      'HS512'     // Algorithm used to sign the token, see https://tools.ietf.org/html/draft-ietf-jose-json-web-algorithms-40#section-3
    );
    return $jwt;
  }
  private function crypto_rand_secure($min, $max){
    $range = $max - $min;
    if ($range < 1) return $min; // not so random...
    $log = ceil(log($range, 2));
    $bytes = (int) ($log / 8) + 1; // length in bytes
    $bits = (int) $log + 1; // length in bits
    $filter = (int) (1 << $bits) - 1; // set all lower bits to 1
    do {
      $rnd = hexdec(bin2hex(openssl_random_pseudo_bytes($bytes)));
      $rnd = $rnd & $filter; // discard irrelevant bits
    } while ($rnd >= $range);
    return $min + $rnd;
  }
  private function getTokenId($length){
    $token = "";
    $codeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    $codeAlphabet.= "abcdefghijklmnopqrstuvwxyz";
    $codeAlphabet.= "0123456789";
    $max = strlen($codeAlphabet) - 1;
    for ($i=0; $i < $length; $i++) {
      $rand = self::crypto_rand_secure(0, $max);
      $token .= $codeAlphabet[$rand];
    }
    return $token;
  }
}