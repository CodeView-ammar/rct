          // using jQuery
function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie != "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = jQuery.trim(cookies[i]);
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) == name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
var csrftoken = getCookie("csrftoken");
function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return /^(GET|HEAD|OPTIONS|TRACE)$/.test(method);
}
$.ajaxSetup({
  beforeSend: function (xhr, settings) {
    if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
      xhr.setRequestHeader("X-CSRFToken", csrftoken);
    }
  },
});
let form_id = "#myform";
$(document).on("submit", "#myform", function (e) {
  e.preventDefault();
  console.log($("#myform").serialize());
  $.ajax({
    url: $(this).attr('action'),
    data: $("#myform").serialize(),
    method: "POST",
    contentType: false,
    processData: false,
   
    success: function (data) {
      
      $('span[class="text-danger"]').remove();
      if (data.status == 1) {
        $("#myform")[0].reset();
        alert_message(data.message.message, data.message.class);
        $("#load_item_qty").children().remove();
        table.ajax.reload();
        $("#Previous_repo").modal('hide');
        print_custom("item inventory Report", "iteminventory", data.id);

      } else if (data.status == 2) {
        $.each(data.error, function () {
          let form = $(this)[0].form_id;
          $(`#id_${form}-item`).parents(".item").css("outline", "red auto");
          alert_message($(this)[0].message, "alert alert-danger");
        });
      }
      else if (data.status == 0) {
        if (data.message.message != "") {
          alert_message(data.message.message, data.message.class);
        }
        let row_id = data.error.form_id;
        let error = JSON.parse(data.error.error);
        $.each(error, function (i, value) {
          let div = '<span class="text-danger">';
          $.each(value, function (j, message) {
            div += `- ${message.message}<br>`;
          });
          $(`#id_${row_id}-${i}`).parent().append(div);
          $(`#div_id_${i}`).append(div);
        });
      }
      else if (data.status == 3) {
        if (data.message != "") {
          alert_message(data.message, "alert alert-danger");
        }
      }
      $("#submit-button").button("reset");
    },
    error: function (data) {
      alert('check input values');
    },
  });
});
