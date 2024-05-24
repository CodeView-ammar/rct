           
$(document).ready(function () {
    let form_id = '#form-id';
    $(document).on('submit', form_id, function (e) {
        // $('#submit-button').button('loading');
        e.preventDefault();
        $.ajax({
            url: $(this).attr('action'),
            data: $(this).serialize(),
            method: 'post',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("X-CSRFToken", csrf);
            },
            success: function (data) {

                $('span[class="text-danger"]').remove();
                if (data.status == 1) {
                    alert_message(data.message.message, data.message.class);
                    $('#modalLRForm').modal('hide');
                    table.ajax.reload();
                    $(form_id)[0].reset();
                    // $('.clear_model').trigger('click');
                   if(data.load=="true")
                   window.location.reload();
                }
                if (data.status == 3 || data.status ==2) {
                    alert_message(data.message.message, data.message.class);
                }
                if (data.status == 0) {
                    let error = JSON.parse(data.error);
                    $.each(error, function (i, value) {
                        
                        let div = '<span class="text-danger">';
                        $.each(value, function (j, message) {
                            div += `- ${message['message']}<br>`;
                        });
                        if(i=="english_name") i="name_english";
                        if(i=="arabic_name")i="name_arabic";
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

    // edit close section
    $(document).on('click', '.close_row', function () {
        let id_row = $(this).data('id');
        $.ajax({
            url: $(this).data('url'),
            data: { 'id': id_row, },
            method: 'POST',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("X-CSRFToken", csrf);
            },
            success: function (data) {
                if (data.status == 1) {
                    alert_message(data.message.message, data.message.class);
                    table.ajax.reload();
                    
                    if($(".close_row").hasClass("pos_shit")){
                        window.location.reload();
                    }
                }
            },
            error: function (data) {
            }
        });
    });

    // edit close section
    $(document).on('click', '.approval_row', function () {
        $("#modalLRForm_approval").modal('show');
        let id_row = $(this).data('id');
        
        $.ajax({
            url: $(this).data('url'),
            data: { 'id': id_row, },
            method: 'GET',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("X-CSRFToken", csrf);
            },
            success: function (data) {
                $("#cash_total").html(`${data.final_total}`);
                $("#cash_diff_cash").html(`${-parseFloat(data.final_total)}`);
                $("#affirmation_id").val( data.id);
                $("#PosShiftSummaryShiftId").html("<option value='0'>من فضلك اختر</option>")
                $("#PosShiftSummaryShiftId").append( `<option value="${data.pos_shift}" selected="selected">${data.pos_shift__name}</option>`);
                $("#PosShiftSummary0Cash").val(0).focus();
                let resp = data.fund;
                
                let options_=''
                $.each(resp, function(i, value) {
                    
                    options_+=`<option value="${value["accounts"]}">${value["arabic_name"]}</option>`
                });
                $(`select[name="fund"]`).html("");
                $(`select[name="fund"]`).append(options_);
            },
            error: function (data) {
            }
        });
    });
    
$(document).on('click', '.unlock_row', function () {
        let id_row = $(this).data('id');
        $.ajax({
            url: $(this).data('url'),
            data: { 'id': id_row, },
            method: 'POST',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("X-CSRFToken", csrf);
            },
            success: function (data) {
                if (data.status == 1) {
                    table.ajax.reload();
                    alert_message(data.message.message, data.message.class);
                }
            },
            error: function (data) {
            }
        });
    });
    
    $(document).on('click', '.edit_row', function () {
        $('span[class="text-danger"]').remove();
        //    alert('test');
        let id_row = $(this).data('id');
        $.ajax({
            url: $(this).data('url'),
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
                        // alert("Ahmed");
                        $(`select[name="${i}"] option`).each(function () {
                            if ($(this).val() == value) {
                                $(this).prop("selected", true);
                            }
                        });
                        $('#modalLRForm').modal('show');
                    });
                }
            },
            error: function (data) {
            }
        });
    });


    $(".add-new-btn").on('click', function() {

        
        $.ajax({

            url: check_section_url,
            data: {},
            method: 'GET',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("X-CSRFToken", csrf);
            },
            success: function (data) { 
                if(data.check_section!="")
                location.href=data.check_section
            }    
        })
        
    });
    $("#id_pos_device").on("change", function(){
        change_device($(this));
    })
    
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

    $(document).on('submit', "#form-affirmation", function (e) {
        // $('#submit-button').button('loading');
        e.preventDefault();
        alert("a")
        $.ajax({
            url: $(this).attr('action'),
            data: $(this).serialize(),
            method: 'POST',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("X-CSRFToken", csrf);
            },
            success: function (data) {

                $('span[class="text-danger"]').remove();
                if (data.status == 1) {
                    alert_message(data.message.message, data.message.class);
                    $('#modalLRForm_approval').modal('hide');
                    table.ajax.reload();
                    $("#form-affirmation")[0].reset();
                   
                }
                if (data.status == 3 || data.status ==2) {
                    alert_message(data.message.message, data.message.class);
                }
                if (data.status == 0) {
                    let error = JSON.parse(data.error);
                    $.each(error, function (i, value) {
                        
                        let div = '<span class="text-danger">';
                        $.each(value, function (j, message) {
                            div += `- ${message['message']}<br>`;
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
});
