<!-- Header --- dark olive rounded box -->
<div class="bg-[#30442B] text-white rounded-2xl p-8 mb-8 max-w-screen-2xl mx-auto">
  <div class="flex justify-between items-start">
    <div>
      <h1 class="text-3xl md:text-4xl font-extrabold">Welcome, Admin User!</h1>
      <p class="text-sm text-white/80 mt-2">Wednesday, October 15, 2025 — Welcome back to your coffee shop management
        dashboard</p>
    </div>
  </div>
</div>

<!-- Title -->
<div class="mb-6 max-w-screen-2xl mx-auto">
  <h2 class="text-2xl font-bold text-[#30442B]">DASHBOARD</h2>
  <p class="text-sm text-gray-600">Overview of system activity and quick insights</p>
</div>

<!-- Stat cards -->
<div class="max-w-screen-2xl mx-auto">
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
    <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div class="text-sm text-gray-500 uppercase tracking-wide font-medium">Menu Items</div>
      <div class="mt-3 text-3xl font-bold text-[#30442B]">47</div>
      <div class="text-sm text-gray-400 mt-2 flex items-center">
        <span class="text-green-500">↑</span>
        <span class="ml-1">+3 from last month</span>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div class="text-sm text-gray-500 uppercase tracking-wide font-medium">Active Users</div>
      <div class="mt-3 text-3xl font-bold text-[#30442B]">47</div>
      <div class="text-sm text-gray-400 mt-2 flex items-center">
        <span class="text-green-500">↑</span>
        <span class="ml-1">+12% from last month</span>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div class="text-sm text-gray-500 uppercase tracking-wide font-medium">Current Orders</div>
      <div class="mt-3 text-3xl font-bold text-[#30442B]">47</div>
      <div class="text-sm text-gray-400 mt-2 flex items-center">
        <span class="text-green-500">↑</span>
        <span class="ml-1">+3 from last month</span>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div class="text-sm text-gray-500 uppercase tracking-wide font-medium">Unread Messages</div>
      <div class="mt-3 text-3xl font-bold text-[#30442B]">47</div>
      <div class="text-sm text-gray-400 mt-2 flex items-center">
        <span class="text-green-500">↑</span>
        <span class="ml-1">+3 from last month</span>
      </div>
    </div>
  </div>
</div>

<!-- Charts -->
<div class="max-w-screen-2xl mx-auto">
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
    <!-- Sales Overview (line) -->
    <div class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
      <h3 class="text-xl font-semibold text-gray-800 mb-3">Sales Overview</h3>
      <p class="text-sm text-gray-500 mb-6">Daily sales for the past week</p>
      <div class="h-64 bg-gradient-to-b from-white to-gray-50 rounded-lg flex items-end p-4">
        <!-- Placeholder simple line chart using SVG -->
        <svg viewBox="0 0 600 200" class="w-full h-full">
          <polyline fill="none" stroke="#30442B" stroke-width="4"
            points="20,140 100,120 180,130 260,110 340,150 420,120 500,100" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </div>
    </div>

    <!-- Top Selling (bar) -->
    <div class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
      <h3 class="text-xl font-semibold text-gray-800 mb-3">Top Selling</h3>
      <p class="text-sm text-gray-500 mb-6">Latest products trends this week</p>
      <div class="h-64 flex items-end gap-8 px-4">
        <div class="flex-1 h-full flex flex-col justify-end group">
          <div class="mx-auto w-16 bg-[#30442B] rounded-t-lg h-40 transition-all duration-300 group-hover:h-44"></div>
          <div class="text-center text-sm mt-3 font-medium">macchiato</div>
        </div>
        <div class="flex-1 h-full flex flex-col justify-end group">
          <div class="mx-auto w-16 bg-[#4b6a4f] rounded-t-lg h-48 transition-all duration-300 group-hover:h-52"></div>
          <div class="text-center text-sm mt-3 font-medium">latte</div>
        </div>
        <div class="flex-1 h-full flex flex-col justify-end group">
          <div class="mx-auto w-16 bg-[#7ea37b] rounded-t-lg h-32 transition-all duration-300 group-hover:h-36"></div>
          <div class="text-center text-sm mt-3 font-medium">white mocha</div>
        </div>
        <div class="flex-1 h-full flex flex-col justify-end group">
          <div class="mx-auto w-16 bg-[#a9c7a8] rounded-t-lg h-28 transition-all duration-300 group-hover:h-32"></div>
          <div class="text-center text-sm mt-3 font-medium">americano</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Recent Activity -->
<div class="max-w-screen-2xl mx-auto">
  <div class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
    <h3 class="text-xl font-semibold text-gray-800 mb-3">Recent Activity</h3>
    <p class="text-sm text-gray-500 mb-6">Latest system events and updates</p>

    <ul class="space-y-6">
      <li class="border-l-2 border-[#30442B] pl-6 hover:border-l-4 transition-all duration-200">
        <div class="text-sm text-gray-700 font-medium">New order placed</div>
        <div class="text-sm text-gray-500 mt-1">Order #1254 — 2x Latte, 1x Croissant — 2 minutes ago</div>
      </li>
      <li class="border-l-2 border-[#30442B] pl-6 hover:border-l-4 transition-all duration-200">
        <div class="text-sm text-gray-700 font-medium">Product updated</div>
        <div class="text-sm text-gray-500 mt-1">Caramel Macchiato marked as unavailable — 15 minutes ago</div>
      </li>
      <li class="border-l-2 border-[#30442B] pl-6 hover:border-l-4 transition-all duration-200">
        <div class="text-sm text-gray-700 font-medium">Order completed</div>
        <div class="text-sm text-gray-500 mt-1">Order #1239 delivered successfully — 25 minutes ago</div>
      </li>
      <li class="border-l-2 border-[#30442B] pl-6 hover:border-l-4 transition-all duration-200">
        <div class="text-sm text-gray-700 font-medium">Message received</div>
        <div class="text-sm text-gray-500 mt-1">Customer inquiry about delivery times — 2 minutes ago</div>
      </li>
    </ul>
  </div>
</div>