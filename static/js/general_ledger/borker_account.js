
 $(document).ready(function(){
//قمت بفتحها بعد التأكد من عفيف انة لا تكون مخفية
    // $('#submit-button').hide();

    let form_id='#form-id';
    $(document).on('submit',form_id,function(e){
        $('#btsave').button('loading');
        e.preventDefault();
        let id_row = $('#id').val();
        $.ajax({
                url: $(this).attr('action'),
                data: $(this).serialize(),
                // data: { 'id': id_row, },
                method: 'post',
                success: function (data) {
                    $('span[class="text-danger"]').remove();
                    if(data.status==1){
                        // $(form_id)[0].reset();
                        alert_message(data.message.message,data.message.class);
                        $('#btsave').button('reset');

                    }
                    else if(data.status==2){
                        alert_message(data.message.message,data.message.class);
                        $('#btsave').button('reset');

                    }
                    else if(data.status==0){
                        alert_message(data.error,'Error');

                        let error=JSON.parse(data.error);
                        $('#btsave').button('reset');

                    }
                    $('#btsave').button('reset');

                },
                error:function(data){

                }
            });
    });


    $(document).on('change', '.select ', function () {

       // Prevent non-recurring account
       var ac_id=$(this).val()  
       var field_id=$(this).attr('id')
       var counter=0
       $('.select').each(function() {
           if ($(this).val() != '') {
               if ($(this).val() == ac_id) {
                   counter=counter+1
                   
               }
           }
       });
       
       if (counter > 1) {
           alert(message_cannot_choice_account)
           $('#'+field_id).val('')

           return false;
       }
       else{
        $('#submit-button').show();

       }

    });

});
