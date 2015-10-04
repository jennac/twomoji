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
    var targets = data['objects'];
    // set the current round emojis
    var currentTarget = $.grep(targets, function(e){return e['status'] == "1"})[0];
    var currentRound = currentTarget['id'];
    $("currentRound").html("Round " + currentRound);
    $("#current-emoji-pair").html(currentTarget['emoji_pair']);
    // set the images for the other rounds
    for(i=0; i < targets.length; i++) {
      var target_emojis = targets[i]['emoji_pair'];
      var id_class = "round-" + (i + 1) + "-emojis";
      $("#" + id_class).html(target_emojis);
    }
    var submissions = data['objects']['submissions'];
    // set the images each user
    // only top 5
    for(i=0; i < 5; i++) {
      var user_emojis = targets[i]['emoji_pair'];
      var emoji_id_class = "#user-" + (i + 1) + "-emojis";
      var username = targets[i]['username'];
      var user_pic_id_class = "#user-" + (i + 1) + "-submission-pic";
      switch (username) {
        case "jenna":
          $(user_pic_id_class).attr("src", "jenna.jpg");
          break;
        case "chas":
          $(user_pic_id_class).attr("src", "chas.jpg");
          break;
        case "jonathan":
          $(user_pic_id_class).attr("src", "jonathan.jpg");
          break;
        case "claire":
          $(user_pic_id_class).attr("src", "claire.jpg");
          break;
        case "jake":
          $(user_pic_id_class).attr("src", "jake.jpg");
          break;
        case "mary beth":
          $(user_pic_id_class).attr("src", "marybeth.jpg");
          break;
      }
      $(emoji_id_class).html(user_emojis)
    }
  })
  .fail(function() {
    alert( "error" );
  })
  .always(function() {
  });

  // get users for the rankings
  var targetUrl = apiUrl + "/users";
  var jqxhr = $.ajax({
      url: targetUrl,
      crossDomain: true
    }
  )
  .done(function(data) {
    var users = data['objects'];
    var i = 0;
    var userToPoints = {}
    for(i=0; i < users.length; i++) {
      userToPoints[users[i]['username']] = 0;
      var user_targets = users[i]['usertargets'];
      var j=0;
      var points = 0;
      for(j=0; j < user_targets.length; j++) {
        points = points + user_targets['points'];
      }
      userToPoints[users[i]['username']] = points;
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
        $(id_prefix + "username").html(key)
        $(id_prefix + "score").html(points)
        var user_rank_id = id_prefix + "image"
        switch (username) {
        case "jenna":
          $(user_rank_id).attr("src", "jenna.jpg");
          break;
        case "chas":
          $(user_rank_id).attr("src", "chas.jpg");
          break;
        case "jonathan":
          $(user_rank_id).attr("src", "jonathan.jpg");
          break;
        case "claire":
          $(user_rank_id).attr("src", "claire.jpg");
          break;
        case "jake":
          $(user_rank_id).attr("src", "jake.jpg");
          break;
        case "mary beth":
          $(user_rank_id).attr("src", "marybeth.jpg");
          break;
      }
      $(emoji_id_class).html(user_emojis)
    }
    }

  }


});
