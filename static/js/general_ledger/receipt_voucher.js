

function updateElementFormset(el, prefix, ndx) {
    var id_regex = new RegExp('(' + prefix + '-\\d+-)');
    var replacement = prefix + '-' + ndx + '-';
    if ($(el).attr("for")) $(el).attr("for", $(el).attr("for").replace(id_regex,
        replacement));
    if (el.id) el.id = el.id.replace(id_regex, replacement);
    if (el.name) el.name = el.name.replace(id_regex, replacement);
}

function deleteFormset(btn, prefix) {
    var formCount = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
    if (formCount > 1) {
        // Delete the item/form
        $(btn).parents('.item').remove();
        var forms = $('.item'); // Get all the forms
        // Update the total number of forms (1 less than before)
        $('#id_' + prefix + '-TOTAL_FORMS').val(forms.length);
        var i = 0;
        // Go through the forms and set their indices, names and IDs
        for (formCount = forms.length; i < formCount; i++) {
            $(forms.get(i)).find('.formset-field').each(function() {
                $(forms.get(i)).find('.td_id').text(i + 1);
                updateElementFormset(this, prefix, i);
            });
        }
    } // End if

    return false;
}

function reset_credit_dedit(id_row) {
    let prefix = String($('.add_form').attr('id'));
    $(`#id_${prefix}-${id_row[1]}-credit`).val('');
    $(`#id_${prefix}-${id_row[1]}-credit_foreigner`).val('');

}

function change_exchange_rate(id_row) {
    let prefix = String($('.add_form').attr('id'));


    if ($(`#id_${prefix}-${id_row[1]}-credit`).attr('readonly') && $(`#id_${prefix}-${id_row[1]}-credit_foreigner`).val()) {
        let amount = parseFloat($(`#id_${prefix}-${id_row[1]}-credit_foreigner`).val()) * parseFloat($(`#id_${prefix}-${id_row[1]}-exchange_rate`).val());
        $(`#id_${prefix}-${id_row[1]}-credit`).val(amount)
    }
    if ($(`#id_${prefix}-${id_row[1]}-debit`).attr('readonly') && $(`#id_${prefix}-${id_row[1]}-debit_foreigner`).val()) {
        let amount = parseFloat($(`#id_${prefix}-${id_row[1]}-debit_foreigner`).val()) * parseFloat($(`#id_${prefix}-${id_row[1]}-exchange_rate`).val())
        $(`#id_${prefix}-${id_row[1]}-debit`).val(amount)
    }
}

function open_change_class_buttons() {
    $('#submit-button').removeClass('hidden');
    $('.add_form').removeClass('hidden');
    $('.delete_form').removeClass('hidden');
    $('#id_bond_number').removeAttr('daily_entries');
    $('#show_daily_constraints_btn').toggleClass('hidden');
   
    $('#delete_this').toggleClass('hidden');

}

function close_change_class_buttons() {
    // $('#submit-button').toggleClass('hidden');
    // $('.add_form').toggleClass('hidden');
    // $('.delete_form').toggleClass('hidden');
    $('#show_daily_constraints_btn').removeClass('hidden');

    $('#delete_this').removeClass('hidden');

}

function clear_item() {
    $('span[class="text-danger"]').remove();
    $('#form-exchange')[0].reset();
    $('#div_id_bank').parent().addClass('hidden');
    // $('#id_bank').children('option').removeAttr('selected');
    // $('#div_id_fund').parent().removeClass('hidden');
    $('#div_id_check_number').parent().addClass('hidden');
    // $('#div_id_due_date').parent().addClass('hidden');
    $('#id_check_number').removeAttr('required');
    // $('#id_due_date').removeAttr('required');
    // $('#id_fund').children('option').remove();
    // $('#id_bank').children('option').remove();
    $(`textarea`).text('');
    $('#load_div').load(load_url);
}

