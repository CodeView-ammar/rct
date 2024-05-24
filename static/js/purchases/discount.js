
$(document).ready(function(){  
    

     
    $('input:radio[name="radio"]').change(function(){
        if (this.checked && this.value == '1') { 
            $('#div_id_supplier').show();
            $('#div_id_item_id').hide(); 
        }else if (this.checked && this.value == '2'){
            $('#div_id_item_id').show();
            $('#div_id_supplier').hide();
        }else if (this.checked && this.value == '3'){
            $('#div_id_item_id').show();
            $('#div_id_supplier').show();
        }
    });


        
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


    var supplier;
            
    $('#id_supplier').change('input',function (e){
            alert($('#id_supplier').val())
            e.preventDefault();
            $.ajax({
                    url: url_curr,
                    data: { 
                    'curr': $('#id_supplier').val(),
                    method: "get"
                    },
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("X-CSRFToken",csrf);
                    },
                    success: function (response) {
                        currency = response['curr'] ; 
                        $('#id_exchange_rate').val(currency)
                    } 
            });
    });

    var Price;
            
    $('#id_item_id').change('input',function (e){
        // alert($('#id_item_id').text())
            e.preventDefault();
            $.ajax({
                    url: url_add,
                    data: {
                    'csrfmiddlewaretoken': '{{ csrf_token }}',
                    'item': $('#id_item_id').text(),
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

