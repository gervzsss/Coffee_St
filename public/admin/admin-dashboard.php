<?php require_once __DIR__ . '/../../src/includes/admin-auth-guard.php'; ?>

<!doctype html>
<html lang="en">

<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>Coffee St. — Dashboard</title>
	<link rel="stylesheet" href="/COFFEE_ST/dist/styles.css" />
</head>

<body class="antialiased bg-gray-50 text-slate-800">

	<?php include_once __DIR__ . "/../../src/includes/admin-navbar.php"; ?>

	<div class="main-content min-h-screen p-6 ml-64 transition-all duration-300 ease-in-out">

		<?php include_once __DIR__ . "/../../src/views/admin/admin-dashboard-info.php"; ?>

	</div>

</body>

</html>