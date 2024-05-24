
  $(document).ready(function () {
    $('#stop_submit').hide();
    // $('#id_periods_drop_dawn').on('change',function(){
    // // e.preventDefault();
    $("#id_periods_drop_dawn").trigger("change");
 $('#tableAccounts').hide();
 LoadData();
 $('#checkall').attr('Disabled','Disabled');
 
$('#id_difference_currency').on('click', function () {

        if ($(this).prop("checked")) { 
            $('#tableAccounts').show();
            
            $('#checkall').removeAttr('Disabled');
        } 
        else { 
            $('#tableAccounts').hide();
            $('#checkall').attr('Disabled','Disabled');

        } 
});

$(".checkall").click(function(){
    $('.list_currency').not(this).prop('checked', this.checked);
});
          
        
    // });
    function LoadData(){
        $.ajax({
            url: url_is,
            data: 'branch_id='+$('#id_branch').val()+'&csrfmiddlewaretoken='+$('input[name="csrfmiddlewaretoken"]').val(), 
            method: 'POST',
            success: function (data) {
                $('#stopping').html(data);
            $('#stop_submit').show();
            },
            error:function(data){
            alert('errors');
            }
        });
    }

    $('#id_branch').on('change',function(){
        LoadData();
        });
     form_id = '#stopping_form';
    $(document).on('submit', form_id, function (e) {
        e.preventDefault();
       
        $('.is_colsed').each(function () {
            // alert('Afeef')
            $(this).removeAttr('disabled');
            $(this).removeAttr('readonly');
        });
                $.ajax({
                        url: url_is,
                        data: $(this).serialize(),
                        method: 'POST',
                        success: function (data) {
                            console.log(data)
                           
                            // if (data.status == 1) {
                            //     $(form_id)[0].reset();}
                            
                                alert_message(data.message, data.class);
                                LoadData();
                            // }
                            // else if (data.status == 2) {
                            //     alert_message(data.message.message, data.message.class);
                            //     $('#btsave').button('reset');
                            // }
                            // console.log(data)
                        // $('#stopping').html(data);
                        },
                        error:function(data){
                        alert('errors');
                        }
                    });
        });

});




