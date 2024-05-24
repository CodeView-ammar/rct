      
$(document).ready(function () {
    $("input[type='checkbox']").on("change", function () {
        if ($(this).is(":checked"))
            $(this).val("1");
        else
            $(this).val("0");
    });
    let form_id = '#form-id';

    $(document).on('submit', form_id, function (e) {
        // $('#submit-button').button('loading');
        e.preventDefault();

        on_submit(form_id, function (data) {
            $('.modal').modal('hide');
            table.ajax.reload();
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
        return
    });
    $(document).on('click', '.edit_row', function () {
        on_edit($(this), function (data) {
            $('#modalLRForm').modal('show');
        });
    });

    $(document).on('click', '.delete_row', function () {
        on_delete($(this), function (data) {
            table.ajax.reload();
        });
    });


});

