// This is to get the group number and the sub group id and concatinate them to 
//                         make the sub group

$(document).on('change', '.item_main_group_value', function () {

  $.ajax({
    url: url_get_group_item,
    data: {
      'csrfmiddlewaretoken': '{{ csrf_token }}',
      'Group_id': $(this).val(),
      method: 'get'
    },
    beforeSend: function (xhr) {
      xhr.setRequestHeader("X-CSRFToken", csrf);
    },
    success: function (response) {
      value = ("00" + response['val']).slice(-3) + '' + ("0000" + response['max_id']).slice(-5);
      $('.number_val').attr("readonly", true);
      $('.number_val').val(value);


    },
    error: function (data) {
    }
  });
});