$(document).ready(function() {
    // alert('asdfasfdas')
    $('#modalLRForm').on('hidden.bs.modal', function(e) {
        $('#form-id')[0].reset();
        $(`textarea`).text('');
        $('span[class="text-danger"]').remove();

    });
    //   alert('2')
    let form_id = '#form-id';
    $(document).on('submit', form_id, function(e) {
        // alert('3');
        // alert($(this).attr('action'))
        // alert(forme_url)
        e.preventDefault();
        $.ajax({
            url: forme_url,
            data: $(this).serialize(),
            method: 'POST',
            success: function(data) {
                // alert('4');
                $('span[class="text-danger"]').remove();

                // $('.clear_model').trigger('click');
                if (data.status == 1) {
                    // $(form_id)[0].reset();
                    // $(`textarea`).text('');
                    // alert('5');
                    // alert('a')
                    alert_message(data.message.message, data.message.class, 0);
                    $('#modalLRForm').modal('hide');
                    table.ajax.reload();
                } else if (data.status == 2) {
                    // alert('6');
                    alert_message(data.message.message, data.message.class);
                } else if (data.status == 0) {
                    // alert('7');
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
        $.ajax({
            url: $(this).data('url'),
            data: { 'id': id_row, },
            method: 'get',
            success: function(data) {
                if (data.status == 1) {

                    let resp = JSON.parse(data.data);

                    if (data.data1) {
                        let data_1 = data.data1;
                        let option_1 = `<option selected value="${data_1.data_filter1.id}">${data_1.data_filter1.name}</option>`;
                        $(data_1.data_filter1.id_input_in_html_1).append(option_1);

                    }
                    $(`input[name="id"]`).val(resp[0].pk);
                    // alert(resp[0].fields.effected_by_operation);
                    // $(`select[name="effected_by_operation"] option`).each(function () {
                    //     if((this).val()=="false"){
                    //         alert("aaa");
                    //     }    
                    //     // $(this).prop("selected",resp[0].fields.effected_by_operation);

                    // });
                    var option = resp[0].fields.effected_by_operation;
                    $(`select[name=effected_by_operation] option`).each(function() {
                        if (isNaN($(this).val().toString().toLocaleLowerCase()) === option) {
                            $(this).prop("selected", true);
                        }
                    });
                    //     $('#id_effected_by_operation').each(function () {
                    //        $(this).children("option").each(function () {
                    //         //    alert($(this).val());

                    //         // alert(typeof(isNaN($(this).val().toString().toLocaleLowerCase())));
                    //         if(isNaN($(this).val().toString().toLocaleLowerCase())===option){
                    //         alert(option.toString().substr(0,1).toLocaleLowerCase());

                    //         $(this).prop("selected", true);
                    //     }
                    //     });
                    // });
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
                    }
                },
                error: function(data) {}
            });
        }
    });


    $(document).on('hide.bs.modal', '#modalLRForm', function() {

        $('.select2-hidden-accessible').children("option").remove();
        $('#form-id')[0].reset();
        $(`textarea`).text('');
    });



    $(document).on('click', '.clear_model', function() {

        $("#form-id")[0].reset();
        $('#div_id_exchange_rate').hide();
        $('#div_id_lowest_conversion_rates').hide();
        $('#div_id_highest_conversion_rate').hide();
        $('span[class="text-danger"]').remove();

        return
    });


    $(document).on('show.bs.modal', '#modalLRForm', function() {
        $.ajax({
            url: mix_url_id,
            data: {},
            method: 'get',
            success: function(data) {
                $('#id_number').val(data.id);
            },
            error: function(data) {}
        });
    });



});