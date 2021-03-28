$(document).ready(function(){
    $('#start').click(function(){
      $('#bar').removeClass('paused')
                       .addClass('active');
        
      $('#start').attr('disabled', '');
      $('#pause').removeAttr('disabled');
      $('#stop').removeAttr('disabled');
    });
  
    $('#pause').click(function(){
      $('#bar').addClass('paused');
           
      $('#start').removeAttr('disabled');
      $('#pause').attr('disabled', '');
    });
  
    $('#stop').click(function(){
          $('#bar').removeClass('active')
                 .removeClass('paused');
        
         $('#start').removeAttr('disabled');
      $('#pause').attr('disabled', '');
      $('#stop').attr('disabled', '');
    });
  });