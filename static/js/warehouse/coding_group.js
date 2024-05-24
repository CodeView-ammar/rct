          // This is to get the group number and the sub group id and concatinate them to
//                         make the sub group

$(document).on("change", ".main_group_val", function () {

  $.ajax({
    url: url_get,
    data: {
      csrfmiddlewaretoken: "{{ csrf_token }}",
      Group_id: $(this).val(),
      method: "get",
    },
    beforeSend: function (xhr) {
      xhr.setRequestHeader("X-CSRFToken", csrf);
    },
    success: function (response) {


      value =
        ("00" + response["val"]).slice(-3) +
        "" +
        ("00" + response["max_id"]).slice(-3);
      $(".code_number_val").attr("readonly", true);
      $(".code_number_val").val(value);
    },
    error: function (data) { },
  });
});

$(document).ready(function () {
  let form_id_main = "#form_id_main";
  // let form_id = '#form-id';
  $(document).on("submit", form_id_main, function (e) {
    // $('#submit-button').button('loading');

    e.preventDefault();
    $.ajax({
      url: $(this).attr("action"),
      data: $(this).serialize(),
      method: "post",
      success: function (data) {
        $('span[class="text-danger"]').remove();
        // $(".clear_model").trigger("click");
        if (data.status == 1) {
          $(form_id)[0].reset();
          alert_message(data.message.message, data.message.class);
          $("#modalLRForm").modal("hide");
          table.ajax.reload();
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

  let form_id = "#form-id";
  $(document).on("submit", form_id, function (e) {
    
    // $('#submit-button').button('loading');
    e.preventDefault();
    $.ajax({
      url: $(this).attr("action"),
      data: $(this).serialize(),
      method: "post",
      success: function (data) {
        $('span[class="text-danger"]').remove();
        // $(".clear_model").trigger("click");
        if (data.status == 1) {
          
          $(form_id)[0].reset();
          alert_message(data.message.message, data.message.class);
          $("#modalLRForm").modal("hide");
          table.ajax.reload();
        } else if (data.status == 2) {
          alert_message(data.message.message, data.message.class);
        } else if (data.status == 0) {
          let error = JSON.parse(data.error);
          $.each(error, function (i, value) {
            let div = '<span class="text-danger">';
            $.each(value, function (j, message) {
              div += `- ${message.message}<br>`;
            });
          alert("alskd");

            $(`#div_id_${i}`).append(div);
          });
        }
        $("#submit-button").button("reset");
      },
      error: function (data) { },
    });
  });


  $(document).on("submit", form_id_main, function (e) {
    // $('#submit-button').button('loading');

    e.preventDefault();
    $.ajax({
      url: $(this).attr("action"),
      data: $(this).serialize(),
      method: "post",
      success: function (data) {
        
        $('span[class="text-danger"]').remove();
        // $(".clear_model").trigger("click");

      
        if (data.status == 1) {

          $(form_id_main)[0].reset();
          alert_message(data.message.message, data.message.class);
          $("#modalLRForm1").modal("hide");
          table.ajax.reload();
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

  $(document).on("click", ".clear_model", function () {
    $('span[class="text-danger"]').remove();
    $("#submit-button").text(Save);
    $("#form-id")[0].reset();
    $("#div_id_exchange_rate").hide();
    $("#div_id_lowest_conversion_rates").hide();
    $("#div_id_highest_conversion_rate").hide();

    // $(".modal").trigger('reset');

    // alert('your wellcome');
    return;
  });
  $(document).on("click", ".edit_row", function () {
    $('span[class="text-danger"]').remove();
    let id_row = $(this).data("id");
    $.ajax({
      url: $(this).data("url"),
      data: { id: id_row },
      method: "get",
      success: function (data) {
        if (data.status == 1) {
          let resp = JSON.parse(data.data);
          let main_group = data.data1.main_group;
          let main_group_optoin = `<option selected value="${main_group.id}">${main_group.name}</option>`;
          // $("#id_main_group ").append(main_group_optoin);

          $(`input[name="id"]`).val(resp[0].pk);
          $.each(resp[0].fields, function (i, value) {
            $(`input[name="${i}"]`).val(value);
            $(`input[name=${i}]`).prop("checked", value);
            $(`textarea[name=${i}]`).text(value);
            
            $(`select[name="${i}"] option`).each(function () {
              
              if ($(this).val() == value) {
                $(this).prop("selected", true);
              }
            });
            $("#modalLRForm").modal("show");
          });
        }
      },
      error: function (data) { },
    });
  });

  $(document).on("click", ".delete_row", function () {
    if (confirm_delete()) {
      let id_row = $(this).data("id");

      $.ajax({
        url: $(this).data("url"),
        data: {
          id: id_row,
        },
        method: "DELETE",
        beforeSend: function (xhr) {
          xhr.setRequestHeader("X-CSRFToken", csrf);
        },
        success: function (data) {
          if (data.status == 1) {
            alert_message(data.message.message, data.message.class);
            table.ajax.reload();
          }
        },
        error: function (data) { },
      });
    }
  });

  $(document).on("click", ".delete_", function () {
    if (confirm_delete()) {
      let id_row = $(this).data("id");

      $.ajax({
        url: $(this).data("url"),
        data: {
          id: id_row,
        },
        method: "GET",

        success: function (data) {
          if (data.status == 1) {
            alert_message(data.message.message, data.message.class);
            table.ajax.reload();
          }
        },
        error: function (data) { },
      });
    }
  });
});
