$(document).ready(function(){$(".js-program-check").on("click",function(){var e=$(this).data("angular");void 0!==e&&$(".js-angular").val(e)})}),$(document).ready(function(){$(".passed").hide(),$(".js-show-all").on("click",function(e){$(".passed").show()}),$(".js-show-failed").on("click",function(e){$(".passed").hide()})}),$(document).ready(function(){window.userId=null,$(".js-id-error").hide(),void 0==localStorage.getItem("E2E_id")?($("#IDmodal").modal({keyboard:!1,backdrop:"static"}),$(".js-modal-title").html("Machine ID not found")):localStorage.getItem("E2E_id").match(/PBIO-[0-9]{4}$/g)?window.userId=localStorage.getItem("E2E_id"):($(".js-modal-title").html("Incompatible or Corrupt machine ID"),$("#IDmodal").modal({keyboard:!1,backdrop:"static"})),$(".js-id-submit").on("click",function(){$(".js-id-create").val().match(/[0-9]{4}$/g)&&4==$(".js-id-create").val().length?(window.userId="PBIO-"+$(".js-id-create").val(),$(this).parents(".modal").modal("hide"),localStorage.setItem("E2E_id",window.userId)):$(".js-id-error").show()}),$(".js-id")&&$(".js-id").val(window.userId)}),$("#stackTracer").on("show.bs.modal",function(e){var o=$(e.relatedTarget),s=o.data("stack"),t=o.data("error"),r=$(this);r.find(".modal-title").text("Stack trace for "+t),r.find(".modal-body pre").text(s)}),$(document).ready(function(){var e="ws://"+window.location.hostname+":"+window.location.port,o=new WebSocket(e);o.onopen=function(){console.log("Test client connected to test server"),$(".js-online").find("i").removeClass("offline").addClass("online"),$(".js-online").find("span").html("Online")},o.onclose=function(){console.log("Test client disconnected from test server"),$(".js-online").find("i").removeClass("online").addClass("offline"),$(".js-online").find("span").html("Offline"),$(".js-test-progress").length>0&&($(".js-test-progress").removeClass("progress-bar-success progress-bar-striped").addClass("progress-bar-danger").css("width","100%"),$(".js-progress-value").text("error"),$(".js-progress-container").append('<div class="alert alert-danger">An error occured or the connection was lost. Please wait a while and check to see if your results appear on the results page. If not please relaunch the test</div>'))};var s;o.onmessage=function(e){var o=JSON.parse(e.data);if(console.log(+o.progress.passed+"/"+o.progress.tests+" "+o.program+" tests done by "+o.id),"pending"==o.progress.status&&o.id==window.userId){var t=Math.round(o.progress.passed/o.progress.tests*100);$(".js-test-progress").css("width",t+"%").attr("aria-valuenow",t),$(".js-progress-value").html(t+"%"),s=JSON.stringify({program:o.program,id:window.userId}),100==t&&$.ajax({url:"/results",type:"put",data:s,contentType:"application/json",success:function(){window.location.href=window.location.protocol+"//"+window.location.host+"/results/"+o.program}})}else"passed"==o.progress.status&&o.id==window.userId&&(s=JSON.stringify({program:o.program,id:window.userId}),window.location.href=window.location.protocol+"//"+window.location.host+"/results/"+o.program)}});