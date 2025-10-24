<?php
require_once __DIR__ . "/../../src/config/bootstrap.php";
use function App\Helpers\current_user;
$title = "Contact - Coffee St.";
$year = date("Y");
$prefilledSubject = "";
$subjectLocked = false;

if (isset($_GET["subject"])) {
  $subjectParam = trim((string) $_GET["subject"]);
  if ($subjectParam !== "") {
    $current = current_user();
    if ($current && isset($current["id"])) {
      $prefilledSubject = $subjectParam;
      $subjectLocked = true;
    }
  }
}
?>

<?php include __DIR__ . "/../../src/includes/head.php"; ?>

<body class="min-h-screen bg-neutral-50 font-poppins text-neutral-900">

  <?php require_once __DIR__ . "/../../src/includes/header.php"; ?>

  <main class="flex flex-col pt-20 md:pt-24">

    <?php include __DIR__ . "/../../src/views/contact-sections.php"; ?>

  </main>

  <?php require_once __DIR__ . "/../../src/includes/footer.php"; ?>

  <?php include __DIR__ . "/../../src/components/modals/auth-modals.php"; ?>

  <?php include __DIR__ . '/../../src/includes/user-scripts.php'; ?>

  <script src="/COFFEE_ST/src/resources/js/contact-form.js" defer></script>

</body>

</html>