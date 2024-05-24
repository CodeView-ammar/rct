
          `{% load static%} {% load i18n %}`
$(document).ready(function () {
    let form_id = '#form-id1';
    // $('#modalLRForm').modal('show');
    //let model_id = '#modalLRForm';

    $(document).on('submit', form_id, function (e) {
        $('#submit-button').button('loading');
        e.preventDefault();
        $.ajax({
            url: $(this).attr('action'),
            data: $(this).serialize(),
            method: 'post',
            success: function (data) {
                $('span[class="text-danger"]').remove();
                if (data.status == 1) {


                    $(form_id)[0].reset();
                    // print("aaaaaaaaaaaaaa");
                    alert_message(data.message.message, data.message.class);
                    $('#modalLRForm').modal('hide');
                    table.ajax.reload();
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
    $(document).on('click', '#eee', function () {
        // alert('1')
        // $('#modalLRForm').modal('show');
        // alert('Afeef')

        $(`#id_account`).children("option").remove();
        $('#delete_this').addClass('hidden');
        $(form_id)[0].reset();
        clearForm()

    });

    function clearForm() {
        let form_id = '#form-id1';
        $(form_id)[0].reset();

        $(`#id_account`).children("option").remove();

    }
    $(document).on('dblclick', '.show_Operation>tr', function () {
        let id_row = $(this).children('td:nth(0)').children('.row_span_id').data('id');
        let url_row = $(this).children('td:nth(0)').children('.row_span_id').data('url');


        $.ajax({
            url: url_row,
            data: { 'id': id_row, },
            method: 'get',
            success: function (data) {
                if (data.status == 1) {

                    let resp = JSON.parse(data.data);
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
                        $('#delete_this').removeClass('hidden');
                        $('#delete_this').removeAttr('style');
                        $('#modalLRForm').modal('show');
                    });
                } else if (data.status == 0) {
                    alert_message(data.message.message, data.message.class);


                }

            },
            error: function (data) {
                alert_message(data.message.message, data.message.class);

            }
        });
    });

    $(document).on('dblclick', '#delete_this', function () {
        var result = confirm(delete_msg);
        if (result) {
            let id_row = $(`input[name="id"]`).val();


            $.ajax({
                url: $(this).data('url'),
                data: {
                    'id': id_row,
                },
                method: 'delete',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("X-CSRFToken", csrf);
                },
                success: function (data) {

                    if (data.status == 1) {
                        $('#modalLRForm').modal('hide');


                        alert_message(data.message.message, data.message.class);

                        table.ajax.reload();
                        $('#delete_this').addClass('hidden');
                    }
                    else if (data.status == 0) {
                        alert_message(data.message.message, data.message.class);

                    }

                },
                error: function (data) {
                    alert_message(data.message.message, data.message.class);


                }
            });
        }
    });
});

