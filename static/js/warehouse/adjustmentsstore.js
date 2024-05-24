

function getExchangeRate(currency_id) {
    $.ajax({
        url: url_AdjustmentsStoreOperationsView,
        data: {
            'id_currency': currency_id.value,
        },
        method: 'get',
        success: function (data) {
            if (data.status === 0) {
                $(`input[name="exchange_rate"][type="number"]`).val(parseFloat(data.exchange_rate));
            }
        },
        error: function (data) {
        }
    });
}

function getAccountCurrency(element) {
    $.ajax({
        url: url_AdjustmentsStoreOperationsView,
        data: {
            'id_account': element.value,
        },
        method: 'get',
        success: function (data) {
            let element = document.getElementById("id_currency");
            $(`select[name="currency"]`).attr("readonly", false);
            let option = '<option value="" selected="">---------</option>';
            $.each(data, function (index) {
                option += '<option value="' + data[index]['currency_id'] + '">' + data[index]['currency__name_ar'] + '</option>';
            });
            $('#id_currency').html("").append(option);
        },
        error: function (data) {
        }
    });

}

// function get_new_adjs_code() {
//     $.ajax({
//     url: adurl,
//     data: {
//         'new_code': "1",
//     },
//     method: 'get',
//     success: function (data) {
//         if (data.status === 0) {
//                 let newCode = parseInt(data.new_code['code__max']) + 1
//                 $(`input[name="code"]`).val(newCode);
//             }
//             if (data.status === 2) {
//                 alert_message(String(data.message), 'alert alert-warning', 'fa fa-times');
//             }
//     },
//     error:function(data){
//     }
// });
// }
function getAdjustmentsDetails(element) {
    let ind = element.name.split('-');
    let adjustment_rows = parseInt($('#id_' + 'AdjustmentsDetail' + '-TOTAL_FORMS').val());
    let rowcounter = 0;

    $.ajax({
        url: url_AdjustmentsStoreOperationsView,
        data: {
            'adjustments_item_id': element.value,
        },
        method: 'get',
        success: function (data) {
            item_data = JSON.parse(data.item_data);
            let average_cost = parseFloat(data.average_cost_data.average_cost);
            let option, sup_option;
            if (data.status === 0) {
                if (item_data.length !== 0) {
                    if (adjustment_rows > 1) {
                        rowcounter = adjustment_rows - 1;
                    }
                    else if (adjustment_rows === 1) {
                        rowcounter = 0;
                    }
                    let row = 0;

                    $.each(item_data, function () {
                        if ($(`#id_AdjustmentsDetail-${ind[1]}-item_inventory`).val() === null) {
                            addForm($('.add-form-row'), String($('.add-form-row').attr('id')));
                        } else {
                            rowcounter = ind[1];
                        }

                        $.each(item_data[row].fields, function (i, value) {
                            $(`input[name="AdjustmentsDetail-${rowcounter}-average_cost"]`).val(average_cost);
                            $(`input[name="AdjustmentsDetail-${rowcounter}-${i}"]`).val(value);
                            // $(`select[name="AdjustmentsDetail-${rowcounter}-${i}"] option[value="${value}"]`).attr('selected','selected');
                            if (i !== 'item_inventory') {
                                $(`select[name="AdjustmentsDetail-${rowcounter}-${i}"]`).val(value);
                            }

                        });
                        $.each(data.main_supplier, function (index, main_sup) {
                            option += '<option value="' + index + ' ">' + main_sup + '</option>';
                        });
                        $(`#id_AdjustmentsDetail-${rowcounter}-supplir`).html("").append(option);

                        $.each(data.item_unit, function (ind, unit) {
                            sup_option += '<option value="' + ind + ' ">' + unit + '</option>';
                        });
                        $(`#id_AdjustmentsDetail-${rowcounter}-item_unit`).html("").append(sup_option);
                        row += 1;
                        rowcounter += 1;
                    });
                }
            }
            if (data.status === 1) {
                alert_message(data.message, 'alert alert-warning', 'fa fa-times');
            }

        },
        error: function (data) {
        }
    });
}

