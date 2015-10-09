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

  public function post( $database, $data ){
    // user exists
    $exists = $database->select("accounts", "*",[ "user_name" => $data->user_name ]);
  	// Insert entry
    if( count($exists) == 0 ){
      $last_user_id = $database->insert('accounts', [
        'user_name' => $data->user_name,
        'user_email' => $data->user_email,
        'password' => $data->password
      ]);
      return Array( "success" => true, "user_id" => $last_user_id );
    }else{
      return Array( "error" => "Username ".$data->user_name." is taken." );
    }
  }
}