$(document).ready(function(){

    function maxnumber(){
        $.ajax({
      method: "post",
      url:url_max_number,
      data: {
        'csrfmiddlewaretoken': csrf,
          
       }, // data sent with the delete request
      
      success: function(data) {
        var count_number=parseInt(data.data.EmployeeRecordNumber__max);
         
    if(count_number>0){
  
        $("#id_number").val(count_number+1);
    }else
    {
    $("#id_number").val("1");
    }
},
      error: function(data) {
          alert('error in onchange');
      }
  });
  }
  
  maxnumber();
  
});

// ---------------------------------
//-------------------------

// This code to hide the last sales date and make the registered date read only
   
//  $(document).ready(function(){
    
    $(document).on('submit','#form-id',function(e){
        $('#submit-button').button('loading');
        e.preventDefault();
        $.ajax({
                url: $(this).attr('action'),
                data: $(this).serialize(),
                method: 'post',
                success: function (data) {
                    $('span[class="text-danger"]').remove();
                    if(data.status==1){
                        $('#form-id')[0].reset();
                       
                        alert_message(data.message.message,data.message.class,0);
                        table.ajax.reload();
                        maxnumber();
                        $('#modalLRForm').modal('hide');
                        // setInterval( function () {
                        //     table.ajax.reload();
                        // }, 30000 );
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
            let resp=JSON.parse(data.data);
            if(data.status==1){
                
                $(`input[name="id"]`).val(resp[0].pk);
                $.each(resp[0].fields,function(i,value){
                    $(`input[name="${i}"]`).val(value);
                    $(`select[name="${i}"] option[value="${value}"]`).attr('selected','selected');
                    $('#modalLRForm').modal('hide');
                    
                });
                setTimeout(function () {
                    $(iddd).prop("disabled", true);
                    control_button(true);
                    func_btn_update("1");
                    func_btn_print("1");
                    func_btn_delete("1");
                    func_btn_new("1");
                  }, 1000);
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