function get_total() {
    let total_credit = 0;
    $('.name_credit').each(function() {
        if (!isNaN(parseFloat($(this).val()))) {
            total_credit += parseFloat($(this).val());
        }
    });

    $('input[name="total_Credit"]').val(parseFloat(total_credit));
    let debit = parseFloat($('#id_amount').val());
    if (isNaN(debit)) {
        debit = 0;
    }
    let exchange_rate = parseFloat($('#id_exchange_rate').val());
    if (isNaN(exchange_rate)) {
        exchange_rate = 1;
    }
    let total_debit = exchange_rate * debit;

    $('input[name="total_Debit"]').val(parseFloat(total_debit));
    let total = total_credit - total_debit;
    $('input[name="total"]').val(total);
    if (total == 0) {
        $('input[name="total"]').removeAttr('style');
    } else {
        $('input[name="total"]').attr('style', 'border: 1px solid red;');
    }

}

function get_note(element) {
    let note = $('#id_note').val();
    element.val(note);
}

function check_account_fund() {
    let status = [];
    let fu = [];
    let prefix = String($('.add_form').attr('id'));
    let sta = true;
    $('.name_account').each(function(i, j) {
        let id_row = $(this).attr('id');
        if (id_row != undefined) {
            id_row = id_row.split('-');
            let row = {
                'data': '',
                'id': id_row[1],
            }
            let accounts = $(`#id_${prefix}-${id_row[1]}-account`).val();
            let currency = $(`#id_${prefix}-${id_row[1]}-currency`).val();
            let data = [accounts, currency];
            if (status.length > 0) {
                $.each(status, function(i, j) {
                    if (data[0] == j.data[0] && data[1] == j.data[1]) {
                        fu.push(id_row[1])
                        fu.push(j.id)
                    } else {
                        row['data'] = data;
                        status.push(row);
                    }
                });
            } else {
                row['data'] = data;
                status.push(row);
            }
        }
    });
    if (fu.length > 0) {
        sta = false;
        $('.item').removeAttr('style');
        $.each(fu, function(index, value) {
            $(`#id_${prefix}-${value}-account`).parents('.item').attr('style', 'outline:red auto;');

        });
    } else {
        $('.item').removeAttr('style');
        if ($(`input[name="total"]`).val() == 0) {
            $('input[name="total"]').removeAttr('style');
            sta = true;
        } else {
            $(`input[name="total"]`).attr('style', 'border:red 1px solid;')
        }
    }
    return sta;

}

function change_currency() {
    let id_currency = $('#id_currency').val();
    if (id_currency) {
        $('.name_currency').each(function(i, j) {
            $(this).children(`option`).removeAttr('selected');
            if ($(this).children(`option[value="${id_currency}"]`).length != 0) {
                $(this).children(`option[value="${id_currency}"]`).prop('selected', true);
                $(this).attr('readonly', 'readonly');
            } else {
                $(this).parents(`td`).siblings('td').children('.delete_form').trigger('click');
            }

        });

    }
    setTimeout(function() {
        let exchange_rate = $('input[name="exchange_rate"]').val();
        let exchange_rate_type = $('input[name="exchange_rate"]');
        if (exchange_rate_type.attr('readonly') == 'readonly') {
            $('.name_credit').each(function(i, j) {
                if (!$(this).attr('required')) {
                    $(this).attr('required', 'required');
                }
                if ($(this).attr('readonly')) {
                    $(this).removeAttr('readonly', 'readonly');
                }
                $(this).parent('td').siblings('td').children('.name_credit_foreigner').attr('readonly', 'readonly');
                $(this).parent('td').siblings('td').children('.name_credit_foreigner').val('');
                if (!isNaN(exchange_rate)) {
                    $(this).parent('td').siblings('td').children('.name_exchange_rate').attr('readonly', 'readonly');
                    $(this).parent('td').siblings('td').children('.name_exchange_rate').val(exchange_rate);
                }

            });

        } else {
            $('.name_credit_foreigner').each(function(i, j) {
                $(this).removeAttr('readonly');
                if (!$(this).attr('required')) {
                    $(this).attr('required', 'required');
                }
                if ($(this).attr('readonly')) {
                    $(this).removeAttr('readonly', 'readonly');
                }
                $(this).parent('td').siblings('td').children('.name_credit').attr('readonly', 'readonly');
                let credi_f = parseFloat($(this).val());
                if (isNaN(credi_f)) {
                    credi_f = 0;
                }
                let exchange_rate_d = parseFloat($(this).parent('td').siblings('td').children('.name_exchange_rate').val());
                if (isNaN(exchange_rate_d)) {
                    exchange_rate_d = 0;
                }
                // $(this).parent('td').siblings('td').children('.name_credit').val(exchange_rate_d * credi_f);
                if (!isNaN(exchange_rate)) {
                    $(this).parent('td').siblings('td').children('.name_exchange_rate').attr('readonly', 'readonly');
                    $(this).parent('td').siblings('td').children('.name_exchange_rate').val(exchange_rate);
                }
            });
        }
    }, 1000);

    get_total();





}

