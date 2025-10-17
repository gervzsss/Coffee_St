$(document).ready(function () {
  // Initialize sidebar state
  let sidebarOpen = true;

  // Toggle sidebar function
  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
    if (sidebarOpen) {
      $(".admin-sidebar").addClass("w-64").removeClass("w-20");
      $(".main-content").addClass("ml-64").removeClass("ml-20");
      $(".sidebar-content").fadeIn(200);
      $(".admin-header, .content-card")
        .addClass("lg:mr-4")
        .removeClass("lg:mr-8");
      $(".open-icon").removeClass("hidden");
      $(".close-icon").addClass("hidden");
    } else {
      $(".admin-sidebar").removeClass("w-64").addClass("w-20");
      $(".main-content").removeClass("ml-64").addClass("ml-20");
      $(".sidebar-content").fadeOut(200);
      $(".admin-header, .content-card")
        .removeClass("lg:mr-4")
        .addClass("lg:mr-8");
      $(".open-icon").addClass("hidden");
      $(".close-icon").removeClass("hidden");
    }
  }

  // Handle sidebar toggle click
  $(".sidebar-toggle").on("click", function (e) {
    e.preventDefault();
    toggleSidebar();
  });

  // Add sidebar-content class to elements that should hide
  $(
    ".admin-sidebar .flex-col, .admin-sidebar span:not(.sidebar-toggle)",
  ).addClass("sidebar-content");

  // Handle window resize
  $(window).on("resize", function () {
    if ($(window).width() < 768 && sidebarOpen) {
      toggleSidebar();
    }
  });

  // Initialize toggle icons
  $(".close-icon").addClass("hidden");
});
