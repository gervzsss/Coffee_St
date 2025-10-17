// Helper function to get status styles
function getStatusStyles(status) {
    const styles = {
        'pending': 'bg-yellow-50 text-yellow-700',
        'confirmed': 'bg-blue-50 text-blue-700',
        'processing': 'bg-blue-50 text-blue-700',
        'out for delivery': 'bg-purple-50 text-purple-700',
        'cancelled': 'bg-red-50 text-red-700',
        'failed': 'bg-red-50 text-red-700'
    };
    return styles[status.toLowerCase()] || styles['pending'];
}

    // Function to get available status options based on current section
    function getStatusOptions(currentSection, currentStatus) {
        switch(currentSection.toLowerCase()) {
            case 'all':
                return [
                    { value: 'Pending', label: 'Pending' },
                    { value: 'Confirmed', label: 'Confirmed' },
                    { value: 'Cancelled', label: 'Cancelled' }
                ];
            case 'processing':
                return [
                    { value: 'Pending', label: 'Pending' },
                    { value: 'Out for Delivery', label: 'Out for Delivery' },
                    { value: 'Cancelled', label: 'Cancelled' }
                ];
            default:
                return [{ value: currentStatus, label: currentStatus }];
        }
    }

    // Function to determine the display status
    function getDisplayStatus(status, newStatus) {
        // Map internal statuses to display sections
        const statusMap = {
            'confirmed': 'processing',
            'cancelled': 'failed'
        };
        return statusMap[newStatus.toLowerCase()] || status.toLowerCase();
    }

