          

$(document).ready(function () {

    let form_id = '#form-id';
    $(document).on('submit', form_id, function (e) {
        
        // $('#submit-button').button('loading');
        e.preventDefault();
        $.ajax({
            url: $(this).attr('action'),
            data: $(this).serialize(),
            method: 'post',
            success: function (data) {

                $('span[class="text-danger"]').remove();
                // $('.clear_model').trigger('click');
                if (data.status == 1) {
                    $(form_id)[0].reset();
                    alert_message(data.message.message, data.message.class);
                    $('#modalLRForm').modal('hide');
                    table.ajax.reload();
                    $('.nav-item a[href="#tab-eg7-0"]').tab('show');
                }
                else if (data.status == 2) {
                    alert_message(data.message.message, data.message.class);
                 
                    
                }
                else if (data.status == 0) {
                    let error = JSON.parse(data.error);
                    $.each(error, function (i, value) {
                        let div = '<span class="text-danger">';
                        $.each(value, function (j, message) {
                            div += `- ${message.message}<br>`;
                        });
                        $(`#div_id_${i}`).append(div);
                        
                    });
                }
                $('#submit-button').button('reset');

            },
            error: function (data) {

            }
        });
    });
    let form_id1 = '#form-id1';
    $(document).on('submit', form_id1, function (e) {
      
        // $('#submit-button').button('loading');
        e.preventDefault();
        $.ajax({
            url: $(this).attr('action'),
            data: $(this).serialize(),
            method: 'post',
            success: function (data) {

                $('span[class="text-danger"]').remove();
                // $('.clear_model').trigger('click');
                if (data.status == 1) {
                    // $(form_id1)[0].reset();
                    $('#modalLRForm1').modal('hide');
                    // alert_message(data.message.message, data.message.class);
                    return

                }
                else if (data.status == 2) {
                    alert_message(data.message.message, data.message.class);
                }
                else if (data.status == 0) {
                    let error = JSON.parse(data.error);
                    $.each(error, function (i, value) {
                        let div = '<span class="text-danger">';
                        $.each(value, function (j, message) {
                            div += `- ${message.message}<br>`;
                        });
                        $(`#div_id_${i}`).append(div);
                    });
                }
                // $('#submit-button').button('reset');

            },
            error: function (data) {

            }
        });
    });
    $(document).on('click', '.clear_model', function () {

       // $('#submit-button').text('Save');
        $("#form-id")[0].reset();
        // $('select option:selected').removeAttr('selected');
        // $('select').children("option").remove();
        $('.account_value').children("option").remove();
        // $('#id_store_group').children("option").remove();
        $('#div_id_exchange_rate').hide();
        $('#div_id_lowest_conversion_rates').hide();
        $('#div_id_highest_conversion_rate').hide();
        $('span[class="text-danger"]').remove();
        return
    });
    $(document).on('click', '.edit_row', function () {
        
        $('span[class="text-danger"]').remove();
       
        let id_row = $(this).data('id');
        $.ajax({
            url: $(this).data('url'),
            data: { 'id': id_row, },
            method: 'get',
            success: function (data) {
                if (data.status == 1) {
                    let resp = JSON.parse(data.data);
                    let account = data.data1.account.account;
                    let account_optoin = `<option selected value="${account.id}">${account.name}</option>`;
                    $('#id_account').append(account_optoin);

                    let group = data.data1.group.group;
                    let group_optoin = `<option selected value="${group.id}">${group.name}</option>`;
                    $('#id_store_group').append(group_optoin);

                    $(`input[name="id"]`).val(resp[0].pk);
                    $.each(resp[0].fields, function (i, value) {
                     
                        $(`input[name="${i}"]`).val(value);
                        $(`input[name=${i}]`).prop('checked', value);
                        $(`textarea[name=${i}]`).text(value);
                        $(`select[name="${i}"] option`).each(function () {
                            if ($(this).val() == value) {
                                $(this).prop("selected", true);
                            }
                        });
                        // $('#modalLRForm').modal('show');
                        // $("#btn_update").removeAttr('disabled');
                    });
                    control_button(true);
                    func_btn_update("1");
                    func_btn_delete("1");
                    func_btn_new("1");
                    $('.nav-item a[href="#tab-eg7-0"]').tab('show');
                }
            },
            error: function (data) {
            }
        });
    });

      
    $(document).on('click', '.delete_row,#btn_delete', function () {


        if (confirm_delete()) {
            let id_row = "";
            if($(this).data('id')){
                id_row=$(this).data('id');
            }
            if($(this).data('id'))
                id_row=$(this).data('id');
            else{
            alert("يجب إختيار المخزن المراد حذفة");
            return 0;     
            }
            $.ajax({
                url: $(this).data('url'),
                data: {
                    'id': id_row,
                },
                method: 'DELETE',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("X-CSRFToken", csrf);
                },
                success: function (data) {
                    if (data.status == 1) {
                        alert_message(data.message.message, data.message.class);
                        table.ajax.reload();
                    }
                },
                error: function (data) {
                }
            });
        }
    });


});
