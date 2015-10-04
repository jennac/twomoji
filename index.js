$(document).ready( function() {

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
  });

});
