<!-- Add Product Modal -->
<div id="addProductModal" class="fixed inset-0 z-50 hidden overflow-y-auto" aria-labelledby="modal-title" role="dialog"
  aria-modal="true">
  <!-- Modal Backdrop -->
  <div class="fixed inset-0 bg-black/50 opacity-0 backdrop-blur-sm transition-opacity duration-300" id="modalBackdrop">
  </div>

  <!-- Modal Content Wrapper (captures outside clicks) -->
  <div id="addModalWrapper" class="fixed inset-0 flex items-center justify-center p-4">
    <div
      class="w-full max-w-[32rem] translate-y-4 scale-95 transform rounded-2xl bg-white opacity-0 shadow-2xl transition-all duration-300"
      id="modalContent">
      <!-- Modal Header -->
      <div class="relative px-6 pt-6">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">Add New Product</h2>
          <button type="button"
            class="cursor-pointer close-modal absolute top-4 right-4 rounded-full p-2 text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-600">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p class="mt-1 text-sm text-gray-500">
          Fill in the details below to add a new product to your catalog.
        </p>
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
                  <img id="imagePreview" class="mx-auto h-32 w-32 rounded-lg object-cover shadow-sm" />
                </div>
                <div id="uploadIcon" class="mx-auto flex flex-col items-center">
                  <svg class="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <div class="mt-4">
                    <input type="file" id="productImage" class="hidden" accept="image/*" />
                    <label for="productImage" class="cursor-pointer text-sm text-[#30442B] hover:text-[#22301e]">
                      Upload a file
                    </label>
                    <p class="mt-1 text-xs text-gray-500">or drag and drop</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Product Name -->
          <div class="space-y-2">
            <label for="productName" class="block text-sm font-medium text-gray-900">Product Name</label>
            <input type="text" id="productName" name="productName"
              class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-[#30442B] focus:ring-inset sm:text-sm"
              required />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Price -->
            <div class="space-y-2">
              <label for="productPrice" class="block text-sm font-medium text-gray-900">Price (₱)</label>
              <input type="number" id="productPrice" name="productPrice" step="0.01" min="0"
                class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-[#30442B] focus:ring-inset sm:text-sm"
                required />
            </div>

            <!-- Category -->
            <div class="space-y-2">
              <label for="productCategory" class="block text-sm font-medium text-gray-900">Category</label>
              <select id="productCategory" name="productCategory"
                class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-[#30442B] focus:ring-inset sm:text-sm"
                required>
                <option value="">Select category</option>
                <option value="hot-coffee">Hot Coffee</option>
                <option value="iced-coffee">Iced Coffee</option>
                <option value="frappe">Frappe</option>
                <option value="non-coffee">Non-Coffee</option>
                <option value="pastries">Pastries</option>
                <option value="cakes">Cakes</option>
                <option value="buns">Buns</option>
              </select>
            </div>
          </div>

          <!-- Description -->
          <div class="space-y-2">
            <label for="productDescription" class="block text-sm font-medium text-gray-900">Description</label>
            <textarea id="productDescription" name="productDescription" rows="3"
              class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-[#30442B] focus:ring-inset sm:text-sm"
              required></textarea>
          </div>
        </form>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end gap-3 rounded-b-2xl bg-gray-50 px-6 py-4">
        <button type="button"
          class="cursor-pointer close-modal rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-[#30442B] focus:outline-none">
          Cancel
        </button>
        <button type="submit" form="addProductForm" id="add-product-btn"
          class="cursor-pointer flex items-center gap-2 rounded-lg bg-[#30442B] px-4 py-2 text-white transition-colors duration-200 hover:bg-[#22301e] focus:ring-2 focus:ring-[#30442B] focus:ring-offset-2 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Product
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Add Product Processing Overlay -->
<div id="add-product-spinner" class="hidden fixed inset-0 z-[60] bg-black/40 items-center justify-center">
  <div class="flex flex-col items-center gap-3">
    <div class="h-12 w-12 rounded-full border-4 border-gray-200 border-t-[#30442B] animate-spin"></div>
    <p class="text-white text-sm">Adding product…</p>
  </div>
  <span class="sr-only">Product is being added</span>
  <div aria-live="polite" class="sr-only">Loading</div>
</div>

<!-- Edit Product Modal -->
<div id="editProductModal" class="fixed inset-0 z-50 hidden overflow-y-auto" aria-labelledby="modal-title" role="dialog"
  aria-modal="true">
  <div class="fixed inset-0 bg-black/50 opacity-0 backdrop-blur-sm transition-opacity duration-300"
    id="editModalBackdrop"></div>
  <div id="editModalWrapper" class="fixed inset-0 flex items-center justify-center p-4">
    <div
      class="w-full max-w-[32rem] translate-y-4 scale-95 transform rounded-2xl bg-white opacity-0 shadow-2xl transition-all duration-300"
      id="editModalContent">
      <div class="relative px-6 pt-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Edit Product</h2>
          <button type="button" class="cursor-pointer close-edit-modal text-gray-400 hover:text-gray-500">
            <span class="sr-only">Close</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p class="mt-1 text-sm text-gray-500">
          Update product details and image
        </p>
      </div>

      <div class="px-6 py-4">
        <form id="editProductForm" class="space-y-6">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">Product Image</label>
            <div class="flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
              <div class="space-y-1 text-center">
                <img id="editImagePreview" src="" alt="Product"
                  class="mx-auto mb-4 h-32 w-32 rounded-lg object-cover" />
                <div class="flex text-sm text-gray-600">
                  <label
                    class="relative cursor-pointer rounded-md bg-white font-medium text-[#30442B] focus-within:ring-2 focus-within:ring-[#30442B] focus-within:ring-offset-2 focus-within:outline-none hover:text-[#22301e]">
                    <span>Upload Image</span>
                    <input type="file" class="sr-only" id="editProductImage" accept="image/*" />
                  </label>
                </div>
                <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Product Name</label>
              <input type="text" id="editProductName"
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#30442B] focus:ring-[#30442B]" />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Price (₱)</label>
              <input type="number" step="0.01" id="editProductPrice"
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#30442B] focus:ring-[#30442B]" />
            </div>
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">Category</label>
            <select id="editProductCategory"
              class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#30442B] focus:ring-[#30442B]">
              <option value="hot-coffee">Hot Coffee</option>
              <option value="iced-coffee">Iced Coffee</option>
              <option value="frappe">Frappe</option>
              <option value="non-coffee">Non-Coffee</option>
              <option value="pastries">Pastries</option>
              <option value="cakes">Cakes</option>
              <option value="buns">Buns</option>
            </select>
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea id="editProductDescription" rows="3"
              class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#30442B] focus:ring-[#30442B]"></textarea>
          </div>
        </form>
      </div>

      <div class="flex justify-end gap-3 rounded-b-2xl bg-gray-50 px-6 py-4">
        <button type="button"
          class="cursor-pointer close-edit-modal rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-[#30442B] focus:outline-none">
          Cancel
        </button>
        <button type="submit" form="editProductForm"
          class="cursor-pointer rounded-lg bg-[#30442B] px-4 py-2 text-white transition-colors duration-200 hover:bg-[#22301e] focus:ring-2 focus:ring-[#30442B] focus:ring-offset-2 focus:outline-none">
          Save Changes
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Mark as Unavailable Modal -->
<div id="unavailableModal" class="fixed inset-0 z-50 hidden overflow-y-auto" aria-labelledby="modal-title" role="dialog"
  aria-modal="true">
  <div class="fixed inset-0 bg-black/50 opacity-0 backdrop-blur-sm transition-opacity duration-300"
    id="unavailableModalBackdrop"></div>
  <div id="unavailableModalWrapper" class="fixed inset-0 flex items-center justify-center p-4">
    <div
      class="w-full max-w-[32rem] translate-y-4 scale-95 transform rounded-2xl bg-white opacity-0 shadow-2xl transition-all duration-300"
      id="unavailableModalContent">
      <div class="relative px-6 pt-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">
            Mark as Unavailable
          </h2>
          <button type="button" class="cursor-pointer close-unavailable-modal text-gray-400 hover:text-gray-500">
            <span class="sr-only">Close</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p class="mt-1 text-sm text-gray-500">
          Please provide a reason why this item is unavailable
        </p>
      </div>

      <div class="px-6 py-4">
        <form id="unavailableForm" class="space-y-4">
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">Reason</label>
            <input type="text" id="unavailableReason"
              placeholder="e.g., Out of ingredients, Seasonal item, Equipment maintenance..."
              class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#30442B] focus:ring-[#30442B]" />
          </div>
        </form>
      </div>

      <div class="flex justify-end gap-3 rounded-b-2xl bg-gray-50 px-6 py-4">
        <button type="button"
          class="close-unavailable-modal cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-[#30442B] focus:outline-none">
          Cancel
        </button>
        <button type="submit" form="unavailableForm"
          class="cursor-pointer rounded-lg bg-[#30442B] px-4 py-2 text-white transition-colors duration-200 hover:bg-[#22301e] focus:ring-2 focus:ring-[#30442B] focus:ring-offset-2 focus:outline-none">
          Confirm
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Product History Modal -->
<div id="historyModal" class="fixed inset-0 z-50 hidden overflow-y-auto" aria-labelledby="modal-title" role="dialog"
  aria-modal="true">
  <div class="fixed inset-0 bg-black/50 opacity-0 backdrop-blur-sm transition-opacity duration-300"
    id="historyModalBackdrop"></div>
  <div id="historyModalWrapper" class="fixed inset-0 flex items-center justify-center p-4">
    <div
      class="w-full max-w-[32rem] translate-y-4 scale-95 transform rounded-2xl bg-white opacity-0 shadow-2xl transition-all duration-300"
      id="historyModalContent">
      <div class="relative px-6 pt-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Product History</h2>
          <button type="button" class="cursor-pointer close-history-modal text-gray-400 hover:text-gray-500">
            <span class="sr-only">Close</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p class="mt-1 text-sm text-gray-500">
          Complete history and statistics for
          <span id="historyProductName" class="font-medium"></span>
        </p>
      </div>

      <div class="px-6 py-4">
        <div class="space-y-6">
          <!-- Product Summary -->
          <div class="flex items-center space-x-4 rounded-lg bg-gray-50 p-4">
            <img id="historyProductImage" src="" alt="Product" class="h-16 w-16 rounded-lg object-cover" />
            <div>
              <div class="flex items-center space-x-2">
                <h3 id="historyProductTitle" class="text-lg font-medium"></h3>
                <span class="rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-800"
                  id="historyProductCategory"></span>
                <span class="text-gray-600" id="historyProductPrice"></span>
              </div>
              <p class="text-sm text-gray-500" id="historyProductDescription"></p>
            </div>
          </div>

          <!-- Creation Information -->
          <div>
            <h4 class="mb-3 text-sm font-medium text-gray-900">
              Creation Information
            </h4>
            <div class="space-y-2 rounded-lg bg-gray-50 p-4">
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
            <h4 class="mb-3 text-sm font-medium text-gray-900">
              Sales Performance
            </h4>
            <div class="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
              <div>
                <span class="block text-sm text-gray-500">Total Revenue</span>
                <span class="text-2xl font-bold text-[#30442B]" id="historyTotalRevenue"></span>
              </div>
              <div>
                <span class="block text-sm text-gray-500">Units Sold</span>
                <span class="text-2xl font-bold text-[#30442B]" id="historyUnitsSold"></span>
              </div>
            </div>
          </div>

          <!-- Edit History -->
          <div>
            <h4 class="mb-3 text-sm font-medium text-gray-900">Edit History</h4>
            <div class="space-y-3" id="historyEditList"></div>
          </div>
        </div>
      </div>

      <div class="flex justify-end rounded-b-2xl bg-gray-50 px-6 py-4">
        <button type="button"
          class="close-history-modal cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-[#30442B] focus:outline-none">
          Close
        </button>
      </div>
    </div>
  </div>
</div>