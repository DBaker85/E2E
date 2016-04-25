$(document).ready(function(){

  $('.passed').hide()

  $('.js-show-all').on('click', function(e){
    $('.passed').show()
  })

  $('.js-show-failed').on('click', function(e){
    $('.passed').hide()
  })

})

