<?php
$currentFile = basename($_SERVER["PHP_SELF"] ?? "");
function nav_active($file, $current)
{
	return $current === $file ? "bg-white/10 text-white font-semibold" : "";
}
?>

<nav
	class="admin-sidebar fixed top-0 left-0 h-screen z-30 flex flex-col bg-[#30442B] text-white shadow-lg transition-all duration-300 ease-in-out w-64">
	<!-- Toggle Button -->
	<button
		class="sidebar-toggle absolute -right-4 top-6 w-8 h-8 flex items-center justify-center bg-[#30442B] border-2 border-white/10 rounded-full shadow transition-all duration-300 focus:outline-none hover:bg-[#3a543a]">
		<svg class="h-6 w-6 open-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
		</svg>
		<svg class="h-6 w-6 close-icon hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
		</svg>
	</button>

	<!-- Admin User Info -->
	<div class="flex items-center gap-3 px-6 py-8 border-b border-white/10">
		<div class="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24"
				stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
					d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
			</svg>
		</div>
		<div class="flex flex-col sidebar-content">
			<span class="font-semibold text-sm tracking-wide">ADMIN</span>
			<span class="text-xs text-white/70">admin@jhjh</span>
		</div>
	</div>

	<!-- Navigation Links -->
	<ul class="flex-1 flex flex-col gap-1 mt-6 px-2">
		<li>
			<a href="admin-dashboard.php" class="flex items-center gap-4 px-5 py-3 rounded-lg transition-all duration-200 hover:bg-white/10 group <?php echo nav_active(
				"admin-dashboard.php",
				$currentFile,
			); ?>">
				<svg class="h-6 w-6 text-white/80" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 8h14v-2H7v2zm0-4h14v-2H7v2zm0-6v2h14V7H7z" />
				</svg>
				<span class="font-medium tracking-wide sidebar-content">Dashboard</span>
			</a>
		</li>
		<li>
			<a href="admin-catalog.php" class="flex items-center gap-4 px-5 py-3 rounded-lg transition-all duration-200 hover:bg-white/10 group <?php echo nav_active(
				"admin-catalog.php",
				$currentFile,
			); ?>" :class="open ? '' : 'justify-center px-0'">
				<svg class="h-6 w-6 text-white/80" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path d="M3 7h18M3 12h18M3 17h18" />
				</svg>
				<span x-show="open" class="font-medium tracking-wide">Catalog</span>
			</a>
		</li>
		<li>
			<a href="admin-orders.php" class="flex items-center gap-4 px-5 py-3 rounded-lg transition-all duration-200 hover:bg-white/10 group <?php echo nav_active(
				"admin-orders.php",
				$currentFile,
			); ?>" :class="open ? '' : 'justify-center px-0'">
				<svg class="h-6 w-6 text-white/80" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path d="M9 17v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
					<circle cx="9" cy="7" r="4" />
				</svg>
				<span x-show="open" class="font-medium tracking-wide">Orders</span>
			</a>
		</li>
		<li>
			<a href="admin-accounts.php" class="flex items-center gap-4 px-5 py-3 rounded-lg transition-all duration-200 hover:bg-white/10 group <?php echo nav_active(
				"admin-accounts.php",
				$currentFile,
			); ?>" :class="open ? '' : 'justify-center px-0'">
				<svg class="h-6 w-6 text-white/80" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path d="M16 11V7a4 4 0 00-8 0v4M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z" />
				</svg>
				<span x-show="open" class="font-medium tracking-wide">Accounts</span>
			</a>
		</li>
		<li>
			<a href="admin-analytics.php" class="flex items-center gap-4 px-5 py-3 rounded-lg transition-all duration-200 hover:bg-white/10 group <?php echo nav_active(
				"admin-analytics.php",
				$currentFile,
			); ?>" :class="open ? '' : 'justify-center px-0'">
				<svg class="h-6 w-6 text-white/80" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path d="M11 17a2 2 0 104 0 2 2 0 00-4 0zm-7-2a7 7 0 0114 0v4H4v-4z" />
				</svg>
				<span x-show="open" class="font-medium tracking-wide">Analytics</span>
			</a>
		</li>
		<li>
			<a href="admin-settings.php" class="flex items-center gap-4 px-5 py-3 rounded-lg transition-all duration-200 group <?php echo nav_active(
				"admin-settings.php",
				$currentFile,
			) ?:
				"text-white/90"; ?>" :class="open ? (<?php echo "'bg-[#30442B] text-white'"; ?>) : 'justify-center px-0'">
				<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path d="M12 4v16m8-8H4" />
				</svg>
				<span x-show="open" class="font-medium tracking-wide">Settings</span>
			</a>
		</li>
		<li class="mt-auto mb-4">
			<a href="admin-logout.php" class="flex items-center gap-4 px-5 py-3 rounded-lg transition-all duration-200 hover:bg-white/10 group <?php echo nav_active(
				"admin-logout.php",
				$currentFile,
			); ?>" :class="open ? '' : 'justify-center px-0'">
				<svg class="h-6 w-6 text-white/80" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path d="M17 16l4-4m0 0l-4-4m4 4H7" />
				</svg>
				<span x-show="open" class="font-medium tracking-wide">Logout</span>
			</a>
		</li>
	</ul>
</nav>

<?php include_once __DIR__ . '/admin-scripts.php'; ?>