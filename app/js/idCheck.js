$(document).ready(function(){

  window.userId = null;

  $('.js-id-error').hide();

  if (localStorage.getItem('E2E_id') == undefined){
    $('#IDmodal').modal({
      keyboard: false,
      backdrop: 'static'
    });
    $('.js-modal-title').html('Machine ID not found');
  } else {
    if(localStorage.getItem('E2E_id').match(/PBIO-[0-9]{4}$/g)) {
      window.userId = localStorage.getItem('E2E_id');
    } else {
      $('.js-modal-title').html('Incompatible or Corrupt machine ID');
      $('#IDmodal').modal({
        keyboard: false,
        backdrop: 'static'
      });
    }

  }

  $('.js-id-submit').on('click', function(){
    if ($('.js-id-create').val().match(/[0-9]{4}$/g) && $('.js-id-create').val().length == 4) {
      window.userId = 'PBIO-'+$('.js-id-create').val();
      $(this).parents('.modal').modal('hide');
      localStorage.setItem('E2E_id',window.userId);
    } else {
      $('.js-id-error').show();
    }

  });

  if($('.js-id')){
    $('.js-id').val(window.userId);
  }


})

