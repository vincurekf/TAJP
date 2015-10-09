<?php
/*
 * Users API
 */

Class UsersAPI {
  
  public function __construct(){
    //
    echo "sdagvfds";
  }

  public function get( $database ){
    return $database->select("accounts","*");
  }

  public function post( $database, $data ){
  	// Insert entry
    $last_user_id = $database->insert('accounts', [
      'user_name' => $data['user_name'],
      'user_email' => $data['user_email'],
      'password' => $data['password']
    ]);
    return $last_user_id;
  }
}