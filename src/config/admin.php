<?php
// src/config/admin.php
// Configuration for the single admin account
return [
  'email' => 'admin@coffeest.com', // Change to your admin email
  'password_hash' => password_hash('admin', PASSWORD_DEFAULT), // Change to your admin password
];
