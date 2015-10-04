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

    var img = document.createElement("img");
    img.src = event.target.result;
    //compress the file
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var MAX_WIDTH = 400;
    var MAX_HEIGHT = 300;
    var width = img.width;
    var height = img.height;

    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    compressedPhoto = canvas.toDataURL("image/jpeg");

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}
    var blob = dataURLtoBlob(compressedPhoto);

    // TODO FIX THIS
    var curr_user_id = 1;
    var curr_target_id = 1;

    var photoUrl = apiUrl + '/photos';
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    xhr.open("POST", photoUrl, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        // Handle response.
        console.log(xhr.responseText); // handle response.
        console.log(JSON.parse(xhr.responseText));
        $.ajax({
            url: apiUrl + '/api/submissions',
            method: 'POST',
            contentType: 'text/plain',
            data: {
              user_id: curr_user_id,
              target_id: curr_target_id,
              score: 1,
              photo: JSON.parse(xhr.responseText)['file_path'],
              description: ''
            },
            crossDomain: true
          }
        ).done(function(e) {
          console.log(e);
        });

      }
    };
    fd.append('image', blob);
    // Initiate a multipart/form-data upload
    xhr.send(fd);

    };
    fileReader.readAsDataURL(file);

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
