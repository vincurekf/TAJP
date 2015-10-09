<?php
/*
 * Autoloader
 * loads APIs, helpers
 * this simple function requires all APIs in this (/api) directory
 * so you dont have to include every api .php file by hand
 */
// 
$folders = Array('api', 'helpers');

foreach ( $folders as $folder) {
  foreach (glob($folder.'/*.php') as $filename){
	  if ( $filename != "autoload.php") {
    	require_once $filename;
	  }
	}
}