$(document).ready(function(){

  $('.js-program-check').on('click', function(){
    var angularVal = $(this).data('angular');
    if (angularVal !== undefined){
       $('.js-angular').val(angularVal);
    }
  });

})

