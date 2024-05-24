           

$(document).ready(function () {
    let form_id = '#form-id';
    $(document).on('submit', form_id, function (e) {
        // $('#submit-button').button('loading');

        e.preventDefault();
        $.ajax({
            url: $(this).attr('action'),
            data: $(this).serialize(),
            method: 'post',
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", csrf);
            },
            success: function (data) {

                $('span[class="text-danger"]').remove();
                if (data.status == 1) {
                    alert_message(data.message.message, data.message.class);
                    $('#modalLRForm').modal('hide');
                    table.ajax.reload();
                    $(form_id)[0].reset();
                    $('.clear_model').trigger('click');
                if(data.max_number!=null)
                    $("#id_number").val(data.max_number)

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



    $(document).on('click', '.clear_model', function () {

        // $('#submit-button').text('Save');
        $("#form-id")[0].reset();
        $('#div_id_exchange_rate').hide();
        $('#div_id_lowest_conversion_rates').hide();
        $('#div_id_highest_conversion_rate').hide();
        $('span[class="text-danger"]').remove();
        // $(".modal").trigger('reset');

        // alert('your wellcome');
        return
    });
    $(document).on('click', '.edit_row', function () {
        $('span[class="text-danger"]').remove();
        //    alert('test');
        let id_row = $(this).data('id');
        $.ajax({
            url: $(this).data('url'),
            data: { 'id': id_row, },
            method: 'GET',
            success: function (data) {

                if (data.status == 1) {
                    let resp = JSON.parse(data.data);

                    $(`input[name="id"]`).val(resp[0].pk);
                    $.each(resp[0].fields, function (i, value) {
                        $(`input[name="${i}"]`).val(value);
                        $(`input[name=${i}]`).prop('checked', value);
                        $(`textarea[name=${i}]`).text(value);
                        // alert("Ahmed");
                        $(`select[name="${i}"] option`).each(function () {
                            if ($(this).val() == value) {
                                $(this).prop("selected", true);
                            }
                        });
                    });
                    if(data.formset[0]){
                    let formset_data = JSON.parse(data.formset[0]['data']);
                    let prefix = data.formset[0]['prefix'];
                    let formCount = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
                    if (formset_data.length !== 0) {

                        if (formCount > 1) {
                            for (i = 0; i < formCount; i++) { // قمت بتعديل العبارة هنا
                                deleteForm($('#'+prefix), String($('.add_row').attr('id')));
                            }
                        }

                        let unitrowcounter = 0;
                        $.each(formset_data, function() {
                            if (unitrowcounter !== 0) { // قمت بتعديل العبارة هنا
                                addForm($('.add_row'), String($('.add_row').attr('id')));
                            }
                            $.each(formset_data[unitrowcounter].fields, function(fieldIndex, fieldValue) {
                                let fieldElement = $(`input[name="${prefix}-${unitrowcounter}-${fieldIndex}"]`);
                              
                                if (fieldElement.length > 0) {
                                  // Handle input fields (including hidden inputs)
                                  fieldElement.val(fieldValue);
                                } else {
                                  // Handle select fields
                                  let selectElement = $(`select[name="${prefix}-${unitrowcounter}-${fieldIndex}"]`);
                                  if (selectElement.length > 0) {
                                    // Set the selected option based on the fieldValue
                                    selectElement.val(fieldValue);
                                  }
                                }
                              });

                            unitrowcounter++; // قمت بإضافة هذا السطر لزيادة قيمة unitrowcounter
                        });
                    }
                }
                    var modal = $('#modalLRForm');
                    if (modal.hasClass('show')) {
                      modal.modal('hide');
                    } else {
                      modal.modal('show');
                    }
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
                        if(data.max_number!=null)
                            $("#id_number").val(data.max_number)
                    }
                },
                error: function (data) {
                }
            });
        }
    });


});
