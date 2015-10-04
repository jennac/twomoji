$(document).ready( function() {

  var apiUrl = "http://twomoji-api.chasjhin.com/api";
  var targetUrl = apiUrl + "/targets";
  var jqxhr = $.ajax({
      url: targetUrl,
      crossDomain: true
    }
  )
  .done(function(data) {
    var i = 0;
    var targets = data['objects']
    var currentTarget = $.grep(targets, function(e){return e['status'] == "1"})[0]
    $("#current-emoji-pair").html(currentTarget['emoji_pair'])
  })
  .fail(function() {
    alert( "error" );
  })
  .always(function() {
  });

});
