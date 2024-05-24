$(document).ready(function() {

    get_max_id()
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
                    get_max_id()
                    $(form_id)[0].reset();
                } else if (data.status == 2) {
                    alert_message(data.message.message, data.message.class);
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

            }
        });
    });


    $(document).on('click', '.edit_row', function() {
        let id_row = $(this).data('id');
        $.ajax({
            url: $(this).data('url'),
            data: { 'id': id_row, },
            method: 'get',
            success: function(data) {
                let resp = JSON.parse(data.data);
                if (data.status == 1) {

                    $(`input[name="id"]`).val(resp[0].pk);
                    $.each(resp[0].fields, function(i, value) {
                        $(`input[name="${i}"]`).val(value);
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
            //  alert(id_row)
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
                    // alert('success')

                    //  if(data.status==1){
                    alert_message(data.message.message, data.message.class);
                    table.ajax.reload();
                    //  }
                },
                error: function(data) {
                    alert('error')
                }
            });
        }
    });
    $(document).on('click', '.add-new-btn', function() {
        get_max_id()
    });

    $('#modalLRForm').on('hidden.bs.modal', function(e) {
        $('#form-id')[0].reset();
        $(`textarea`).text('');

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