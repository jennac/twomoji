$(document).ready( function() {
  doPoll()
});

function doPoll(){
  var apiUrl = "http://twomoji-api.chasjhin.com/api";
  var targetUrl = apiUrl + "/targets";
  var jqxhr = $.ajax({
      url: targetUrl,
      crossDomain: true
    }
  )
  .done(function(data) {
    var i = 0;
    var targets = data['objects'];
    // set the current round emojis
    var currentTarget = $.grep(targets, function(e){return e['status'] == "1"})[0];
    var currentRound = currentTarget['id'];
    console.log()
    if (currentRound <= 3) {
      //hide 4 and 5
      $("#round-4-emojis").hide();
      $("#round-5-emojis").hide();
    }
    else if (currentRound <=4) {
      //hide 5
      $("#round-4-emojis").show();
      $("#round-5-emojis").hide();
    }
    else {
      $("#round-4-emojis").show();
      $("#round-5-emojis").show();

    }
    $("#currentRound").html("Round " + currentRound);
    $("#current-emoji-pair").html(currentTarget['emoji_pair']);
    // set the images for the other rounds
    for(i=0; i < targets.length; i++) {
      var target_emojis = targets[i]['emoji_pair'];
      var id_class = "round-" + (i + 1) + "-emojis";
      $("#" + id_class).html(target_emojis);
    }
    var submissions = currentTarget['submissions'];
    // set the submissions emoji each user
    // only will do top 5 cause only 5 images to update
    var imagePrefix = "http://twomoji.chasjhin.com"
    for(i=0; i < submissions.length; i++) {
      var user_emojis = submissions[i]['photo'];
      user_emojis = user_emojis.replace("/home/cjhin/www/chasjhin/twomoji","")
      var imagePath = imagePrefix + user_emojis
      var emoji_id_class = "#user-" + (i + 1) + "-emojis";
      $(emoji_id_class).attr("src", imagePath)
      // $(emoji_id_class).html(imagePath)
      var user_id = submissions[i]['user_id']
      var user_pic_id_class = "#user-" + (i + 1) + "-submission-pic";
      switch (user_id) {
        case 1:
          $(user_pic_id_class).attr("src", "jenna.jpg");
          break;
        case 2:
          $(user_pic_id_class).attr("src", "chas.jpg");
          break;
        case 3:
          $(user_pic_id_class).attr("src", "jonathan.jpg");
          break;
        case 5:
          $(user_pic_id_class).attr("src", "claire.jpg");
          break;
        case 6:
          $(user_pic_id_class).attr("src", "jake.jpg");
          break;
        case 4:
          $(user_pic_id_class).attr("src", "marybeth.jpg");
          break;
        default:
          break;
      }
    }
  })
  .fail(function() {
    alert( "error" );
  })
  .always(function() {
  });

  // get users for the rankings
  var usersUrl = apiUrl + "/users";
  var jqxhr = $.ajax({
      url: usersUrl,
      crossDomain: true
    }
  )
  .done(function(data) {
    var users = data['objects'];
    var i = 0;
    var userToPoints = {}
    for(i=0; i < users.length; i++) {
      userToPoints[users[i]['username']] = users[i]['points']
    }
    var tuples = [];

    for (var key in userToPoints) tuples.push([key, userToPoints[key]]);

    tuples.sort(function(a, b) {
      a = a[1];
      b = b[1];
      return a < b ? -1 : (a > b ? 1 : 0);
    });

    for (var i = 0; i < tuples.length; i++) {
      var username = tuples[i][0];
      var points = tuples[i][1];
      // do something with key and value
      var id_prefix = "#user-" + (i+1) + "-place-"
      $(id_prefix + "username").html(username)
      $(id_prefix + "score").html(points)
      var user_rank_id = id_prefix + "image"
      switch (username) {
        case "jenna":
          $(user_rank_id).attr("src", "jenna.jpg");
          break;
        case "chas":
          $(user_rank_id).attr("src", "chas.jpg");
          break;
        case "cobian":
          $(user_rank_id).attr("src", "jonathan.jpg");
          break;
        case "claire":
          $(user_rank_id).attr("src", "claire.jpg");
          break;
        case "jake":
          $(user_rank_id).attr("src", "jake.jpg");
          break;
        case "marybeth":
          $(user_rank_id).attr("src", "marybeth.jpg");
          break;
        default:
          break;
      }
    }
    setTimeout(doPoll, 5000)
  })
    
}
