
maxnumber =()=>{

  $.ajax({
      method: "post",
      url:url_max_number,
      data: {
        'csrfmiddlewaretoken': csrf,
          
       }, // data sent with the delete request
      
      success: function(data) {
        var count_number='';
        count_number=data.data.number__max;
        
        if(count_number){
            $("#id_number").val(parseInt(count_number)+1);
        }else
        {
            $("#id_number").val("1");
        }
        },
      error: function(data) {
          alert('error in onchange');
      }
  });

};
// run method
// maxnumber();


// ---------------------------------
//-------------------------

// This code to hide the last sales date and make the registered date read only
    


//  $(document).ready(function(){
    let form_id_='#form-id';
    $(document).on('submit',form_id_,function(e){
        // $('#submit-button').button('loading');
        e.preventDefault();
        $.ajax({
                url: $(this).attr('action'),
                data: $(this).serialize(),
                method: 'post',
                success: function (data) {
                    $('span[class="text-danger"]').remove();
                    if(data.status==1){
                        $(form_id_)[0].reset();
                        
                        alert_message(data.message.message,data.message.class,0);
                        $("#id_number").val(data.max_number);
                        
                        table.ajax.reload();
                        
                        $('#modalLRForm').modal('hide');
                        $('.modal-backdrop').remove(); 
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
$(document).on('click','.edit_row',function(){
    
    let id_row=$(this).data('id');
    $.ajax({
        url: $(this).data('url'),
        data: {'id':id_row,},
        method: 'get',
        success: function (data) {
            $("#form-id")[0].reset();
            if(data.status==1){
                if(data.currency_dic){
                let currency_dic=JSON.parse(data.currency_dic);
                $(`select[name="currency"] option`).each(function() {
                    if (currency_dic && currency_dic.length > 0 && currency_dic[0].currency_id) {
                        if ($(this).val() == currency_dic[0].currency_id) {
                          $(this).prop("selected", true);
                        }
                      } 
                    });
                }

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
                    
                });
                if(data.address_data!=""){
                
                $.each(JSON.parse(data.address_data)[0].fields,function(i,value){
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
             }
        },
        error:function(data){
        }
    });
});

$(document).on('click','.delete_row',function(){
   
    if(confirm_delete()){
    let id_row=$(this).data('id');
    $.ajax({
        url: $(this).data('url'),
        data: {
            'id':id_row,
        },
        method: 'DELETE',
        beforeSend: function (xhr) {
                xhr.setRequestHeader("X-CSRFToken",csrf);
            },
        success: function (data) {
           
            if(data.status==1){
                alert_message(data.message.message,data.message.class);
                table.ajax.reload();

                maxnumber();

            }
         
        },
        error:function(data){
        }
    });
}
});
// });
