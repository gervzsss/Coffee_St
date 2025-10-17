<!-- Add Product Modal -->
<div id="addProductModal" class="fixed inset-0 hidden z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <!-- Modal Backdrop -->
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 opacity-0" id="modalBackdrop"></div>
    
    <!-- Modal Content -->
    <div class="fixed inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-[32rem] transform transition-all duration-300 opacity-0 translate-y-4 scale-95" id="modalContent">
            <!-- Modal Header -->
            <div class="relative px-6 pt-6">
                <div class="flex items-center justify-between">
                    <h2 class="text-2xl font-bold text-gray-900">Add New Product</h2>
                    <button class="close-modal absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <p class="mt-1 text-sm text-gray-500">Fill in the details below to add a new product to your catalog.</p>
            </div>

            <!-- Modal Body -->
            <div class="px-6 py-4">
                <form id="addProductForm" class="space-y-6">
                    <!-- Image Upload -->
                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-900">Product Image</label>
                        <div class="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-8">
                            <div class="text-center">
                                <div id="previewContainer" class="mb-3 hidden">
                                    <img id="imagePreview" class="mx-auto h-32 w-32 object-cover rounded-lg shadow-sm"/>
                                </div>
                                <div id="uploadIcon" class="mx-auto flex flex-col items-center">
                                    <svg class="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <div class="mt-4">
                                        <input type="file" id="productImage" class="hidden" accept="image/*">
                                        <label for="productImage" class="cursor-pointer text-sm text-[#30442B] hover:text-[#22301e]">
                                            Upload a file
                                        </label>
                                        <p class="text-xs text-gray-500 mt-1">or drag and drop</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Product Name -->
                    <div class="space-y-2">
                        <label for="productName" class="block text-sm font-medium text-gray-900">Product Name</label>
                        <input type="text" id="productName" name="productName" 
                               class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#30442B] sm:text-sm"
                               required>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <!-- Price -->
                        <div class="space-y-2">
                            <label for="productPrice" class="block text-sm font-medium text-gray-900">Price ($)</label>
                            <input type="number" id="productPrice" name="productPrice" step="0.01" min="0"
                                   class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#30442B] sm:text-sm"
                                   required>
                        </div>

                        <!-- Category -->
                        <div class="space-y-2">
                            <label for="productCategory" class="block text-sm font-medium text-gray-900">Category</label>
                            <select id="productCategory" name="productCategory"
                                    class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#30442B] sm:text-sm"
                                    required>
                                <option value="">Select category</option>
                                <option value="coffee">Coffee</option>
                                <option value="tea">Tea</option>
                                <option value="pastries">Pastries</option>
                            </select>
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="space-y-2">
                        <label for="productDescription" class="block text-sm font-medium text-gray-900">Description</label>
                        <textarea id="productDescription" name="productDescription" rows="3"
                                  class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#30442B] sm:text-sm"
                                  required></textarea>
                    </div>
                </form>
            </div>

            <!-- Modal Footer -->
            <div class="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
                <button type="button" class="close-modal px-4 py-2 rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#30442B] transition-colors duration-200">
                    Cancel
                </button>
                <button type="submit" form="addProductForm" class="px-4 py-2 rounded-lg bg-[#30442B] text-white hover:bg-[#22301e] focus:outline-none focus:ring-2 focus:ring-[#30442B] focus:ring-offset-2 transition-colors duration-200 flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                    Add Product
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Edit Product Modal -->
<div id="editProductModal" class="fixed inset-0 hidden z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 opacity-0" id="editModalBackdrop"></div>
    <div class="fixed inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-[32rem] transform transition-all duration-300 opacity-0 translate-y-4 scale-95" id="editModalContent">
            <div class="relative px-6 pt-6">
                <div class="flex items-center justify-between">
                    <h2 class="text-xl font-semibold text-gray-900">Edit Product</h2>
                    <button type="button" class="close-edit-modal text-gray-400 hover:text-gray-500">
                        <span class="sr-only">Close</span>
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <p class="mt-1 text-sm text-gray-500">Update product details and image</p>
            </div>

            <div class="px-6 py-4">
                <form id="editProductForm" class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                        <div class="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg">
                            <div class="space-y-1 text-center">
                                <img id="editImagePreview" src="" alt="Product" class="mx-auto h-32 w-32 object-cover rounded-lg mb-4">
                                <div class="flex text-sm text-gray-600">
                                    <label class="relative cursor-pointer bg-white rounded-md font-medium text-[#30442B] hover:text-[#22301e] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#30442B]">
                                        <span>Upload Image</span>
                                        <input type="file" class="sr-only" id="editProductImage" accept="image/*">
                                    </label>
                                </div>
                                <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input type="text" id="editProductName" class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#30442B] focus:ring-[#30442B]">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                            <input type="number" step="0.01" id="editProductPrice" class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#30442B] focus:ring-[#30442B]">
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select id="editProductCategory" class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#30442B] focus:ring-[#30442B]">
                            <option value="coffee">Coffee</option>
                            <option value="tea">Tea</option>
                            <option value="pastries">Pastries</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea id="editProductDescription" rows="3" class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#30442B] focus:ring-[#30442B]"></textarea>
                    </div>
                </form>
            </div>

            <div class="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
                <button type="button" class="close-edit-modal px-4 py-2 rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#30442B] transition-colors duration-200">
                    Cancel
                </button>
                <button type="submit" form="editProductForm" class="px-4 py-2 rounded-lg bg-[#30442B] text-white hover:bg-[#22301e] focus:outline-none focus:ring-2 focus:ring-[#30442B] focus:ring-offset-2 transition-colors duration-200">
                    Save Changes
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Mark as Unavailable Modal -->
<div id="unavailableModal" class="fixed inset-0 hidden z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 opacity-0" id="unavailableModalBackdrop"></div>
    <div class="fixed inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-[32rem] transform transition-all duration-300 opacity-0 translate-y-4 scale-95" id="unavailableModalContent">
            <div class="relative px-6 pt-6">
                <div class="flex items-center justify-between">
                    <h2 class="text-xl font-semibold text-gray-900">Mark as Unavailable</h2>
                    <button type="button" class="close-unavailable-modal text-gray-400 hover:text-gray-500">
                        <span class="sr-only">Close</span>
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <p class="mt-1 text-sm text-gray-500">Please provide a reason why this item is unavailable</p>
            </div>

            <div class="px-6 py-4">
                <form id="unavailableForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                        <input type="text" id="unavailableReason" placeholder="e.g., Out of ingredients, Seasonal item, Equipment maintenance..." class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#30442B] focus:ring-[#30442B]">
                    </div>
                </form>
            </div>

            <div class="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
                <button type="button" class="close-unavailable-modal px-4 py-2 rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#30442B] transition-colors duration-200">
                    Cancel
                </button>
                <button type="submit" form="unavailableForm" class="px-4 py-2 rounded-lg bg-[#30442B] text-white hover:bg-[#22301e] focus:outline-none focus:ring-2 focus:ring-[#30442B] focus:ring-offset-2 transition-colors duration-200">
                    Confirm
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Product History Modal -->
<div id="historyModal" class="fixed inset-0 hidden z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 opacity-0" id="historyModalBackdrop"></div>
    <div class="fixed inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-[32rem] transform transition-all duration-300 opacity-0 translate-y-4 scale-95" id="historyModalContent">
            <div class="relative px-6 pt-6">
                <div class="flex items-center justify-between">
                    <h2 class="text-xl font-semibold text-gray-900">Product History</h2>
                    <button type="button" class="close-history-modal text-gray-400 hover:text-gray-500">
                        <span class="sr-only">Close</span>
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <p class="mt-1 text-sm text-gray-500">Complete history and statistics for <span id="historyProductName" class="font-medium"></span></p>
            </div>

            <div class="px-6 py-4">
                <div class="space-y-6">
                    <!-- Product Summary -->
                    <div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <img id="historyProductImage" src="" alt="Product" class="h-16 w-16 object-cover rounded-lg">
                        <div>
                            <div class="flex items-center space-x-2">
                                <h3 id="historyProductTitle" class="text-lg font-medium"></h3>
                                <span class="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-800 rounded-full" id="historyProductCategory"></span>
                                <span class="text-gray-600" id="historyProductPrice"></span>
                            </div>
                            <p class="text-sm text-gray-500" id="historyProductDescription"></p>
                        </div>
                    </div>

                    <!-- Creation Information -->
                    <div>
                        <h4 class="text-sm font-medium text-gray-900 mb-3">Creation Information</h4>
                        <div class="bg-gray-50 rounded-lg p-4 space-y-2">
                            <div class="flex justify-between">
                                <span class="text-sm text-gray-500">Created By:</span>
                                <span class="text-sm text-gray-900" id="historyCreatedBy"></span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-sm text-gray-500">Created On:</span>
                                <span class="text-sm text-gray-900" id="historyCreatedOn"></span>
                            </div>
                        </div>
                    </div>

                    <!-- Sales Performance -->
                    <div>
                        <h4 class="text-sm font-medium text-gray-900 mb-3">Sales Performance</h4>
                        <div class="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
                            <div>
                                <span class="text-sm text-gray-500 block">Total Revenue</span>
                                <span class="text-2xl font-bold text-[#30442B]" id="historyTotalRevenue"></span>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500 block">Units Sold</span>
                                <span class="text-2xl font-bold text-[#30442B]" id="historyUnitsSold"></span>
                            </div>
                        </div>
                    </div>

                    <!-- Edit History -->
                    <div>
                        <h4 class="text-sm font-medium text-gray-900 mb-3">Edit History</h4>
                        <div class="space-y-3" id="historyEditList"></div>
                    </div>
                </div>
            </div>

            <div class="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end">
                <button type="button" class="close-history-modal px-4 py-2 rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#30442B] transition-colors duration-200">
                    Close
                </button>
            </div>
        </div>
    </div>
</div>
