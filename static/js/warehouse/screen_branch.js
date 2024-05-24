          // This is to get the group number and the sub group id and concatinate them to
//                         make the sub group

$(document).ready(function () {

  let dialog_form_id = "#dialog_form-id";
  $(document).on("submit", dialog_form_id, function (e) {
    e.preventDefault();
    $.ajax({
      url: $(this).attr("action"),
      data: $(this).serialize(),
      method: "post",
      success: function (data) {

        $('span[class="text-danger"]').remove();
        if (data.status == 1) {
          $(dialog_form_id)[0].reset();
          $("#modalLRForm1").modal("hide");
          return;
        } else if (data.status == 2) {
          alert_message(data.message.message, data.message.class);
        } else if (data.status == 0) {
          let error = JSON.parse(data.error);
          $.each(error, function (i, value) {
            let div = '<span class="text-danger">';
            $.each(value, function (j, message) {
              div += `- ${message.message}<br>`;
            });
            $(`#div_id_${i}`).append(div);
          });
        }
        $("#submit-button").button("reset");
      },
      error: function (data) { },
    });
  });
});
// This is to get the group number and the sub group id and concatinate them to
//                         make the sub group
$(document).ready(function () {

  let dialog_form_id = "#dialog_form-id2";
  $(document).on("submit", dialog_form_id, function (e) {
    // $('#submit-button').button('loading');
    e.preventDefault();
    $.ajax({
      url: $(this).attr("action"),
      data: $(this).serialize(),
      method: "post",
      success: function (data) {

        $('span[class="text-danger"]').remove();
        if (data.status == 1) {
          $(dialog_form_id)[0].reset();
          $("#modalLRForm3").modal("hide");
          return;
        } else if (data.status == 2) {
          alert_message(data.message.message, data.message.class);
        } else if (data.status == 0) {
          let error = JSON.parse(data.error);
          $.each(error, function (i, value) {
            let div = '<span class="text-danger">';
            $.each(value, function (j, message) {
              div += `- ${message.message}<br>`;
            });
            $(`#div_id_${i}`).append(div);
          });
        }
        $("#submit-button").button("reset");
      },
      error: function (data) { },
    });
  });
});


$(document).ready(function () {
  let dialog_form_id1 = "#dialog_form-id1";
  $(document).on("submit", dialog_form_id1, function (e) {
    e.preventDefault();
    $.ajax({
      url: $(this).attr("action"),
      data: $(this).serialize(),
      method: "post",
      success: function (data) {


        $('span[class="text-danger"]').remove();
        if (data.status == 1) {
          $(dialog_form_id1)[0].reset();
          $("#modalLRForm2").modal("hide");
          return;
        } else if (data.status == 2) {
          alert_message(data.message.message, data.message.class);
        } else if (data.status == 0) {
          let error = JSON.parse(data.error);
          $.each(error, function (i, value) {
            let div = '<span class="text-danger">';
            $.each(value, function (j, message) {
              div += `- ${message.message}<br>`;
            });
            $(`#div_id_${i}`).append(div);
          });
        }
        $("#submit-button").button("reset");
      },
      error: function (data) { },
    });
  });
});

$(document).ready(function () {

  let dialog_form_id = "#dialog_form-id3";
  $(document).on("submit", dialog_form_id, function (e) {
    e.preventDefault();
    $.ajax({
      url: $(this).attr("action"),
      data: $(this).serialize(),
      method: "post",
      success: function (data) {


        $('span[class="text-danger"]').remove();
        if (data.status == 1) {
          $(dialog_form_id)[0].reset();
          $("#modalLRForm4").modal("hide");
          return;
        } else if (data.status == 2) {
          alert_message(data.message.message, data.message.class);
        } else if (data.status == 0) {
          let error = JSON.parse(data.error);
          $.each(error, function (i, value) {
            let div = '<span class="text-danger">';
            $.each(value, function (j, message) {
              div += `- ${message.message}<br>`;
            });
            $(`#div_id_${i}`).append(div);
          });
        }
        $("#submit-button").button("reset");
      },
      error: function (data) { },
    });
  });
});