<?php
// Helper to mark current nav item active
function isActive(string $file): bool
{
  $path = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
  $current = basename($path ?: 'index.php');
  return strtolower($current) === strtolower($file);
}