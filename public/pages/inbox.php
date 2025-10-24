<?php
require_once __DIR__ . "/../../src/config/bootstrap.php";
require_once __DIR__ . "/../../src/repositories/repositories.php";
use App\Repositories\InquiryRepository;
use function App\Helpers\current_user;
use function App\Helpers\db;

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

<?php include __DIR__ . "/../../src/includes/head.php"; ?>

<body class="min-h-screen bg-neutral-50 font-poppins text-neutral-900">

  <?php require_once __DIR__ . "/../../src/includes/header.php"; ?>

  <main class="pt-20 md:pt-24">

    <?php include __DIR__ . "/../../src/views/inbox-content.php"; ?>

  </main>

  <?php require_once __DIR__ . "/../../src/includes/footer.php"; ?>

  <?php include __DIR__ . '/../../src/includes/user-scripts.php'; ?>

</body>

</html>