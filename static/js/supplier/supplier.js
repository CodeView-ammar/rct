
$(document).ready(function(){
    let form_id='#form-id';
    

    $(document).on('submit',form_id,function(e){
        $('#submit-button').button('loading');

        e.preventDefault();
        $.ajax({
                url: $(this).attr('action'),
                data: $(this).serialize(),
                method: 'post',
                success: function (data) {
                    $('span[class="text-danger"]').remove();
                    if(data.status==1){
                        
                        $(form_id)[0].reset()
                        alert_message(data.message.message,data.message.class);
                        $('#modalLRForm').modal('hide');
                        table.ajax.reload();
                    }
                    else if(data.status==2){
                        alert_message(data.message.message,data.message.class);
                    }
                    else if(data.status==0){
                        let error=JSON.parse(data.error);
                        $.each(error,function(i,value){
                            let div='<span class="text-danger">';
                            $.each(value,function(j,message){
                                div+=`- ${message.message}<br>`;
                            });
                            $(`#div_id_${i}`).append(div);
                        });
                    }
                    $('#submit-button').button('reset');
                },
                error:function(data){

                }
            });
    });
$(document).on('click','.add-new-btn',function(){
  
  
    $('#modalLRForm').modal('show');
    $(form_id)[0].reset();
    $.ajax({
        url: get_max_url,
        method: 'get',
        success: function (data) {
            if(data.status==1){
                $("#id_code").val(data.data);        
            }
            else if(data.status==2){
                alert_message(data.message.message,data.message.class);
            }
            else if(data.status==0){
    
            }
        },
        error:function(data){

        }
    });

});
$(document).on('click', '.edit_row', function () {
    let id_row=$(this).data('id');

    $.ajax({
        url: $(this).data('url'),
        data: {'id':id_row,},
        method: 'get',
        success: function (data) {
            $(form_id)[0].reset();
            if(data.status==1){
            
               let resp=JSON.parse(data.data);
               let currency_dic=JSON.parse(data.currency_dic);
               $(`select[name="currency"] option`).each(function() {
                   if (currency_dic && currency_dic.length > 0 && currency_dic[0].currency_id) {
                       if ($(this).val() == currency_dic[0].currency_id) {
                          $(this).prop("selected", true);
                        }
                    }                });
                      
                    
                $(`input[name="id"]`).val(resp[0].pk);
                $.each(resp[0].fields,function(i,value){
                    $(`input[name="${i}"]`).val(value);
                    $(`input[name=${i}]`).prop('checked',value);
                    $(`textarea[name=${i}]`).text(value);
                   
                    $(`select[name="${i}"] option`).each(function() {
                        if($(this).val() == value) {
                            $(this).prop("selected", true);
                        }
                    });
                    if(data.address_data!=""){
                       let address_data=JSON.parse(data.address_data);
                   $.each(address_data[0].fields,function(i,value){
                       $(`input[name="${i}"]`).val(value);
                       $(`input[name=${i}]`).prop('checked',value);
                       $(`textarea[name=${i}]`).text(value);
                      
                       $(`select[name="${i}"] option`).each(function() {
                          if($(this).val() == value) {
                              $(this).prop("selected", true);
                          }
                      });
                     
                   });
                }
                    $('#modalLRForm').modal('show');
                });
                
            }
        
        },
        error:function(data){
        }
    });
});



$(document).on('click','.delete_row',function(){
    let id_row=$(this).data('id');

    var result = confirm(text_delete_want);
    if (result) { 
    // let id_row = $("#supplier_id").val();
   
    $.ajax({
        url: $(this).data('url'),
        data: {
            'id':id_row,
        },
        method: 'delete',
        beforeSend: function (xhr) {
                xhr.setRequestHeader("X-CSRFToken",csrf);
            },
        success: function (data) {
           
            if(data.status==1){
                
                alert_message(data.message.message,data.message.class);
                table.ajax.reload();
            }
            else if(data.status === 0){
                alert_message(data.message.message,data.message.class);

            }
          
        },
        error:function(data){
            alert_message(data.message.message,data.message.class);

            
        }
    });
}
});
});
