<?php
// src/includes/admin-auth-guard.php
// Redirect to admin-login if not authenticated
require_once __DIR__ . '/../helpers/admin-auth.php';
if (!is_admin_authenticated()) {
  header('Location: /COFFEE_ST/public/admin/admin-login.php');
  exit;
}
