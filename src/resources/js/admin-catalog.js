$(document).ready(function() {
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
    const modals = {
        add: initModal('addProductModal', 'modalBackdrop', 'modalContent'),
        edit: initModal('editProductModal', 'editModalBackdrop', 'editModalContent'),
        unavailable: initModal('unavailableModal', 'unavailableModalBackdrop', 'unavailableModalContent'),
        history: initModal('historyModal', 'historyModalBackdrop', 'historyModalContent')
    };

    // Modal event handlers
    $(document).on('click', '.open-modal, button[data-action="add-product"]', function(e) {
        e.preventDefault();
        console.log('Opening add product modal');
        modals.add.open();
    });

    $(document).on('click', '.close-modal, #modalBackdrop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        modals.add.close();
    });

    // Prevent closing when clicking modal contents and handle backdrop clicks
    $(document).on('click', '#modalContent', function(e) {
        e.stopPropagation();
    });

    $(document).on('click', '#modalBackdrop', function(e) {
        e.preventDefault();
        modals.add.close();
    });

    $(document).on('click', '#editModalBackdrop', function(e) {
        e.preventDefault();
        modals.edit.close();
    });

    $(document).on('click', '#historyModalBackdrop', function(e) {
        e.preventDefault();
        modals.history.close();
    });

    $(document).on('click', '#unavailableModalBackdrop', function(e) {
        e.preventDefault();
        modals.unavailable.close();
    });

    // Image preview with drag and drop
    const $dropZone = $('.border-dashed');
    const $fileInput = $('#productImage');
    
    $dropZone
        .on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
        })
        .on('dragover dragenter', function() {
            $(this).addClass('border-[#30442B] bg-gray-50');
        })
        .on('dragleave dragend drop', function() {
            $(this).removeClass('border-[#30442B] bg-gray-50');
        })
        .on('drop', function(e) {
            const file = e.originalEvent.dataTransfer.files[0];
            if (file) handleFile(file);
        });

    $fileInput.change(function(e) {
        if (e.target.files[0]) handleFile(e.target.files[0]);
    });

    function handleFile(file) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#imagePreview').attr('src', e.target.result);
                $('#previewContainer').removeClass('hidden');
                $('#uploadIcon').addClass('hidden');
            }
            reader.readAsDataURL(file);
        }
    }

    // Form submission
    $('#addProductForm').submit(function(e) {
        e.preventDefault();
        // Add your form submission logic here
        modals.add.close();
    });

    // Edit Product Modal
    $(document).on('click', '.edit-product', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Opening edit product modal');
        
        const productId = $(this).data('id');
        // TODO: Replace with actual API call
        const mockData = {
            name: 'Latte',
            price: 4.50,
            category: 'coffee',
            description: 'Smooth espresso with steamed milk',
            image: '/path/to/image.jpg'
        };
        
        // Populate form
        $('#editProductName').val(mockData.name);
        $('#editProductPrice').val(mockData.price);
        $('#editProductCategory').val(mockData.category);
        $('#editProductDescription').val(mockData.description);
        $('#editImagePreview').attr('src', mockData.image);
        
        modals.edit.open();
    });

    // Close edit modal with proper event delegation
    $(document).on('click', '.close-edit-modal, #editModalBackdrop', function() {
        modals.edit.close();
    });

    $('#editProductForm').submit(function(e) {
        e.preventDefault();
        // Add your form submission logic here
        modals.edit.close();
    });

    // Mark as Unavailable Modal
    $(document).on('click', '.mark-unavailable', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Opening unavailable modal');
        
        const productId = $(this).data('id');
        // Clear previous reason
        $('#unavailableReason').val('');
        modals.unavailable.open();
    });

    $(document).on('click', '.close-unavailable-modal', function(e) {
        e.preventDefault();
        e.stopPropagation();
        modals.unavailable.close();
    });

    $('#unavailableForm').submit(function(e) {
        e.preventDefault();
        const reason = $('#unavailableReason').val();
        if (!reason) {
            alert('Please provide a reason');
            return;
        }
        
        // TODO: Replace with actual API call
        console.log('Marking product as unavailable:', {
            reason: reason
        });
        modals.unavailable.close();
    });

    // Product History Modal
    $(document).on('click', '.view-history', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Opening history modal');
        
        const productId = $(this).data('id');
        // TODO: Replace with actual API call
        const mockData = {
            name: 'Latte',
            category: 'Coffee',
            price: '$4.50',
            description: 'Smooth espresso with steamed milk',
            image: '/path/to/image.jpg',
            createdBy: 'Sarah Manager',
            createdOn: 'January 15, 2024 at 04:30 PM',
            totalRevenue: '$5625.00',
            unitsSold: '1250',
            editHistory: [
                {
                    user: 'Admin User',
                    action: 'Updated price from $3.00 to $3.50',
                    date: 'February 20, 2024 at 06:15 PM'
                },
                {
                    user: 'Admin User',
                    action: 'Updated price from $3.50 to $4.50',
                    date: 'February 20, 2024 at 06:15 PM'
                }
            ]
        };

        // Populate history modal
        $('#historyProductName').text(mockData.name);
        $('#historyProductImage').attr('src', mockData.image);
        $('#historyProductTitle').text(mockData.name);
        $('#historyProductCategory').text(mockData.category);
        $('#historyProductPrice').text(mockData.price);
        $('#historyProductDescription').text(mockData.description);
        $('#historyCreatedBy').text(mockData.createdBy);
        $('#historyCreatedOn').text(mockData.createdOn);
        $('#historyTotalRevenue').text(mockData.totalRevenue);
        $('#historyUnitsSold').text(mockData.unitsSold);

        // Populate edit history
        const editListHtml = mockData.editHistory.map(edit => `
            <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex justify-between items-start">
                    <div>
                        <span class="text-sm font-medium text-gray-900">${edit.user}</span>
                        <p class="text-sm text-gray-500">${edit.action}</p>
                    </div>
                    <span class="text-xs text-gray-400">${edit.date}</span>
                </div>
            </div>
        `).join('');
        
        $('#historyEditList').html(editListHtml);
        modals.history.open();
    });

    // Close history modal with proper event delegation
    $(document).on('click', '.close-history-modal', function(e) {
        e.preventDefault();
        e.stopPropagation();
        modals.history.close();
    });
    
    // Delete product handler
    $(document).on('click', '.delete-product', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const productId = $(this).data('id');
        const productName = $(this).closest('tr').find('td:nth-child(2)').text(); // Get product name from table
        
        if (confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
            // TODO: Replace with actual API call
            console.log('Deleting product:', { id: productId, name: productName });
            // For now, just hide the row as a visual confirmation
            $(this).closest('tr').fadeOut(300, function() {
                $(this).remove();
            });
        }
    });
});
