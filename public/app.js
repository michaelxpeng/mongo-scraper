$.getJSON("/unsaved", function (data) {
  for (var i = 0; i < data.length; i++) {
    $("#articles").append("<div class='single-article'><h4 class='header'>" + data[i].title +
      "<button class='waves-effect btn right' id='save' data-id='" + data[i]._id + "'>SAVE ARTICLE</button>" +
      "<button class='waves-effect btn right modal-trigger' id='add-note' data-id='" + data[i]._id + "' data-target='modal1'>ADD NOTE</button>" +
      "</h4>" +
      "<h6>" + data[i].subhed + "</h6>" +
      "<a href=" + "'" + data[i].link + "'>" + data[i].link + "</a>" +
      "</div>" +
      "<div id='modal1' class='modal'>" +
      "<div class='modal-content'>" +
      "<h5>Note Title</h5>" +
      "<input id='titleinput' name='title'>" +
      "<textarea id='bodyinput' name='body'></textarea>" +
      "</div>" +
      "<div class='modal-footer'>" +
      "<a class='modal-close waves-effect btn' id='save-note' data-id='" + data[i]._id + "'>SAVE NOTE</a>" +
      "</div>" +
      "</div>"
    );
  }
});

$(document).on("click", "#save", function () {

  $(this).parents(".single-article").remove();

  var thisId = $(this).attr("data-id");
  $.ajax({
    type: "GET",
    url: "/save/" + thisId
  });
});

$(document).ready(function () {
  $('.modal').modal();
});

$(document).on("click", "#save-note", function () {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val().trim(),
      body: $("#bodyinput").val().trim()
    }
  })
    .then(function (data) {
      console.log(data);
    });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});