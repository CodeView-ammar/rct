
 
$(document).ready(function(){  
  

        
    var bo; 
    $('#id_ratio_amount').click(function (e){
        // alert("55555555555555")
        $('#id_the_value').attr('readonly', true).val("");
        $('#id_ratio_amount').attr('readonly', false);
        bo = 0;
    });
    $('#id_the_value').click(function (e){    
        $('#id_ratio_amount').attr('readonly', true).val("");
        $('#id_the_value').attr('readonly', false);
        bo = 1;
    });

  
    var Price;
            
    $('#id_item_id').change('input',function (e){
        // alert($('#id_item_id').val())
            e.preventDefault();
            $.ajax({
                    url: url_add,
                    data: {
                    'csrfmiddlewaretoken': '{{ csrf_token }}',
                    'item': $('#id_item_id').val(),
                    method: "get"
                    },
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("X-CSRFToken",csrf);
                    },
                    success: function (response) {
                        Price = response['price'] ; 
                    } 
            });
    });

    $('#id_exchange_rate').on('keyup change',function (e){
        if(bo == 1){
            var exchange_rate = $('#id_exchange_rate').val() * $('#id_the_value').val();
            $('#id_dis').val(exchange_rate);
        }
    });

    $('#id_ratio_amount').on('keyup change',function (e){
         if(bo == 0){
             var ratio_amount =  $('#id_ratio_amount').val();
             $('#id_dis').val( (ratio_amount * Price) / 100) ;
         } 
     });



         
});


// $(document).on('change', ".currency_val", function () {
//            // Get exchange_rate 
//     var url = "{% url 'load_exchange_rate' %} "; // get the url of the `get_exchange_rate_currency` view
//     var currencys = $(this).val(); // get the selected currency ID from the HTML input
//     $.ajax({
//         method: "post", // initialize an AJAX request
//         url: url,
//         data: {
//             'currencys': currencys,
//             'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
//         },
//         success: function (data, status) {
//             var option;
//             $.each(data, function (index, itemData) {
               
//                 $('.exchange_rate_val').html("")
//                 $('.exchange_rate_val').val(itemData)
//             });
//             alert(itemData)

//         }
//     });


// });