$(document).ready( function() {
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

    var photoUrl = apiUrl + '/photos';
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    xhr.open("POST", photoUrl, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        // Handle response.
        alert(xhr.responseText); // handle response.
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
  })
  .fail(function() {
    alert( "error" );
  })
  .always(function() {
  });

});
