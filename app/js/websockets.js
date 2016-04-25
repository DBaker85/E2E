$(document).ready(function(){



    var host = 'ws://'+window.location.hostname+':'+window.location.port;
    var ws = new WebSocket(host);

    ws.onopen = function() {
        console.log("Test client connected to test server");
        $('.js-online').find('i').removeClass('offline').addClass('online');
        $('.js-online').find('span').html('Online');
    };

    ws.onclose = function() {
        console.log("Test client disconnected from test server");
        $('.js-online').find('i').removeClass('online').addClass('offline');
        $('.js-online').find('span').html('Offline');
        if($('.js-test-progress').length > 0){
            $('.js-test-progress').removeClass('progress-bar-success progress-bar-striped').addClass('progress-bar-danger').css("width", "100%");
            $('.js-progress-value').text('error');
            $('.js-progress-container').append('<div class="alert alert-danger">An error occured or the connection was lost. Please wait a while and check to see if your results appear on the results page. If not please relaunch the test</div>')

        }
    };

    var testParams;

    ws.onmessage = function (event) {
      var data = JSON.parse(event.data);
      console.log(+data.progress.passed+'/'+data.progress.tests+' '+data.program+' tests done by '+data.id);
      if (data.progress.status == "pending" && data.id == window.userId) {
        var barWidth = Math.round((data.progress.passed / data.progress.tests) * 100);
        $('.js-test-progress').css("width",barWidth+'%').attr("aria-valuenow",barWidth);
        $('.js-progress-value').html(barWidth+'%');
        testParams = JSON.stringify({
            program: data.program,
            id: window.userId
        });
        if (barWidth == 100) {
          $.ajax({
            url: '/results',
            type: 'put',
            data: testParams,
            contentType : 'application/json',
            success: function() {
              window.location.href = window.location.protocol + '//' + window.location.host +"/results/"+data.program;
            }
          });
        }
      } else if (data.progress.status == "passed" && data.id == window.userId) {
        // put results to database first then reload
        testParams = JSON.stringify({
            program: data.program,
            id: window.userId
        });
        window.location.href = window.location.protocol + '//' + window.location.host +"/results/"+data.program;
      }
    };


})

