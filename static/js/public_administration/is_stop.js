
  $(document).ready(function () {
    $('#stop_submit').hide();
    // $('#id_periods_drop_dawn').on('change',function(){
    // // e.preventDefault();
    $("#id_periods_drop_dawn").trigger("change");

 LoadData();


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
    let form_id = '#stopping_form';
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

                                alert_message(data.message, data.class);
                                LoadData();
                        },
                        error:function(data){
                        alert('errors');
                        }
                    });
        });

 });

