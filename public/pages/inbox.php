<?php
// public/pages/inbox.php

require_once __DIR__ . "/../../src/config/bootstrap.php";
require_once __DIR__ . "/../../src/repositories/repositories.php";
use App\Repositories\InquiryRepository;
use function App\Helpers\current_user;
use function App\Helpers\db;

// Require authentication; current_user() is imported from App\Helpers
$user = current_user();
if (!$user || !isset($user['id'])) {
  header('Location: /COFFEE_ST/public/index.php');
  exit();
}

$repo = new InquiryRepository(db());
$email = isset($user['email']) ? (string) $user['email'] : '';
if ($email !== '') {
  $threads = $repo->getThreadsForUserOrEmail((int) $user['id'], $email);
} else {
  $threads = $repo->getThreadsForUser((int) $user['id']);
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inbox — Coffee St.</title>
  <link rel="stylesheet" href="/COFFEE_ST/dist/styles.css">
</head>

<body class="min-h-screen bg-neutral-50 font-poppins text-neutral-900">
  <?php require_once __DIR__ . "/../../src/includes/header.php"; ?>
  <?php include __DIR__ . "/../../src/views/inbox-content.php"; ?>
  <?php require_once __DIR__ . "/../../src/includes/footer.php"; ?>

  <script src="https://code.jquery.com/jquery-3.7.1.min.js"
    integrity="sha256-IZyGUneEXE1GB6LhCE2Pv9umTASEwAF/5HlhLSP7Klw=" crossorigin="anonymous"></script>
  <script src="/COFFEE_ST/src/resources/js/login-validation.js"></script>
</body>

</html>