function remove_option_outcomplate(id) {
    $(id).each(function() {
        if ($(this).attr('readonly') === 'readonly') {
            $(this).children().css('display', 'none')
        } else {
            $(this).css('display', 'none')
        }
        $(this).removeClass('select2-hidden-accessible');
    });
}


remove_option_outcomplate('.name_account');


$(document).on('click', '.delete_form', function() {
    deleteFormset($(this), String($(this).attr('id')));
    get_total();
    change_currency();
});




$(document).on('click', '.add_form', function() {
    let prefix = String($(this).attr('id'));
    var formCount = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
    var row = $(".item:last").clone(false).get(0);
    let tr = `<select name="${prefix}-${formCount}-account" data-row="class_row" style="width: 260px;" class="formset-field form-control name_account select2-hidden-accessible" id="id_${prefix}-${formCount}-account" data-autocomplete-light-language="en" data-autocomplete-light-url="${account_url}" data-autocomplete-light-function="select2" data-select2-id="id_${prefix}-${formCount}-account" tabindex="-1" aria-hidden="true">
       </select><span class="select2 select2-container select2-container--default select2-container--below select2-container--focus" dir="ltr" data-select2-id="${formCount}" style="width: 183px;"></span>`;
    $(row).find('.td_two').html(tr);
    $(row).find('.td_two').attr('data-select2-id', formCount);
    // var f =
    var ccc = formCount;
    // while(ccc>0){
    //     f.push(`{"type": "field", "src": "${prefix}-${ccc-1}-account"}`)
    //     ccc -=1;
    // }
    // let tr1 = `<select name="${prefix}-${formCount}-analytical_account" data-row="class_row" class="formset-field form-control name_analytical_account select2-hidden-accessible" id="id_${prefix}-${formCount}-analytical_account" data-autocomplete-light-language="en" data-autocomplete-light-url="${analyticsl_account_url}" data-autocomplete-light-function="select2" data-select2-id="id_${prefix}-${formCount}-analytical_account" tabindex="-1" aria-hidden="true">
    //    </select><span class="select2 select2-container select2-container--default select2-container--below select2-container--focus" dir="ltr" data-select2-id="${formCount}" style="width: 183px;"></span>
    //    <div style="display:none" class="dal-forward-conf" id="dal-forward-conf-for_id_${prefix}-${formCount}-analytical_account"><script type="text/dal-forward-conf">[{"type": "field", "src": "account"}]</script></div>`;
    // $(row).find('.td_first').html(tr1);
    $(row).find('.td_first').attr('data-select2-id', formCount);
    $(`#id_${prefix}-${formCount}-account`).css('outline', '');
    $(row).find('.td_id').text(formCount + 1);
    $("span[cass='text-danger']", row).remove();
    $(row).children().removeClass("error");
    $(row).find('.formset-field').each(function() {
        updateElementFormset(this, prefix, formCount);
        $(this).val('');
        $(this).removeAttr('value');
        $(this).removeAttr('disabled');
        $(this).removeAttr('readonly');
    });
    $(row).find('.td_first').children('input').attr('readonly', 'readonly');
    $('.tbody_tb').append(row);
    $(row).find(".delete_form").click(function() {
        return deleteFormset(this, prefix);
    });
    $('#id_' + prefix + '-TOTAL_FORMS').val(formCount + 1);

});


