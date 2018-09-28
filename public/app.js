// Grab the articles as a json
$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $(".articles").append("<h4 class='header'>" + data[i].title +
      "<a href=" + "'/saved'" + "class=" + "'waves-effect btn' data-id='" + data[i]._id + "'" +
      "id='save'>SAVE ARTICLE</a>" +
      "</h4>" +
      "<h6>By: " + data[i].author + "</h6>" +
      "<h6>" + data[i].subhed + "</h6>" +
      "<div class='card-action'" +
      "<a href=" + "'" + data[i].link + "'>" + data[i].link + "</a>" +
      "</div>");
  }
});

// function getUnread() {
//   $("#unread").empty();
//   $.getJSON("/unread", function (data) {
//     for (var i = 0; i < data.length; i++) {
//       $("#unread").prepend("<tr><td>" + data[i].title + "</td><td>" + data[i].author +
//         "</td><td><button class='markread' data-id='" + data[i]._id + "'>Mark Read</button></td></tr>");
//     }
//     $("#unread").prepend("<tr><th>Title</th><th>Author</th><th>Read/Unread</th></tr>");
//   });
// }


// Click event to mark a book as read
$("#save").on("click", function () {
  var thisId = $(this).attr("data-id");
  $.ajax({
    type: "GET",
    url: "/save/" + thisId
  });
  // $(this).parents(".articles").remove();
  getSaved();
});

// // Click event to mark a book as not read
// $(document).on("click", ".markunsaved", function() {
//   var thisId = $(this).attr("data-id");
//   $.ajax({
//     type: "GET",
//     url: "/markunsaved/" + thisId
//   });
//   $(this).parents(".articles").remove();
//   getUnsaved();
// });


// Functions

// Load unread books and render them to the screen
// function getUnsaved() {
//   $("#unread").empty();
//   $.getJSON("/unread", function(data) {
//     for (var i = 0; i < data.length; i++) {
//       $("#unread").prepend("<tr><td>" + data[i].title + "</td><td>" + data[i].author +
//         "</td><td><button class='markread' data-id='" + data[i]._id + "'>Mark Read</button></td></tr>");
//     }
//     $("#unread").prepend("<tr><th>Title</th><th>Author</th><th>Read/Unread</th></tr>");
//   });
// }

// Load read books and render them to the screen
function getSaved() {
  // $("#read").empty();
  $.getJSON("/saved", function (data) {
    for (var i = 0; i < data.length; i++) {
      $(".articles").prepend("<h4 class='header'>" + data[i].title +
        "<a href=" + "'/saved'" + "class=" + "'waves-effect btn' data-id='" + data[i]._id + "'" +
        "id='save'>SAVE ARTICLE</a>" +
        "</h4>" +
        "<h6>By: " + data[i].author + "</h6>" +
        "<h6>" + data[i].subhed + "</h6>" +
        "<div class='card-action'" +
        "<a href=" + "'" + data[i].link + "'>" + data[i].link + "</a>" +
        "</div>");
    }
  });
}

// Calling our functions
// getUnsaved();
getSaved();
