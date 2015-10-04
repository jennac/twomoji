$(document).ready( function() {
    pollEverything()
});

function pollEverything () {
  var apiUrl = "http://twomoji-api.chasjhin.com";
  var targetUrl = apiUrl + "/api/targets";
  /* When the file is uploaded, put it on the screen,
  * TODO: send to server
  * */

  $("#file-uploader").on('change', function(e) {
    var file = e.target.files[0];

    var fileReader = new FileReader()
    fileReader.onload = function (event) {
      $("#uploaded-img").attr("src", event.target.result);
      $("#file-upload-text").text("");
    };
    fileReader.readAsDataURL(file);

    // TODO FIX THIS
    // var curr_user_id = Math.floor((Math.random() * 6) + 1);
    var curr_user_id = $("#userId").val()
    //grabs from global var set during the targets endpoint (see below)
    var curr_target_id = currentTargetId;

    var photoUrl = apiUrl + '/photos';
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    xhr.open("POST", photoUrl, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        // Handle response.
        //console.log(xhr.responseText); // handle response.
        // console.log(JSON.parse(xhr.responseText));
        new_url = apiUrl + '/submission' +
          '?user_id=' + curr_user_id +
          '&target_id=' + curr_target_id +
          '&score=' + 1 +
          '&photo=' + JSON.parse(xhr.responseText)['file_path'] +
          '&description=' + 'blah'
        $.ajax({
            url: new_url,
            method: 'POST',
            crossDomain: true
          }
        ).done(function(e) {
          console.log(e);
        });

      }
    };
    fd.append('image', file);
    // Initiate a multipart/form-data upload
    xhr.send(fd);

    });


  var jqxhr = $.ajax({
      url: targetUrl,
      crossDomain: true
    }
  )
  .done(function(data) {
    // alert(data['objects'][0]['emoji_pair'])
    var i = 0;
    var targets = data['objects']
    var currentTarget = $.grep(targets, function(e){return e['status'] == "1"})[0]
    $("#emoji-pair").html(currentTarget['emoji_pair'])
    currentTargetId = currentTarget['id']
    setTimeout(pollEverything, 5000)
  })
  .fail(function() {
    alert( "error" );
  })
  .always(function() {
  });


}
