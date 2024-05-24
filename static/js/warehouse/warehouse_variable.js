          function clearForm() {
    $('#form-id')[0].reset();
    $('input:checkbox').removeAttr('checked');
}


$(document).ready(function () {
    let form_id = '#form-id';
    $(document).on('submit', form_id, function (e) {
        e.preventDefault();
        $.ajax({
            url: $(this).attr('action'),
            data: $(this).serialize(),
            method: 'post',
            success: function (data) {

                $('span[class="text-danger"]').remove();
                if (data.status == 1) {
                    alert_message(data.message.message, data.message.class);
                    console.log(data);
                    // $(form_id)[0].reset();
                    // $('#modalLRForm').modal('hide');
                    // table.ajax.reload();
                    // clearForm();

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




 


});