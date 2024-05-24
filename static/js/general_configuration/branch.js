$(document).ready(function() {
 

    let form_id = '#form-id';
    $(document).on('submit', form_id, function(e) {
        //  $('#submit-button').button('loading');

        e.preventDefault();
        var form_upload = $("#form-id")[0];
        var form_data = new FormData(form_upload);
        $.ajax({
            url: $(this).attr('action'),
            // data: $(this).serialize().replace('=false', '=true'),
            data: form_data,
            type: 'post',
            dataType: 'json',
            cache: false,
            processData: false,
            contentType: false,
            success: function(data) {
                $('span[class="text-danger"]').remove();
                $('.clear_model').trigger('click');
                if (data.status == 1) {

                    
                    alert_message(data.message.message, data.message.class, 0);
                    $('#exampleModalLong').modal('hide');
                    $('.modal-backdrop').remove();
                    
                    table.ajax.reload();
                    $(form_id)[0].reset();
                    //  $('#exampleModalLong').modal('hide');
                    //  $('#exampleModalLong').addClass("hide");
                    //  $('#exampleModalLong').removeClass("show");
                    table.ajax.reload();
                    $('#submit-button').button('reset');

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

            },
            error: function(data) {

            }
        });
    });

    $(document).on('click', '.edit_row', function() {



        let id_row = $(this).data('id');

        $('.clear_model').trigger('click');

        $.ajax({
            url: $(this).data('url'),
            data: { 'id': id_row, },
            method: 'get',
            success: function(data) {

                if (data.status == 1) {


                    if (typeof data.data2 === undefined) {

                    } else {

                        let resp1 = data.data2;
                        $.each(resp1, function(it, value1) {
                            $.each(value1, function(i1, value2) {


                                $(`input[name="${i1}"][type='checkbox'][value='${value2}']`).prop('checked', true);


                            });
                        });

                    }

                    let resp = JSON.parse(data.data);
                    $(`input[name="id"]`).val(resp[0].pk);

                    $('#id_image').attr("href","media/"+resp[0].fields.image);
                    const inputFile = document.getElementById("id_image");
                    inputFile.innerHTML = `<a href="${"media/"+resp[0].fields.image}">View Image</a>`;
                    $("#aimage").fadeIn("fast").attr('src', window.location.origin + "/media/" + resp[0].fields.image);
                    
                    $.each(resp[0].fields, function(i, value) {

                        $(`input[name="${i}"]`).val(value);
                        $(`select[name="${i}"]`).val(value);
                        $(`input[name="${i}"][type='checkbox']`).prop('checked', value);
                        //  $(`select[name="${i}"] option[value="${value}"]`).attr('selected','selected');


                        $('#exampleModalLong').modal('show');


                    });
                    if ($('#id_currency_type').val() == 'foreign') {


                        $('#div_id_exchange_rate').show();
                        $('#div_id_lowest_conversion_rates').show();
                        $('#div_id_highest_conversion_rate').show();
                        $('#id_exchange_rate').trigger('input');
                    } else {

                        $('#div_id_exchange_rate').hide();
                        $('#div_id_lowest_conversion_rates').hide();
                        $('#div_id_highest_conversion_rate').hide();
                    }
                    $('#submit-button').text('Update');


                }
            },
            error: function(data) {}
        });
    });
    $(document).on('click', '.clear_model', function() {
        // console.log('yourwellcome');
        $('#submit-button').text('Save');
        $("#form-id")[0].reset();
        $('#div_id_exchange_rate').hide();
        $('#div_id_lowest_conversion_rates').hide();
        $('#div_id_highest_conversion_rate').hide();

        // $(".modal").trigger('reset'); 

        return
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

});