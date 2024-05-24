


    $('#id_branch').on('change',function(){
        // LoadData();
        });
    let form_id = '#stopping_form';
    $(document).on('submit', form_id, function (e) {
        e.preventDefault();
                $.ajax({
                        url: url_is,
                        data: $(this).serialize(),
                        method: 'POST',
                        success: function (data) {
                                alert_message(data.message, data.class);
                                
                            console.log(data)
                        },
                        error:function(data){
                        alert('errors');
                        }
                    });
        });
		
