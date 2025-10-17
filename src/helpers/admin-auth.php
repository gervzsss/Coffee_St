<?php
// src/helpers/admin-auth.php
// Helper functions for single admin authentication

const ADMIN_SESSION_KEY = 'admin_auth';

function admin_login($email, $password)
{
  $admin = require __DIR__ . '/../config/admin.php';
  if ($email === $admin['email'] && password_verify($password, $admin['password_hash'])) {
    if (session_status() !== PHP_SESSION_ACTIVE)
      session_start();
    session_regenerate_id(true);
    $_SESSION[ADMIN_SESSION_KEY] = [
      'email' => $admin['email'],
      'logged_in' => true,
    ];
    return true;
  }
  return false;
}

function admin_logout()
{
  if (session_status() !== PHP_SESSION_ACTIVE)
    session_start();
  unset($_SESSION[ADMIN_SESSION_KEY]);
  session_regenerate_id(true);
}

function is_admin_authenticated()
{
  if (session_status() !== PHP_SESSION_ACTIVE)
    session_start();
  return isset($_SESSION[ADMIN_SESSION_KEY]['logged_in']) && $_SESSION[ADMIN_SESSION_KEY]['logged_in'] === true;
}
