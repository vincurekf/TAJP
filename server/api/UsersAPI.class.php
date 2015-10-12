<?php
/*
 * Users API
 */

Class UsersAPI {
  
  public function __construct(){
    //
  }

  public function get( $database ){
    return $database->select("accounts","*");
  }

  /* 
   * Create new user in the database
   */
  public function post( $database, $data ){
    // check if user exists
    $exists = $database->select("accounts", "*",[ "user_name" => $data->user_name ]);
  	// Insert entry
    if( count($exists) == 0 ){
      // insert new user into database
      $last_user_id = $database->insert('accounts', [
        'user_name' => $data->user_name,
        'user_email' => $data->user_email,
        'password' => base64_encode(hash_hmac('sha256', $data->password, PASS_SALT, true))
      ]);
      return Array( 
        "success" => true,
        "user_id" => $last_user_id
      );
    }else{
      return Array( "error" => "Username ".$data->user_name." is taken." );
    }
  }
}