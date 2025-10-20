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
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?php echo htmlspecialchars($title); ?></title>
  <link rel="stylesheet" href="/COFFEE_ST/dist/styles.css">
</head>

<body class="min-h-screen bg-neutral-50 font-poppins text-neutral-900">
  <?php require_once __DIR__ . "/../../src/includes/header.php"; ?>

  <main class="flex flex-col pt-20 md:pt-24">

    <?php include __DIR__ . "/../../src/views/contact-sections.php"; ?>

  </main>

  <?php require_once __DIR__ . "/../../src/includes/footer.php"; ?>

  <?php include __DIR__ . "/../../src/components/modals/auth-modals.php"; ?>

  <script src="https://code.jquery.com/jquery-3.7.1.min.js"
    integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
  <script src="/COFFEE_ST/src/resources/js/app.js"></script>
  <script src="/COFFEE_ST/src/resources/js/contact-form.js"></script>
  <script src="/COFFEE_ST/src/resources/js/login-validation.js"></script>
</body>

</html>