// Function to show success notification
function showSuccessNotification(message) {
    const notification = $(`
        <div class="fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-lg transition-all duration-500 transform translate-x-full">
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <p class="font-medium">${message}</p>
            </div>
        </div>
    `).appendTo('body');

    // Animate in
    setTimeout(() => notification.removeClass('translate-x-full'), 100);

    // Animate out and remove
    setTimeout(() => {
        notification.addClass('translate-x-full');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

$(document).ready(function() {
    // Status color mapping
    const statusColors = {
        'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', count: 0 },
        'processing': { bg: 'bg-blue-100', text: 'text-blue-800', count: 0 },
        'out-for-delivery': { bg: 'bg-purple-100', text: 'text-purple-800', count: 0 },
        'completed': { bg: 'bg-green-100', text: 'text-green-800', count: 0 },
        'failed': { bg: 'bg-red-100', text: 'text-red-800', count: 0 }
    };

    // Function to update order counts
    function updateOrderCounts() {
        // Reset all counts
        Object.keys(statusColors).forEach(status => {
            statusColors[status].count = 0;
        });

        // Count orders by status
        $('.order-item').each(function() {
            const status = $(this).data('status').toLowerCase();
            if (statusColors[status]) {
                statusColors[status].count++;
            }
        });

        // Update the status cards
        Object.keys(statusColors).forEach(status => {
            $(`#${status}-count`).text(statusColors[status].count);
        });

        // Update total count
        const totalOrders = $('.order-item').length;
        $('#total-orders').text(totalOrders);
    }

    // Order details data
    const orders = {
        'ORD-1234': {
            status: 'Pending',
            customer: {
                name: 'Bob Johnson',
                email: 'bob@email.com',
                phone: '+1-234-567-8902',
                address: '456 Oak Ave, Brooklyn, NY 11201'
            },
            items: [
                { 
                    name: 'Cafe latte',
                    quantity: 1, 
                    options: ['Iced', 'Espresso shot', 'Oat'],
                    price: 10.50
                },
                { 
                    name: 'Salted Caramel latte',
                    quantity: 2,
                    options: ['Hot', 'Caramel Drizzle', 'Oat'],
                    price: 7.50
                }
            ],
            total: 18.00,
            activity: [
                { action: 'Order created', timestamp: '2024-01-15 08:45 AM' },
                { action: 'Last updated by Admin User', timestamp: '10/15/2025, 7:53:53 PM' }
            ]
        }
    };

    // Functions
    function updateStatusBadge(status) {
        const badge = $('#statusBadge');
        badge.removeClass().addClass('px-4 py-1.5 rounded-full text-sm font-medium');
        
        switch(status.toLowerCase()) {
            case 'pending':
                badge.addClass('bg-yellow-100 text-yellow-800');
                break;
            case 'confirmed':
            case 'processing':
                badge.addClass('bg-blue-100 text-blue-800');
                break;
            case 'out-for-delivery':
                badge.addClass('bg-purple-100 text-purple-800');
                break;
            case 'completed':
                badge.addClass('bg-green-100 text-green-800');
                break;
            case 'failed':
            case 'cancelled':
                badge.addClass('bg-red-100 text-red-800');
                break;
            default:
                badge.addClass('bg-gray-100 text-gray-800');
        }
        badge.text(status);
    }

    function showStatusConfirmModal(orderId, oldStatus, newStatus) {
        const modal = $('#statusConfirmModal');
        $('#oldStatus').text(oldStatus);
        $('#newStatus').text(newStatus);
        
        // Store the orderId and statuses for the confirmation handler
        modal.data('orderId', orderId);
        modal.data('oldStatus', oldStatus);
        modal.data('newStatus', newStatus);

        // Handle cancellation reason field
        const isCancelling = newStatus.toLowerCase() === 'cancelled';
        const reasonContainer = $('#cancellationReasonContainer');
        
        if (isCancelling) {
            reasonContainer.removeClass('hidden').addClass('animate-fade-in');
            $('#cancellationReason').val('').focus();
            $('#reasonError').addClass('hidden');
        } else {
            reasonContainer.addClass('hidden');
            $('#cancellationReason').val('');
        }
        
        // Show modal with animation
        modal.removeClass('hidden');
        setTimeout(() => {
            modal.find('.transform').removeClass('scale-95 opacity-0').addClass('scale-100 opacity-100');
        }, 10);
    }

    function closeStatusConfirmModal() {
        const modal = $('#statusConfirmModal');
        modal.find('.transform').removeClass('scale-100 opacity-100').addClass('scale-95 opacity-0');
        setTimeout(() => {
            modal.addClass('hidden');
        }, 300);
    }

    function processStatusChange(orderId, newStatus) {
        // Get the order item element
        const orderItem = $(`.order-item[data-order-id="${orderId}"]`);
        const oldStatus = orderItem.data('status');
        const currentSection = $('.status-card').filter(function() {
            return $(this).find('.status-indicator').css('transform') === 'matrix(1, 0, 0, 1, 0, 0)';
        }).data('status') || 'all';
        
        // Get the display status for section categorization
        const displayStatus = getDisplayStatus(currentSection, newStatus);
        
        // Show appropriate success message
        let message = '';
        switch(newStatus.toLowerCase()) {
            case 'confirmed':
                message = 'Order has been confirmed and moved to Processing!';
                break;
            case 'out for delivery':
                message = 'Order is now out for delivery!';
                break;
            case 'cancelled':
                message = 'Order has been cancelled and moved to Failed Orders.';
                break;
            default:
                message = `Order status changed to ${newStatus}`;
        }
        showSuccessNotification(message);
        
        // Update the order's status and display status
        orderItem.data('status', newStatus.toLowerCase());
        orderItem.data('display-status', displayStatus);
        
        // Update the order's status
        orderItem.data('status', newStatus.toLowerCase());
        
        // Update the status badge in the order card
        orderItem.find('.status-badge')
            .removeClass()
            .addClass('status-badge px-3 py-1 text-sm font-medium rounded-full ' + getStatusStyles(newStatus))
            .text(newStatus);
        
        // If we're in the order details modal, update that too
        if ($('#orderDetailsModal').is(':visible')) {
            updateStatusBadge(newStatus);
            $('#orderStatus').val(newStatus);
        }
        
        // Update counts and filtered view
        updateOrderCounts();
        const currentStatus = $('.status-card').filter(function() {
            return $(this).find('.status-indicator').css('transform') === 'matrix(1, 0, 0, 1, 0, 0)';
        }).data('status') || 'all';
        filterOrders(currentStatus);
        updateStatusCardStyles(currentStatus);
        
        // Add to activity log if in details modal
        const timestamp = new Date().toLocaleString();
        let activityText = `Status changed from ${oldStatus} to ${newStatus}`;
        
        // Add cancellation reason if status is cancelled
        if (newStatus.toLowerCase() === 'cancelled') {
            const reason = $('#statusConfirmModal').data('cancellationReason');
            activityText += `<br><span class="text-red-600 text-xs mt-1 block">Reason: ${reason}</span>`;
            
            // Add cancellation note to the order card if it exists
            const noteContainer = orderItem.find('.note-container');
            if (noteContainer.length === 0) {
                orderItem.find('.mb-4').after(`
                    <div class="note-container bg-red-50/50 p-4 rounded-xl mt-4 mb-4 border border-red-100">
                        <p class="text-red-700">
                            <span class="font-medium">Cancellation Reason:</span> ${reason}
                        </p>
                    </div>
                `);
            }
        }
        
        $('#activityLog').prepend(`
            <div class="flex justify-between items-center py-1 text-gray-600">
                <div class="flex-1">${activityText}</div>
                <span class="text-gray-400 ml-4">${timestamp}</span>
            </div>
        `);
    }

    function closeOrderDetails() {
        const modal = $('#orderDetailsModal');
        modal.find('.transform').removeClass('scale-100 opacity-100').addClass('scale-95 opacity-0');
        setTimeout(() => {
            modal.addClass('hidden');
        }, 300);
    }

    function openOrderDetails(orderId) {
        const order = orders[orderId];
        if (!order) return;

        // Update modal content
        $('#orderNumber').text(orderId);
        $('#customerName').text(order.customer.name);
        $('#customerEmail').text(order.customer.email);
        $('#customerPhone').text(order.customer.phone);
        $('#customerAddress').text(order.customer.address);
        $('#orderStatus').val(order.status);

        // Update status badge
        updateStatusBadge(order.status);

        // Update order items
        const itemsHTML = order.items.map(item => `
            <div class="py-3">
                <div class="flex justify-between items-start">
                    <div>
                        <div class="flex items-center gap-2">
                            <p class="font-medium text-gray-800">${item.quantity}x ${item.name}</p>
                            <span class="text-sm text-gray-500">($${item.price.toFixed(2)} each)</span>
                        </div>
                        <p class="text-sm text-gray-500 mt-1">${item.options.join(' • ')}</p>
                    </div>
                    <span class="font-medium">$${(item.quantity * item.price).toFixed(2)}</span>
                </div>
            </div>
        `).join('');
        $('#orderItems').html(itemsHTML);

        // Update total
        $('#orderTotal').text(`$${order.total.toFixed(2)}`);

        // Update activity log
        const activityHTML = order.activity.map(activity => `
            <div class="flex justify-between items-center py-1 text-gray-600">
                <span>${activity.action}</span>
                <span class="text-gray-400">${activity.timestamp}</span>
            </div>
        `).join('');
        $('#activityLog').html(activityHTML);

        // Show modal with animation
        const modal = $('#orderDetailsModal');
        modal.removeClass('hidden');
        setTimeout(() => {
            modal.find('.transform').removeClass('scale-95 opacity-0').addClass('scale-100 opacity-100');
        }, 10);
    }

    // Filter orders by status
    function filterOrders(status) {
        if (status === 'all') {
            $('.order-item').fadeIn(300);
        } else {
            $('.order-item').each(function() {
                const orderItem = $(this);
                const orderStatus = orderItem.data('status').toLowerCase();
                const displayStatus = orderItem.data('display-status') || orderStatus;
                
                if (displayStatus === status) {
                    orderItem.fadeIn(300);
                } else {
                    orderItem.fadeOut(300);
                }
            });
        }
    }

    // Update all select dropdowns with available status options based on current status
    function updateStatusOptions(currentStatus) {
        const $select = $(this);
        const options = [];
        
        // Always include current status
        options.push(currentStatus);
        
        switch(currentStatus.toLowerCase()) {
            case 'pending':
                options.push('Confirmed', 'Cancelled');
                break;
            case 'confirmed':
            case 'processing':
                options.push('Cancelled');
                break;
            case 'cancelled':
            case 'failed':
                // No additional options for cancelled/failed orders
                break;
        }

        return options;
    }

    // Event Handlers
    // Function to update status card styles
    function updateStatusCardStyles(activeStatus) {
        $('.status-card').each(function() {
            const card = $(this);
            const status = card.data('status');
            let activeClass = '';
            let textClass = '';
            
            // Remove any existing active classes
            card.removeClass('bg-[#30442B] bg-blue-50 bg-purple-50 bg-green-50 bg-red-50 text-white');
            card.find('div:not(.status-indicator)').removeClass('text-white text-blue-600 text-purple-600 text-green-600 text-red-600');
            card.find('.status-indicator').css('transform', 'scaleX(0)');
            
            if (status === activeStatus) {
                switch(status) {
                    case 'all':
                        activeClass = 'bg-[#30442B]';
                        textClass = 'text-white';
                        break;
                    case 'processing':
                        activeClass = 'bg-blue-50';
                        textClass = 'text-blue-600';
                        break;
                    case 'out-for-delivery':
                        activeClass = 'bg-purple-50';
                        textClass = 'text-purple-600';
                        break;
                    case 'completed':
                        activeClass = 'bg-green-50';
                        textClass = 'text-green-600';
                        break;
                    case 'failed':
                        activeClass = 'bg-red-50';
                        textClass = 'text-red-600';
                        break;
                }
                
                card.addClass(activeClass);
                card.find('div:not(.status-indicator)').addClass(textClass);
                card.find('.status-indicator').css('transform', 'scaleX(1)');
            }
        });
    }

    // Status card click handler
    $('.status-card').on('click', function() {
        const status = $(this).data('status');
        
        // Update active state and styles
        updateStatusCardStyles(status);
        
        // Update header text
        const statusText = status === 'all' ? 'All Orders' : 
            status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + ' Orders';
        $('#orders-header-text').text(statusText);
        
        // Update all status dropdowns with appropriate options
        $('.order-item select').each(function() {
            updateStatusDropdown($(this), status);
        });
        
        // Update modal status dropdown if open
        if ($('#orderDetailsModal').is(':visible')) {
            updateStatusDropdown($('#orderStatus'), status);
        }
        
        filterOrders(status);
    });

    $(document).on('click', '.order-item', function(e) {
        if (!$(e.target).is('select')) {
            const orderId = $(this).data('order-id');
            openOrderDetails(orderId);
        }
    });

    $('#orderDetailsModal').on('click', function(e) {
        if (e.target === this) {
            closeOrderDetails();
        }
    });

    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') {
            closeOrderDetails();
        }
    });

    $(document).on('change', '#orderStatus', function() {
        const newStatus = $(this).val();
        updateStatusBadge(newStatus);
    });

    // Function to update status options in dropdown
    function updateStatusDropdown(select, section) {
        const currentStatus = select.val();
        const options = getStatusOptions(section, currentStatus);
        
        // Clear and update options
        select.empty();
        options.forEach(option => {
            select.append(`<option value="${option.value}" ${currentStatus === option.value ? 'selected' : ''}>${option.label}</option>`);
        });
    }

    // Status change handlers
    $(document).on('change', '.order-item select, #orderStatus', function(e) {
        e.stopPropagation();
        const select = $(this);
        const orderId = select.closest('.order-item').data('order-id') || $('#orderNumber').text();
        const newStatus = select.val();
        const oldStatus = $(`.order-item[data-order-id="${orderId}"]`).data('status');
        const currentSection = $('.status-card').filter(function() {
            return $(this).find('.status-indicator').css('transform') === 'matrix(1, 0, 0, 1, 0, 0)';
        }).data('status') || 'all';
        
        // Show confirmation modal
        showStatusConfirmModal(orderId, oldStatus, newStatus);
        
        // Reset the select to the old value until confirmed
        select.val(oldStatus);
    });

    // Confirmation modal handlers
    $('#confirmStatusChange').on('click', function() {
        const modal = $('#statusConfirmModal');
        const orderId = modal.data('orderId');
        const newStatus = modal.data('newStatus');
        
        // Check if cancellation reason is required
        if (newStatus.toLowerCase() === 'cancelled') {
            const reason = $('#cancellationReason').val().trim();
            if (!reason) {
                $('#reasonError').removeClass('hidden');
                $('#cancellationReason').focus();
                return;
            }
            
            // Store the cancellation reason
            modal.data('cancellationReason', reason);
        }
        
        // Process the status change
        processStatusChange(orderId, newStatus);
        
        // Update the select elements
        $(`.order-item[data-order-id="${orderId}"] select, #orderStatus`).val(newStatus);
        
        // Close the confirmation modal
        closeStatusConfirmModal();
    });

    $('#cancelStatusChange').on('click', closeStatusConfirmModal);

    // Close confirmation modal on escape key
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') {
            closeStatusConfirmModal();
        }
    });

    // Update filtered count when orders are filtered
    function updateFilteredCount() {
        const visibleOrders = $('.order-item:visible').length;
        $('#filtered-count').text(visibleOrders);
    }

    // Initialize counts and filtered count
    updateOrderCounts();
    updateFilteredCount();

    // Add observer for order visibility changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'style') {
                updateFilteredCount();
            }
        });
    });

    // Observe each order item for visibility changes
    $('.order-item').each(function() {
        observer.observe(this, { attributes: true });
    });
})