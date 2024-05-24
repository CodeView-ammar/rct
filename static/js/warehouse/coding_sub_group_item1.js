          
// This is to get the group number and the sub group id and concatinate them to 
//                         make the sub group

$(document).on('change', '.item_sub_group_value ', function () {
  $.ajax({
    url: url_get_sub_group_item1,
    data: {
      'csrfmiddlewaretoken': '{{ csrf_token }}',
      'sub_group': $(this).val(),
      'Group_id': $('.item_main_group_value').val(),
      method: 'get'
    },
    beforeSend: function (xhr) {
      xhr.setRequestHeader("X-CSRFToken", csrf);
    },
    success: function (response) {
      value = ("00000" + response['val']).slice(-6) + '' + ("0000" + response['max_id']).slice(-5);
      $('.number_val').attr("readonly", true);
      $('.number_val').val(value);


    },
    error: function (data) {
    }
  });
});
