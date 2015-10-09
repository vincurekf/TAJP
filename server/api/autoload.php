<?php
/*
 * API Autoload
 * this simple function requires all APIs in this (/api) directory
 * so you dont have to include every api .php file by hand
 */
 foreach (scandir(dirname(__FILE__)) as $filename) {
  $path = dirname(__FILE__) . '/' . $filename;
  // chechk if its file and if it's not autoloader.php
  if ( is_file( $path ) && $filename != "autoload.php") {
    require_once( $path );
  }
}