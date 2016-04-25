$('#stackTracer').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget); // Button that triggered the modal
  var stack = button.data('stack'); // Extract info from data-* attributes
  var error = button.data('error');
  var modal = $(this);
  modal.find('.modal-title').text('Stack trace for '+error);
  modal.find('.modal-body pre').text(stack);
})