$(document).ready(function () {
    // get_new_adjs_code();
    let form_id = "#form-id-adjustment-store";
    $('[data-toggle="tooltip"]').tooltip();
    $(document).on('click', '#adjustment-cancle-button', function (e) {
        let adjustment_rows = parseInt($('#id_' + 'AdjustmentsDetail' + '-TOTAL_FORMS').val());
        $('#adjustment-submit-button').button('reset');
        $(form_id)[0].reset();
        for (i = 0; i < adjustment_rows; i++) {
            deleteForm($('#AdjustmentsDetail-0'), String($('.add-form-row').attr('id')));
        }
    });
    
    $(document).on('submit', form_id, function (e) {
        let adjustment_rows = parseInt($('#id_' + 'AdjustmentsDetail' + '-TOTAL_FORMS').val());
        alert(adjustment_rows);
        let div=$("#tblProducts");
        
        // Support: IE8
        // Enforce case-sensitivity of name attribute
        // const container = document.querySelector('#table_appeariance');
        

        $('#adjustment-submit-button').button('loading');
        
        $("#id_AdjustmentsDetail-0-item_store").removeAttr('disabled');
        $("#id_AdjustmentsDetail-0-item_exp_date").removeAttr('disabled');
        $("#id_AdjustmentsDetail-0-item_unit").removeAttr('disabled');
        $("#id_AdjustmentsDetail-0-item_avali_quantity").removeAttr('disabled');
        $("#id_AdjustmentsDetail-0-item_inventory_quantity").removeAttr('disabled');
        $("#id_AdjustmentsDetail-0-supplir").removeAttr('disabled');
        $("#id_AdjustmentsDetail-0-average_cost").removeAttr('disabled');
        
        
        e.preventDefault();
        $.ajax({
            url: $(this).attr('action'),
            data: $(this).serialize(),
            method: 'post',
            success: function (data) {
                $('span[class="text-danger"]').remove();
                if (data.status === 1) {
                    $(form_id)[0].reset();
                    for (let i = 0; i < adjustment_rows; i++) {
                        deleteForm($('#AdjustmentsDetail-0'), String($('.add-form-row').attr('id')));
                    }
                    alert_message(data.message.message, data.message.class);
                    $(`.clear-this`).val('');
                    $('#adjustment-submit-button').button('reset');
                }
                if (data.status === 3) {
                    alert_message(data.message.message, data.message.class);
                    $('#adjustment-submit-button').button('reset');
                }
                else if (data.status === 2) {
                    alert_message(data.message.message, data.message.class);
                    $('#adjustment-submit-button').button('reset');
                }
                else if (data.status === 0) {
                    let error = JSON.parse(data.error);
                    let errorform = data.errorformset;
                    $.each(error, function (i, value) {
                        alert_message(String(data.message), 'alert alert-warning', 'fa fa-times');
                        let div = '<span class="text-danger">';
                        $.each(value, function (j, message) {
                            div += `- ${message.message}<br>`;
                        });
                        $(`#div_id_${i}`).append(div);
                    });
                    $.each(errorform, function (i, value) {
                        $.each(value, function (j, message) {
                            alert_message(String(message), 'alert alert-warning', 'fa fa-times');
                        });
                    });
                    $('#adjustment-submit-button').button('reset');
                }
            },
            error: function (data) {
            }
        });
        $("#id_AdjustmentsDetail-9-item_store").attr('disabled', 'disabled');
        $("#id_AdjustmentsDetail-9-item_exp_date").attr('disabled', 'disabled');
        $("#id_AdjustmentsDetail-9-item_unit").attr('disabled', 'disabled');
        $("#id_AdjustmentsDetail-9-item_avali_quantity").attr('disabled', 'disabled');
        $("#id_AdjustmentsDetail-9-item_inventory_quantity").attr('disabled', 'disabled');
        $("#id_AdjustmentsDetail-9-supplir").attr('disabled', 'disabled');
        $("#id_AdjustmentsDetail-9-average_cost").attr('disabled', 'disabled');
    });
});