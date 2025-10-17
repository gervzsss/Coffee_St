<!-- Header -->
<div class="admin-header bg-[#30442B] text-white rounded-2xl p-8 mb-8 transition-all duration-300 ease-in-out lg:mr-4">
    <h1 class="text-3xl md:text-4xl font-extrabold">Catalog Management</h1>
    <p class="text-sm text-white/80 mt-2">Manage your products and categories</p>
</div>

<!-- Metric Cards -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <!-- Active Products Card -->
    <div class="content-card bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
        <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Products</h3>
        <div class="mt-4 flex items-baseline gap-2">
            <span class="text-4xl font-bold text-[#30442B]">47</span>
            <span class="text-sm font-medium text-green-600">+3 new</span>
        </div>
    </div>

    <!-- Archived Products -->
    <div class="content-card bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
        <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Archived Products</h3>
        <div class="mt-4 flex items-baseline gap-2">
            <span class="text-4xl font-bold text-[#30442B]">4</span>
        </div>
    </div>

    <!-- Available Products -->
    <div class="content-card bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
        <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Available</h3>
        <div class="mt-4 flex items-baseline gap-2">
            <span class="text-4xl font-bold text-[#30442B]">36</span>
            <span class="text-sm font-medium text-green-600">In Stock</span>
        </div>
    </div>

    <!-- Not Available Products -->
    <div class="content-card bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
        <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Not Available</h3>
        <div class="mt-4 flex items-baseline gap-2">
            <span class="text-4xl font-bold text-[#30442B]">2</span>
            <span class="text-sm font-medium text-red-600">Out of Stock</span>
        </div>
    </div>
</div>

<!-- Action Bar -->
<div class="content-card bg-[#30442B] rounded-xl shadow-lg p-6 mb-8 transition-all duration-300">
    <div class="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div class="w-full sm:w-auto">
            <div class="relative">
                <input type="text" 
                       placeholder="Search Products........" 
                       class="w-full sm:w-96 pl-4 pr-10 py-3 rounded-lg border border-[#415536] bg-white focus:border-[#415536] focus:ring-1 focus:ring-[#415536] placeholder-gray-400 text-gray-800 text-sm transition-all duration-300"
                />
                <svg class="w-5 h-5 text-gray-400 absolute right-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
            </div>
        </div>
        <div class="flex gap-4 w-full sm:w-auto">
            <div class="relative w-full sm:w-48">
                <select class="w-full appearance-none pl-4 pr-10 py-3 rounded-lg border border-[#415536] bg-white focus:border-[#415536] focus:ring-1 focus:ring-[#415536] text-gray-800 text-sm transition-all duration-300">
                    <option value="">CATEGORIES</option>
                    <option value="coffee">Coffee</option>
                    <option value="tea">Tea</option>
                    <option value="pastries">Pastries</option>
                </select>
                <svg class="w-5 h-5 text-gray-400 absolute right-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
            </div>
            <div class="relative w-full sm:w-48">
                <select class="w-full appearance-none pl-4 pr-10 py-3 rounded-lg border border-[#415536] bg-white focus:border-[#415536] focus:ring-1 focus:ring-[#415536] text-gray-800 text-sm transition-all duration-300">
                    <option value="">AVAILABILITY</option>
                    <option value="available">Available</option>
                    <option value="not-available">Not Available</option>
                </select>
                <svg class="w-5 h-5 text-gray-400 absolute right-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
            </div>
        </div>
    </div>
</div>

<!-- Products Table -->
<div class="content-card bg-white rounded-xl shadow-lg p-6 transition-all duration-300">
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-gray-800">Active Products (All)</h2>
        <div class="flex gap-3">
            <button class="open-modal px-6 py-2.5 bg-[#30442B] text-white rounded-lg hover:bg-[#22301e] transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                <span>Add Products</span>
            </button>
            <button class="px-6 py-2.5 bg-[#30442B] text-white rounded-lg hover:bg-[#22301e] transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                </svg>
                <span>Archive</span>
            </button>
        </div>
    </div>

    <div class="overflow-x-auto">
        <table class="min-w-full">
            <thead>
                <tr class="border-b border-gray-200">
                    <th class="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th class="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th class="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th class="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th class="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th class="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="py-4 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                    <th class="py-4 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Archived</th>
                    <th class="py-4 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
                <!-- Sample Product Row -->
                <tr class="hover:bg-gray-50 transition-colors duration-200">
                    <td class="py-4 px-4">
                        <div class="h-12 w-12 rounded-lg bg-gray-200"></div>
                    </td>
                    <td class="py-4 px-4 font-medium">Espresso</td>
                    <td class="py-4 px-4 text-gray-600">Coffee</td>
                    <td class="py-4 px-4 font-medium">$3.50</td>
                    <td class="py-4 px-4 text-gray-600">Rich and bold single shot</td>
                    <td class="py-4 px-4">
                        <span class="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">Available</span>
                    </td>
                    <td class="py-4 px-4">
                        <div class="flex justify-center">
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" value="" class="sr-only peer" checked>
                                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#30442B] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#30442B]"></div>
                            </label>
                        </div>
                    </td>
                    <td class="py-4 px-4">
                        <div class="flex justify-center">
                            <span class="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800">No</span>
                        </div>
                    </td>
                    <td class="py-4 px-4">
                        <div class="flex justify-center gap-2">
                            <button class="view-history p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200" title="History" data-id="1">
                                <svg class="w-5 h-5 text-[#30442B] hover:text-[#967259]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </button>
                            <button class="edit-product p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200" title="Edit" data-id="1">
                                <svg class="w-5 h-5 text-[#30442B] hover:text-[#967259]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                                </svg>
                            </button>
                            <button class="mark-unavailable p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200" title="Mark as Unavailable" data-id="1">
                                <svg class="w-5 h-5 text-[#30442B] hover:text-[#967259]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
                <!-- Add more product rows here -->
            </tbody>
        </table>
    </div>
</div>