
$(document).ready(function() {
   
    let form_id = '#form-id';
    $(document).on('submit', form_id, function(e) {
        $('#submit-button').button('loading');
        e.preventDefault();
        $.ajax({
            url: $(this).attr('action'),
            data: $(this).serialize(),
            method: 'post',
            success: function(data) {
                $('span[class="text-danger"]').remove();
                if (data.status == 1) {
                    
                    alert_message(data.message.message, data.message.class);
                    $('#modalLRForm').modal('hide');
                    table.ajax.reload();
                    $(form_id)[0].reset();
                } else if (data.status == 2) {
                    alert_message(data.message.message, data.message.class);
                } else if (data.status == 0) {
                    $("#id_password").val("");
                    $("#id_confirm_password").val("");
                    let error = JSON.parse(data.error);
                    $.each(error, function(i, value) {
                        let div = '<span class="text-danger">';
                        $.each(value, function(j, message) {
                            div += `- ${message.message}<br>`;
                        });
                        $(`#div_id_${i}`).append(div);
                    });
                }
                $('#submit-button').button('reset');
            },
            error: function(data) {

            }
        });
    });

    $(document).on('click', '.delete_row', function() {

        if (confirm_delete()) {
            let id_row = $(this).data('id');
            $.ajax({
                url: $(this).data('url'),
                data: {
                    'id': id_row,
                },
                method: 'DELETE',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("X-CSRFToken", csrf);
                },
                success: function(data) {

                    if (data.status == 1) {
                        alert_message(data.message.message, data.message.class);
                        table.ajax.reload();
                    }
                    if (data.status == 0) {
                        alert_message(data.message.message, data.message.class);
                        table.ajax.reload();
                    }

                },
                error: function(data) {}
            });
        }
    });
});
$(document).ready(function() {

    $(document).on('click', '.edit_row1', function() {
        let id_row = $(this).data('id');
        let data_url=$(this).data('url');
       
        $.ajax({
            url: data_url,
            data: { 'id': id_row, },
            method: 'get',
            success: function(data) {


                if (data.status == 1) {
                    let resp = JSON.parse(data.data);
                    
                    // alert();


                
                           
                    $(`input[name="id"]`).val(resp[0].pk);
                    $.each(resp[0].fields, function(i, value) {
                        $(`input[name="${i}"]`).val(value);
                        $(`select[name="${i}"] option[value="${value}"]`).attr('selected', 'selected');
                        // $('#modalLRForm').modal('show');
                        $('.nav-item a[href="#tab-eg7-0"]').tab('show');
                        $(`input[name="password"]`).val("");
                             
                        
                    });
                    $("#id_user_permission_group").val(data.mselect_permissiongroup);
                    $("#id_user_branch").val(data.mselect_branch);
                    $("#id_type_device").val(data.mselect_TypeDevice);
                    

                    $('#id_active').prop('checked', resp[0].fields.active);
                    
                    control_button(false);
                    func_btn_update("1");
                    func_btn_new("1");
    
                    
                 
                    


                }

             
            },
            error: function(data) {

            }
        });
    });
    
    $('#modalLRForm').on('hidden.bs.modal', function(e) {
        alert("sss");

        $('#hello').html('');

    });
});