// stop
$(document).on('change', '.name_currency', function() {

    let prefix = String($('.add_form').attr('id'));
    let id_row = $(this).attr('id');
    id_row = id_row.split('-');
    reset_credit_dedit(id_row);
    let currency_id = $(this).val();
    if (currency_id) {
        $.ajax({
            url: currency_info,
            method: 'get',
            data: {
                'id': currency_id
            },
            success: function(data) {
                if (data.data) {
                    let res = JSON.parse(data.data);
                    let exchange_rate = $(`#id_${prefix}-${id_row[1]}-exchange_rate`);
                    exchange_rate.val(res[0].fields.exchange_rate);
                    exchange_rate.attr('max', res[0].fields.highest_conversion_rate);
                    exchange_rate.attr('min', res[0].fields.lowest_conversion_rates);
                    exchange_rate.removeAttr('readonly');
                    $(`#id_${prefix}-${id_row[1]}-credit`).removeAttr('readonly');
                    $(`#id_${prefix}-${id_row[1]}-credit_foreigner`).removeAttr('readonly');
                    if (res[0].fields.currency_type == "foreign") {
                        $(`#id_${prefix}-${id_row[1]}-credit`).attr('readonly', 'readonly');
                        $(`#id_${prefix}-${id_row[1]}-credit_foreigner`).attr('required', 'required');

                    }
                    if (res[0].fields.currency_type == "local") {
                        exchange_rate.attr('readonly', 'readonly');
                        $(`#id_${prefix}-${id_row[1]}-credit_foreigner`).attr('readonly', 'readonly');
                        $(`#id_${prefix}-${id_row[1]}-credit`).attr('required', 'required');

                    }

                }
            },
            error: function(data) {}
        });
    }
    get_total();
});

$(document).on('change', '#id_currency', function() {

    $('#id_exchange_rate').val('');
    $('#amount').val('');
    let currency_id = $(this).val();
    if (currency_id) {
        $.ajax({
            url: currency_info,
            method: 'get',
            data: {
                'id': currency_id
            },
            success: function(data) {
                if (data.data) {
                    let res = JSON.parse(data.data);
                    let exchange_rate = $(`#id_exchange_rate`);
                    exchange_rate.val(res[0].fields.exchange_rate);
                    exchange_rate.attr('max', res[0].fields.highest_conversion_rate);
                    exchange_rate.attr('min', res[0].fields.lowest_conversion_rates);
                    exchange_rate.removeAttr('readonly');
                    if (res[0].fields.currency_type == "foreign") {
                        exchange_rate.removeAttr('readonly');
                    }
                    if (res[0].fields.currency_type == "local") {
                        exchange_rate.attr('readonly', 'readonly');
                    }

                }
            },
            error: function(data) {}
        });
        get_total();
        change_currency();
    }
});

$(document).on('keyup', '#id_exchange_rate', function(evt) {
    if (evt.key >= 0 || evt.key <= 9 || evt.keyCode == 8) {
        let amount = parseFloat($(this).val());
        let _max = parseFloat($(this).attr('max'))
        let _min = parseFloat($(this).attr('min'))
        if (amount > _max || amount < _min || isNaN(amount)) {
            $(this).siblings('span').remove();
            $(this).parent().append(`<span>يجب ان تكون اكبر من${_min} واقل من ${_max}</span> `);
            
            // return false;
        } else {
            $(this).siblings('span').remove();
        }



    }

    get_total();

});


$(document).on('keyup', '#id_exchange_rate', function(evt) {
    let amount = parseFloat($(this).val());
    let _max = parseFloat($(this).attr('max'))
    let _min = parseFloat($(this).attr('min'))
    $('.name_exchange_rate').val($(this).val());
    setTimeout(function() {
        if (amount > _max || amount < _min || isNaN(amount)) {
            if (amount > _max) {

                $(this).val(_max);

            }
            if (amount < _min || isNaN(amount)) {


                $(this).val(_min);
            }
        }
    }, 1000);
    get_total();
});


$(document).on('keyup', '.name_credit ,#id_amount ', function() {

    get_total();
});

$(document).on('change', '.name_credit_foreigner', function() {
    let prefix = String($('.add_form').attr('id'));
    let id_row = $(this).attr('id');
    id_row = id_row.split('-');
    let val = 0;
    if ($(this).val()) {
        val = $(this).val();
    }
    let amount = parseFloat(val) * parseFloat($(`#id_${prefix}-${id_row[1]}-exchange_rate`).val())
    if (!$(this).attr('readonly')) {
    
    $(`#id_${prefix}-${id_row[1]}-credit`).val(amount);
    }
    get_total();
});

