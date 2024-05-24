$(document).ready(function() {
    get_max_id()
    $('#modalLRForm').on('hidden.bs.modal', function(e) {
        $('#form-id')[0].reset();
        $(`textarea`).text('');
        $('span[class="text-danger"]').remove();

    });
    let form_id = '#form-id';
    $(document).on('submit', form_id, function(e) {

        e.preventDefault();
        $.ajax({
            url: form_url,
            data: $(this).serialize(),
            method: 'POST',
            success: function(data) {

                $('span[class="text-danger"]').remove();
                if (data.status == 1) {
                    $(`textarea`).text('');
                    
                    alert_message(data.message.message, data.message.class, 0);
                    $('#modalLRForm').modal('hide');
                    table.ajax.reload();
                    $('#submit-button').button('reset');
                    get_max_id()
                    $(form_id)[0].reset();
                } else if (data.status == 2) {
                    alert_message(data.message.message, data.message.class, 0);
                } else if (data.status == 0) {
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
                alert('fail');

            }
        });
    });


    $(document).on('click', '.edit_row', function() {

        let id_row = $(this).data('id');
        2
        $.ajax({
            url: $(this).data('url'),
            data: { 'id': id_row, },
            method: 'get',
            success: function(data) {
                if (data.status == 1) {

                    let resp = JSON.parse(data.data);
                    $(`input[name="id"]`).val(resp[0].pk);
                    $.each(resp[0].fields, function(i, value) {
                        if (value != 'True') {
                            $(`input[name="${i}"]`).val(value);
                        }
                        $(`input[name=${i}]`).prop('checked', value);
                        $(`textarea[name=${i}]`).text(value);

                        $(`select[name="${i}"] option`).each(function() {
                            if ($(this).val() == value) {
                                $(this).prop("selected", true);
                            }
                        });
                        $('#modalLRForm').modal('show');
                    });
                }
            },
            error: function(data) {}
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
                },
                error: function(data) {}
            });
        }
    });

    $(document).on('click', '#btn_new_2', function() {
        get_max_id()
    });


    function get_max_id() {
        // alert('g')
        $.ajax({
            url: mix_url_id,
            data: { 'afeef': 'type' },
            method: "GET",

            success: function(data) {
                // alert('Afeef')
                // alert(data.id)
                $('input[name="number"]').val(data.id);
            },
            error: function() {},
        });
    }
});