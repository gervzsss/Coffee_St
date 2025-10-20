<?php
// Always include the admin-auth-guard first.
// This loads environment, config, session, and helper functions.
// Do not include bootstrap.php directly.
require_once __DIR__ . '/../../src/includes/admin-auth-guard.php';
// Admin catalog management page
?>
<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Catalog Management — Coffee St.</title>
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"
    integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="/COFFEE_ST/dist/styles.css" />
</head>

<body class="antialiased bg-gray-50 text-slate-800">
  <?php include_once __DIR__ . "/../../src/includes/admin-navbar.php"; ?>

  <!-- Main Content Section -->
  <div class="main-content min-h-screen p-6 ml-64 transition-all duration-300 ease-in-out">
    <!-- Your existing content here -->
  </div>

  <!-- Add Product Modal -->
  <div id="addProductModal" class="fixed inset-0 hidden z-50 overflow-y-auto">
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 opacity-0"
      id="modalBackdrop"></div>
    <div class="fixed inset-0 flex items-center justify-center p-4">
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-[32rem] transform transition-all duration-300 opacity-0 translate-y-4 scale-95"
        id="modalContent">
        <!-- Add Product Modal Content -->
      </div>
    </div>
  </div>

  <!-- Edit Product Modal -->
  <div id="editProductModal" class="fixed inset-0 hidden z-50 overflow-y-auto">
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 opacity-0"
      id="editModalBackdrop"></div>
    <div class="fixed inset-0 flex items-center justify-center p-4">
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-[32rem] transform transition-all duration-300 opacity-0 translate-y-4 scale-95"
        id="editModalContent">
        <!-- Edit Product Modal Content -->
      </div>
    </div>
  </div>

  <!-- Mark as Unavailable Modal -->
  <div id="unavailableModal" class="fixed inset-0 hidden z-50 overflow-y-auto">
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 opacity-0"
      id="unavailableModalBackdrop"></div>
    <div class="fixed inset-0 flex items-center justify-center p-4">
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-[32rem] transform transition-all duration-300 opacity-0 translate-y-4 scale-95"
        id="unavailableModalContent">
        <!-- Mark as Unavailable Modal Content -->
      </div>
    </div>
  </div>

  <!-- Product History Modal -->
  <div id="historyModal" class="fixed inset-0 hidden z-50 overflow-y-auto">
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 opacity-0"
      id="historyModalBackdrop"></div>
    <div class="fixed inset-0 flex items-center justify-center p-4">
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-[32rem] transform transition-all duration-300 opacity-0 translate-y-4 scale-95"
        id="historyModalContent">
        <!-- Product History Modal Content -->
      </div>
    </div>
  </div>

  <script>
    $(document).ready(function () {
      // Modal Management
      function initModal(modalId, backdropId, contentId) {
        const $modal = $(`#${modalId}`);
        const $backdrop = $(`#${backdropId}`);
        const $content = $(`#${contentId}`);

        return {
          open: () => {
            $modal.removeClass('hidden');
            requestAnimationFrame(() => {
              $backdrop.addClass('opacity-100');
              $content
                .addClass('opacity-100')
                .removeClass('translate-y-4 scale-95')
                .addClass('translate-y-0 scale-100');
            });
          },
          close: () => {
            $backdrop.removeClass('opacity-100');
            $content
              .removeClass('opacity-100 translate-y-0 scale-100')
              .addClass('translate-y-4 scale-95');

            setTimeout(() => {
              $modal.addClass('hidden');
            }, 300);
          }
        };
      }

      // Initialize all modals
      const addModal = initModal('addProductModal', 'modalBackdrop', 'modalContent');
      const editModal = initModal('editProductModal', 'editModalBackdrop', 'editModalContent');
      const unavailableModal = initModal('unavailableModal', 'unavailableModalBackdrop', 'unavailableModalContent');
      const historyModal = initModal('historyModal', 'historyModalBackdrop', 'historyModalContent');

      // Event Handlers
      $('.open-modal').click(() => addModal.open());
      $('.close-modal').click(() => addModal.close());

      $('.edit-product').click(function () {
        const productId = $(this).data('id');
        // Fetch and populate product data
        editModal.open();
      });
      $('.close-edit-modal').click(() => editModal.close());

      $('.mark-unavailable').click(function () {
        const productId = $(this).data('id');
        unavailableModal.open();
      });
      $('.close-unavailable-modal').click(() => unavailableModal.close());

      $('.view-history').click(function () {
        const productId = $(this).data('id');
        // Fetch and populate history data
        historyModal.open();
      });
      $('.close-history-modal').click(() => historyModal.close());

      // Close on backdrop click
      $('#modalBackdrop').click(() => addModal.close());
      $('#editModalBackdrop').click(() => editModal.close());
      $('#unavailableModalBackdrop').click(() => unavailableModal.close());
      $('#historyModalBackdrop').click(() => historyModal.close());

      // Prevent modal content clicks from closing the modal
      $('.modal-content').click(e => e.stopPropagation());
    });
  </script>
</body>

</html>