$(document).on('click', '.show_Operation>tr', function(e) {
    
    let id = $(this).children('td:nth(0)').children('.row_span_id').data('id');
    if (id != undefined) {

        $.ajax({
            url: get_master,
            method: 'get',
            data: {
                'daily_entry': id
            },
            success: function(data) {
                if (data.data) {
                    let res = JSON.parse(data.data);
                    res = res[0];
                    $('input[name="reference_number"]').val(res.reference_number);
                    $('#id_id').val(res.daily_entry_id);
                    // $('#id_branch').val(res.branch_id);
                    $("textarea#id_note").val(res.note);
                    // $('#id_note').val(res.daily_entry__detailsdailyentry__note);
                    $('#id_operation_date').val(res.date);
                    $('#id_amount').val(res.amount);
                    $('#id_recipient').val(res.recipient);
                    if (res.payment_method == 'Cash') {

                        $('#id_payment_method').val('Cash');
                    
                    }
                    if (res.payment_method == 'Check') {

                        $('#id_payment_method').val('Check');
                    }
                    change_class_payment();
                    $("#id_bond_number").attr('daily_entries', res.daily_entry_id);

                    $('#id_check_number').val(parseFloat(res.check_number));
                    // $('#id_due_date').val(res.due_date);
                    $('#id_bond_number').val(res.bond_number);
                    $('#id_cost_center').val(res.cost_center);
                    $('#id_fund').val(res.fund__id);
                    $('#id_bank').val(res.bank__id);
                    $('#id_deported').prop('checked', res.daily_entry__deported);
                    if (res.bank) {
                        $('#div_id_fund').parent().addClass('hidden');
                        $('#id_fund').children('option').remove();
                        $('#div_id_bank').parent().removeClass('hidden');
                        $('#div_id_check_number').parent().removeClass('hidden');
                        // $('#div_id_due_date').parent().removeClass('hidden');
                        // $('#id_check_number').attr('required', 'required');
                        // $('#id_due_date').attr('required', 'required');
                        if (res.bank) {
                            $.ajax({
                                url: bank_info,
                                method: 'get',
                                data: {
                                    'id': res.bank,
                                    'bond_type': 2
                                },
                                success: function(data) {
                                    let option = `<option value="">.....</option>`;
                                    let res = JSON.parse(data.data);
                                    $('#id_currency').children('option').remove();
                                    $.each(res, function(i, j) {
                                        let sel = "";
                                        if (res.daily_entry__detailsdailyentry__currency == j.pk) {
                                            sel = "selected";
                                        }
                                        
                                        option += `<option ${sel} value="${j.pk}">${j.fields.name_ar}</option>`;
                                    });
                                    $('#id_currency').append(option);

                                },
                                error: function(data) {}
                            });
                        }

                    }
                    if (res.fund) {
                        $('#div_id_bank').parent().addClass('hidden');
                        $('#id_bank').children('option').remove();
                        $('#div_id_fund').parent().removeClass('hidden');
                        $('#div_id_check_number').parent().addClass('hidden');
                        // $('#div_id_due_date').parent().addClass('hidden');
                        $('#id_check_number').removeAttr('required');
                        // $('#id_due_date').removeAttr('required');
                        if (res.fund) {
                            $.ajax({
                                url: fund_info,
                                method: 'get',
                                data: {
                                    'id': res.fund,
                                    'bond_type': 2
                                },
                                success: function(data) {
                                    let option = `<option value="">.....</option>`;
                                    let res = JSON.parse(data.data);
                                    $('#id_currency').children('option').remove();
                                    $.each(res, function(i, j) {
                                        option += `<option value="${j.pk}">${j.fields.name_ar}</option>`;
                                    });
                                    
                                    $('#id_currency').append(option);

                                },
                                error: function(data) {}
                            });
                        }
                    }

                    setTimeout(function() {
                        $('#id_currency').val(res.daily_entry__detailsdailyentry__currency);
                    }, 1000);
                    $('#id_exchange_rate').val(res.daily_entry__detailsdailyentry__exchange_rate);
                    $('#id_exchange_rate').attr('max', res.daily_entry__detailsdailyentry__currency__highest_conversion_rate);
                    $('#id_exchange_rate').attr('min', res.daily_entry__detailsdailyentry__currency__lowest_conversion_rates);
                    if (res.daily_entry__detailsdailyentry__currency__currency_type == "local") {
                        $('#id_exchange_rate').attr('readonly', 'readonly');
                    }
                    if (res.daily_entry__detailsdailyentry__currency__currency_type == "foreign") {
                        $('#id_exchange_rate').removeAttr('readonly');
                    }


                    $('#delete_this').attr('data-id', res.daily_entry_id);
                    $('#delete_this').removeAttr('style');
                }
                close_change_class_buttons();
            },
            error: function(data) {}
        });
        setTimeout(function() {
            get_total();
        }, 1000);
    }
});



