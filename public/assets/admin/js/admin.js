$(document).ready(function() {
    // Initialize sidebar state
    let sidebarOpen = true;
    
    // Toggle sidebar function
    function toggleSidebar() {
        sidebarOpen = !sidebarOpen;
        if (sidebarOpen) {
            $('.admin-sidebar').addClass('w-64').removeClass('w-20');
            $('.main-content').addClass('ml-64').removeClass('ml-20');
            $('.sidebar-content').show();
            $('.admin-header, .content-card').addClass('lg:mr-4').removeClass('lg:mr-8');
        } else {
            $('.admin-sidebar').removeClass('w-64').addClass('w-20');
            $('.main-content').removeClass('ml-64').addClass('ml-20');
            $('.sidebar-content').hide();
            $('.admin-header, .content-card').removeClass('lg:mr-4').addClass('lg:mr-8');
        }
    }

    // Handle sidebar toggle click
    $('.sidebar-toggle').on('click', function() {
        toggleSidebar();
    });

    // Handle window resize
    $(window).on('resize', function() {
        if ($(window).width() < 768 && sidebarOpen) {
            toggleSidebar();
        }
    });
});