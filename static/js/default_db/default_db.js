const checkboxes = $('.login_default_yr');
// Handle checkbox click events
checkboxes.on('click', function() {
  const selectedCheckbox = $(this);

  // Uncheck all checkboxes on the page
  $('.login_default_yr').prop('checked', false);

  // Check the clicked checkbox
  selectedCheckbox.prop('checked', true);
});