$(document).on('click', '#btn_delete', function() {
    if (confirm_delete()) {
        let id_row =  $("#id_bond_number").val();
        $.ajax({
            url: delete_account_receipt_voucher,
            data: {
                'id': id_row,
            },
            method: 'get',

            success: function(data) {
                if (data.status == 1) {
                    $('span[class="text-danger"]').remove();
                    $('#form-exchange')[0].reset();
                    $('#id_fund').children('option').remove();
                    $(`textarea`).text('');
                    $('#load_div').load(load_url);
                }
                alert_message(data.message.message, data.message.class);
                table.ajax.reload();

            },
            error: function(status, href, error) {
                alert_message(error, 'alert alert-danger');

            }
        });
    }
});
function change_class_payment(){
    if ($("#id_payment_method").val() == 'Cash') {
        $('#div_id_bank').parent().addClass('hidden');
        $('#id_bank').children('option').removeAttr('selected');
        $('#div_id_fund').parent().removeClass('hidden');
        $('#div_id_check_number').parent().addClass('hidden');
        // $('#div_id_due_date').parent().addClass('hidden');
        $('#id_check_number').removeAttr('required');
        // $('#id_due_date').removeAttr('required');
    } else if ($("#id_payment_method").val() == 'Check') {
        $('#div_id_fund').parent().addClass('hidden');
        $('#id_fund').children('option').removeAttr('selected');
        $('#div_id_bank').parent().removeClass('hidden');
        $('#div_id_check_number').parent().removeClass('hidden');
        // $('#div_id_due_date').parent().removeClass('hidden');
        // $('#id_check_number').attr('required', 'required');
        // $('#id_due_date').attr('required', 'required');
    }
}

$('#btn_new').on('click', function() {
    change_class_payment();

})


// $(document).on('change', '#id_payment_method', function() {
//     change_class_payment();
// });
$(document).on('change', '#id_fund', function() {
    let fund_id = $(this).val();
    let name_currency = $(`#id_currency`);
    name_currency.children('option').remove();
    if (fund_id) {
        $.ajax({
            url: fund_info,
            method: 'get',
            data: {
                'id': fund_id,
                'bond_type': 2
            },
            success: function(data) {
                let option = `<option value="">.....</option>`;
                let res = JSON.parse(data.data);
                $(this).parent().siblings('td').children('.name_currency').children('option').remove();
                $.each(res, function(i, j) {
                    option += `<option value="${j.pk}">${j.fields.name_ar}</option>`;
                });
                name_currency.append(option);
                $('#id_exchange_rate').val();
                $('#id_bond_number').val(data.max_id);

            },
            error: function(data) {}
        });
    }
    get_total();
});

$(document).on('change', '#id_bank', function() {
    let fund_id = $(this).val();
    let name_currency = $(`#id_currency`);
    name_currency.children('option').remove();
    if (fund_id) {
        $.ajax({
            url: bank_info,
            method: 'get',
            data: {
                'id': fund_id,
                'bond_type': 2
            },
            success: function(data) {
                let option = `<option value="">.....</option>`;
                let res = JSON.parse(data.data);
                $(this).parent().siblings('td').children('.name_currency').children('option').remove();
                $.each(res, function(i, j) {
                    option += `<option value="${j.pk}">${j.fields.name_ar}</option>`;
                });
                name_currency.append(option);
                $('#id_exchange_rate').val();
                $('#id_bond_number').val(data.max_id);

            },
            error: function(data) {}
        });
    }
    get_total();
});

