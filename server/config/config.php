<?php

// Database settings
define("DB_HOST", "localhost");
define("DB_USER", "root");
define("DB_PASS", "passwd");
define("DB_NAME", "test");
// Initialize database connection
$database = new medoo([
  'database_type' => 'mysql',
  'charset' => 'utf8',
  'database_name' => DB_NAME,
  'server' => DB_HOST,
  'username' => DB_USER,
  'password' => DB_PASS
]);

// Password salt
define('PASS_SALT', "z0Q5SrbSOhRU0YvHFE8CRav9I0OIg6TMYt4+jpLwk3w3QqfUMVYQ3C2ntOKV82A6YWo1vrhm3ZcaDzjcVYsBAw==");

// Json Web Tokens
// Secret key, change this to your unique key, do not share or public anywhere
define("JWT_SECRET", "z0Q5SrbSOhRU0YvHFE8CRav9I0OIg6TMYt4+jpLwk3w3QqfUMVYQ3C2ntOKV82A6YWo1vrhm3ZcaDzjcVYsBAw==");
// Expiration of cookies in minutes
define("JWT_EXPIRE", 15);