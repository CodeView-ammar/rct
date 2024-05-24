

$(document).ready(function(){
    $('#id_effect_type').on('change',function(){
            
          let choes= $(this).val();
    if(choes==='1'){
    $('#f_by_item').removeClass('hidden');
    $('#f_by_bill').addClass('hidden');}
    if(choes==='2'){
    $('#f_by_bill').removeClass('hidden');
    $('#f_by_item').addClass('hidden');}

    

});
    
    
    let form_id='#f';
    $(document).on('submit',form_id,function(e){
        $('#s').button('loading');
        e.preventDefault();
        $.ajax({
            url: $(this).attr('action'),
            data: $(this).serialize(),
            method: 'post',
            success: function (data) {
                $('span[class="text-danger"]').remove();
                if(data.status==1){
                    $(form_id)[0].reset();
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
                $('#s').button('reset');
            },
            error:function(data){

            }
        });
    });
$(document).on('click','.edit_row',function(){
    let id_row=$(this).data('id');
    
    $.ajax({
        url: $(this).data('url'),
        data: {'id':id_row,},
        method: 'get',
        success: function (data) {
            if(data.status==1){
               
               let resp=JSON.parse(data.data);
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
                    $('#modalLRForm').modal('show');
                });
            }
        },
        error:function(data){
        }
    });
});

$(document).on('click','.delete_row',function(){
   
   var result = confirm("هل حقا تريد الحذف؟");
    if (result) { 
   
    let id_row=$(this).data('id');
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
         
        },
        error:function(data){
        }
    });
}
});
});
