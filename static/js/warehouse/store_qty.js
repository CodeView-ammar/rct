$(document).ready(function(){
     // $( "#datepicker" ).datepicker();
    let form_id = "#form-id-store-qty";
  

    $(document).on('submit',form_id,function(e){
        $('#store-qty-submit-button').button('loading');
        e.preventDefault();
        $.ajax({
                url: $(this).attr('action'),
                data: $(this).serialize(),
                method: 'post',
                success: function (data) {
                    $('span[class="text-danger"]').remove();
                    if(data.status===1){
                        $(form_id)[0].reset();
                        alert_message(data.message.message,data.message.class,'fa fa-plus');
                        $('#store_qty_available').modal('hide');
                        table.ajax.reload();
                    }
                    else if(data.status===2){
                        alert_message(data.message.message,data.message.class,'fa fa-times');
                    }
                    else if(data.status===0){
                        let error=JSON.parse(data.error);
                        $.each(error,function(i,value){
                            let div='<span class="text-danger">';
                            $.each(value,function(j,message){
                                div+=`- ${message.message}<br>`;
                            });
                            $(`#div_id_${i}`).append(div);
                        });
                    }
                    $('#store-qty-submit-button').button('reset');
                },
                error:function(data){

                }
            });
            table.ajax.reload();

    });

$(document).on('click','.edit_expiration_date',function(){

    let id_row=$(this).data('id'); 
    $.ajax({
        url: $(this).data('url'),
        data: {'store_qty_id':id_row,},
        method: 'get',
        success: function (data) {
            let resp=JSON.parse(data.qty_data);
            if(data.status ===1){
                document.querySelector('#store-qty-submit-button').textContent  = Update;
                $('#form-id-store-qty').trigger("reset");
                $(`input[name="store_qty_id"]`).val(resp[0].pk);
                $.each(resp[0].fields,function(i,value){
                    $(`input[name="${i}"]`).val(value);
                    // $(`select[name="${i}"] option[value="${value}"]`).attr('selected','selected');
                    $(`select[name="${i}"]`).val(value);
                    $('#store_qty_available').modal('show');
                });
              

            }
            else if(data.status === 3){
                alert_message(data.message.message,data.message.class,data.message.icon);
            }
            else if(data.status === 2){
                alert_message(data.message.message,data.message.class,data.message.icon);
            }
            else if(data.status === 0){
                alert_message(data.message.message,data.message.class,data.message.icon);
            }
        },
        error:function(data){
        }
    });
    table.ajax.reload();

});

});

