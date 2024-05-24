
//$(document).ready(function () {


    $(document).on('submit', form_id, function (e) {

        e.preventDefault();
        $('#submit-button').button('loading');
        $.ajax({
            url: $(this).attr('action'),
            data: $(this).serialize(),
            method: 'post',
            success: function (data) {
                $('span[class="text-danger"]').remove();
                if (data.status == 1) {
                    $(form_id)[0].reset();
                    alert_message(data.message.message, data.message.class);
                    $('#modalLRForm').modal('hide');
                    window.location.reload();
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
    
    
    $(document).on('click', '.edit_row', function () {
    
        let id_row = $(this).data('id');
        $.ajax({
            url: $(this).data('url'),
            data: { 'id': id_row, },
            method: 'get',
            success: function (data) {
                let resp = JSON.parse(data.data);
                if (data.status == 1) {
    
                    $(`input[name="id"]`).val(resp[0].pk);
                    $.each(resp[0].fields, function (i, value) {
                        $(`input[name="${i}"]`).val(value);
                        $(`select[name="${i}"] option[value="${value}"]`).attr('selected', 'selected');
                        $('#modalLRForm').modal('show');
                    });
                }
            },
            error: function (data) {
            }
        });
    });
    
    $(document).on('click', '.delete_row', function () {
    
        if (confirm_delete()) {
            let id_row = $(this).data('id');
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
    //});
    