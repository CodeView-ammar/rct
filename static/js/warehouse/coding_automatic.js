          
// This is to get the group number and the sub group id and concatinate them to 
//                         make the sub group

// $(document).on('click','#btn_show_model_group_main',function() {
//   $.ajax({
//       url: url_get,


//     method: 'get',


//       success: function (response) {
//             value=("00" + response['max_id']).slice(-3);
//         $('.number_code_value').attr("readonly",true);
//         $('.number_code_value').val(value);


//       },
//       error:function(data){
//       }
//   });
// });
// function btn_show_model_group_main(){
//   alert('hhhhhhhhh');
function automatic_coding(a) {
  $.ajax({
    url: url_get1,


    method: 'get',


    success: function (response) {

      value = ("00" + response['max_id']).slice(-3);
      
      $(a).attr("readonly", true);
      $(a).val(value);


    },
    error: function (data) {
    }
  });

}