$(document).on('change', '.name_account', function() {
    let prefix = String($('.add_form').attr('id'));
    let id_row = $(this).attr('id');
    id_row = id_row.split('-');
    reset_credit_dedit(id_row);
    $(`#id_${prefix}-${id_row[1]}-exchange_rate`).val('');
    var formCount = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
    let account_id = $(this).val();

    // $(`#id_${prefix}-${id_row[1]}-analytical_account`).children('option').remove();
    let name_currency = $(`#id_${prefix}-${id_row[1]}-currency`);
    name_currency.children('option').remove();
    if (account_id) {
        $.ajax({
            url: account_info,
            method: 'get',
            data: {
                'id': account_id
            },
            success: function(data) {

                // type_account.val(data.type);
                let option = `<option value="">.....</option>`;
                let res = JSON.parse(data.data);
                $(this).parent().siblings('td').children('.name_currency').children('option').remove();
                $.each(res, function(i, j) {
                    option += `<option value="${j.pk}">${j.fields.name_ar}</option>`;
                });
                name_currency.append(option);

            },
            error: function(data) {}
        });
        let element = $(`#id_${prefix}-${id_row[1]}-note`);
        get_note(element);
    }
    get_total();
    setTimeout(function() {
        change_currency();
    }, 1000);
});

$(document).ready(function() {
    $('#load_div').load(load_url);
    let form_id = '#form-exchange';
    $('select[name="fund"]').prop('required', false);
    $('select[name="bank"]').prop('required', false);
    $(document).on('submit', form_id, function(e) {
        e.preventDefault();
        $('#submit-button').text('loading');
        $('#submit-button').prop('disabled', true);
        check_account_fund();
        if (check_account_fund()) {
            let forms = new FormData(this);
            $.ajax({
                url: $(this).attr('action'),
                data: forms,
                method: 'POST',
                contentType: false,
                processData: false,
                success: function(data) {
                    $('span[class="text-danger"]').remove();
                    if (data.status == 1) {
                        clear_item();
                        $('#id_bond_number').val(data.bond_max_number)

                        var answer = window.confirm("هل تريد طباعه سند قبض?");
                        if (answer) {
                            create_profile_repo(data.id,"id");
                            $("#ReportAfterSave").modal('show');
                        }
                        alert_message(data.message.message, data.message.class);
                        table.ajax.reload();
                        setTimeout(function() {
                            func_btn_new("1");
                            func_btn_save("0");
                            $('#form-exchange :input').prop("disabled", true);
                        }, 2010);
                    } else if (data.status == 2) {
                        $.each(data.error, function() {
                            let form = $(this)[0].form_id;
                            $(`#id_${form}-accounts`).parents('.item').css('outline', 'red auto');
                            alert_message($(this)[0].message, 'alert alert-danger');
                        });
                        setTimeout(function() {
                            func_btn_save("1");
                        }, 2010);
                    } else if (data.status == 0) {
                        if (data.message != 'base') {

                            alert_message(data.message.message, data.message.class);
                            setTimeout(function() {
                                control_button(true);
                                func_btn_new("1");
                                func_btn_save("1");
                            }, 2010);
                        }

                        let row_id = data.error.form_id;
                        if (row_id == 'base') {
                            let error = JSON.parse(data.error.error);

                            $.each(error, function(i, value) {
                                let div = '<span class="text-danger">';
                                $.each(value, function(j, message) {
                                    div += `- ${message.message}<br>`;
                                });
                                $(`#id_${i}`).parent().append(div);
                            });

                        } else {
                            let error = JSON.parse(data.error.error);
                            $.each(error, function(i, value) {
                                let div = '<span class="text-danger">';
                                $.each(value, function(j, message) {
                                    div += `- ${message.message}<br>`;
                                });
                                $(`#id_${row_id}-${i}`).parent().append(div);
                            });
                        }
                        
               
                    }
                   
                },
                error: function(data) {
                    alert('fail');
                    setTimeout(function() {
                        control_button(true);
                        func_btn_new("1");
                        func_btn_save("1");
                    }, 2010);
                }
            });
        }

    });

    let daily_type = 'receipt'
    let receipt_voucher_url = 'receipt_voucher'
    $(document).on('click', '#show_daily_constraints_btn', function() {
        let daily_entry = $("#id_bond_number").attr("daily_entries");
        $('#div_daily_constraints').load(daily_constraints + `?daily_constraint_type=${daily_type}&url=${receipt_voucher_url}&dialy_entry_id=${daily_entry}`);
    });
 
});
