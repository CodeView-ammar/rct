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
$(document).ready(function() {


    table2 = $('.datatable_list_entry').DataTable({
        "aaSorting": [],
        "pageLength": 10,
        // "data":{"request_afeef":request_afeef},
        "searching": true,
        "bProcessing": true,
        "bServerSide": true,
        "sAjaxSource": urls_json_entry,
        "language": lang,
        "pagingType": "full_numbers",
        destroy: true,
    });

    $('#load_div').load(load_url);

    function updateElementIndex(el, prefix, ndx) {
        var id_regex = new RegExp('(' + prefix + '-\\d+-)');
        var replacement = prefix + '-' + ndx + '-';
        if ($(el).attr("for")) $(el).attr("for", $(el).attr("for").replace(id_regex,
            replacement));
        if (el.id) el.id = el.id.replace(id_regex, replacement);
        if (el.name) el.name = el.name.replace(id_regex, replacement);

    }


    function change_exchange_rate(index_row) {
        let prefix = String($('.add_rows_form').attr('id'));

        if ($('#id_' + prefix + '-' + index_row + '-credit').attr('readonly') && $('#id_' + prefix + '-' + index_row + '-credit_foreigner').val()) {
            let amount = parseFloat($('#id_' + prefix + '-' + index_row + '-credit_foreigner').val()) * parseFloat($('#id_' + prefix + '-' + index_row + '-exchange_rate').val());
            $('#id_' + prefix + '-' + index_row + '-credit').val(amount)

        }
        if ($('#id_' + prefix + '-' + index_row + '-debit').attr('readonly') && $('#id_' + prefix + '-' + index_row + '-debit_foreigner').val()) {
            let amount = parseFloat($('#id_' + prefix + '-' + index_row + '-debit_foreigner').val()) * parseFloat($('#id_' + prefix + '-' + index_row + '-exchange_rate').val());
            $('#id_' + prefix + '-' + index_row + '-debit').val(amount)

        }

    }

    function get_total() {

        let total_debit = 0;
        $('.debit').each(function() {
            if (!isNaN(parseFloat($(this).val()))) {
                total_debit += parseFloat($(this).val());
            }
        });
        $('input[name="total_Debit"]').val(parseFloat(total_debit));
        let total_credit = 0;
        $('.credit').each(function() {
            if (!isNaN(parseFloat($(this).val()))) {
                total_credit += parseFloat($(this).val());
            }
        });
        $('input[name="total_Credit"]').val(parseFloat(total_credit));
        let total = total_debit - total_credit;
        $('input[name="total"]').val(total);

    }



    function compare_total_amount() {
        let total_debit = 0;
        $('.debit').each(function() {
            if (!isNaN(parseFloat($(this).val()))) {
                total_debit += parseFloat($(this).val());
            }
        });

        $('input[name="total_Debit"]').val(parseFloat(total_debit));
        let total_credit = 0;
        $('.credit').each(function() {
            if (!isNaN(parseFloat($(this).val()))) {
                total_credit += parseFloat($(this).val());
            }
        });

        $('input[name="total_Credit"]').val(parseFloat(total_credit));
        let total = total_debit - total_credit;
        // $('input[name="total"]').val(total);
        // alert(total_debit)
        // alert(parseFloat($('.amount').val()))
        if (total_debit != parseFloat($('.amount').val()) || total_credit != parseFloat($('.amount').val())) {
            return 'no';
        } else {
            return 'yes';

        }
    }

    function nameCurrency(selector) {
        let prefix = String($('.add_rows_form').attr('id'));
        var formCount = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());

        var currency_id = parseInt($(selector).val());
        //let type_account = $(`#id_${prefix}-${formCount - 1}-analytical_account`);

        var currency_index = $(selector).attr('id').split('-')[1];


        var id_exchange_rate = 'id_' + prefix + '-' + currency_index + '-exchange_rate';
        var id_debit = 'id_' + prefix + '-' + currency_index + '-debit';
        var id_credit = 'id_' + prefix + '-' + currency_index + '-credit';
        var id_debit_foreigner = 'id_' + prefix + '-' + currency_index + '-debit_foreigner';
        var id_credit_foreigner = 'id_' + prefix + '-' + currency_index + '-credit_foreigner';

        $("#" + id_debit).val('');
        $("#" + id_credit).val('');
        $("#" + id_debit_foreigner).val('');
        $("#" + id_credit_foreigner).val('');



        if (currency_id) {
            $.ajax({
                url: url_currinfo,
                method: 'get',
                data: {
                    'id': currency_id,
                },
                success: function(data) {
                    var res = JSON.parse(data);
                    var type_cuureny;

                    type_cuureny = res[0].fields['currency_type']
                        //  = 
                    $("#" + id_exchange_rate).val(res[0].fields['exchange_rate']);
                    $("#" + id_exchange_rate).attr('max', res[0].fields['highest_conversion_rate']);
                    $("#" + id_exchange_rate).attr('min', res[0].fields['lowest_conversion_rates']);

                    $("#" + id_debit).removeAttr('readonly');
                    $("#" + id_credit).removeAttr('readonly');
                    $("#" + id_debit_foreigner).removeAttr('readonly');
                    $("#" + id_credit_foreigner).removeAttr('readonly');
                    $("#" + id_exchange_rate).removeAttr('readonly');


                    $("#" + id_debit).removeAttr('disabled');
                    $("#" + id_credit).removeAttr('disabled');
                    $("#" + id_debit_foreigner).removeAttr('disabled');
                    $("#" + id_credit_foreigner).removeAttr('disabled');
                    $("#" + id_exchange_rate).removeAttr('disabled');

                    if (type_cuureny == 'local') {
                        // $("#" + id_exchange_rate).val(1);
                        $("#" + id_debit_foreigner).attr('readonly', true);
                        $("#" + id_credit_foreigner).attr('readonly', true);
                        $("#" + id_exchange_rate).attr('readonly', 'readonly');

                        $("#" + id_debit).attr('required', 'required');
                        $("#" + id_credit).attr('required', 'required');
                    } else if (type_cuureny == 'foreign') {
                        $("#" + id_debit).attr('readonly', 'readonly');
                        $("#" + id_credit).attr('readonly', 'readonly');
                        $("#" + id_debit_foreigner).attr('required', 'required');
                        $("#" + id_credit_foreigner).attr('required', 'required');
                    }
                },
                error: function(data) {}
            });
        }
    }


    ////////////////  Events    //////////////////////
    // $(document).on('click', '.add_rows_form', function () {
    //     let prefix = String($(this).attr('id'));
    //     var formCount = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
    //     if (formCount < 1000) {

    //         var row = $(".dynamic-form:last").clone(false).get(0);
    //         alert(row)

    //         let tr = `<select name="${prefix}-${formCount}-account" data-row="class_row" class="formset-field form-control name_account s select2-hidden-accessible" id="id_${prefix}-${formCount}-account" data-autocomplete-light-language="en" data-autocomplete-light-url="${account_auto_url}" data-autocomplete-light-function="select2" data-select2-id="id_${prefix}-${formCount}-account" tabindex="-1" aria-hidden="true">
    //         </select><span class="select2 select2-container select2-container--default select2-container--below select2-container--focus" dir="ltr" data-select2-id="${formCount}" style="width: 183px;"></span>`;
    //         $(row).find('.col_account').html(tr);
    //         $(row).find('.col_account').attr('data-select2-id', formCount);
    //         $(`#id_${prefix}-${formCount}-account`).css('outline', '');

    //         let tr1 = `<select name="${prefix}-${formCount}-analytical_account" data-row="class_row" class="formset-field form-control name_analytical_account select2-hidden-accessible" id="id_${prefix}-${formCount}-analytical_account" data-autocomplete-light-language="ar" data-autocomplete-light-url="${analyticsl_account_url}" data-autocomplete-light-function="select2" data-select2-id="id_${prefix}-${formCount}-analytical_account" tabindex="-1" aria-hidden="true">
    //         </select><span class="select2 select2-container select2-container--default select2-container--below select2-container--focus" dir="ltr" data-select2-id="${formCount}" style="width: 183px;"></span>
    //         <div style="display:none" class="dal-forward-conf" id="dal-forward-conf-for_id_${prefix}-${formCount}-analytical_account"><script type="text/dal-forward-conf">[{"type": "field", "src": "account"}]</script></div>`;
    //         $(row).find('.td_first').html(tr1);

    //         $(row).find('.counter').text(formCount + 1);
    //         $("span[cass='text-danger']", row).remove();
    //         $(row).children().removeClass("error");
    //         $(row).find('.classallfeild').each(function () {
    //             var name = $(this).attr('name').replace('-' + (formCount - 1) + '-', '-' + formCount + '-');
    //             var id = 'id_' + name;
    //             $(this).attr({ 'name': name, 'id': id });
    //             $(this).val('');
    //             $(this).removeAttr('value');
    //             $(this).removeAttr('disabled');
    //             $(this).removeAttr('readonly');
    //             // $(this).removeAttr('required');

    //         });

    //         // $(row).removeAttr('id').insertAfter($('.dynamic-form:last')).children('.hidden').removeClass('.hidden');

    //         $(row).find('.td_first').children('input').attr('readonly', 'readonly');
    //         $('.dynamic-form').append(row);

    //         // $(row).find('.td_first').children('input').attr('readonly', 'readonly');
    //         $("#id_" + prefix + '-' + formCount + '-note').attr('required', 'required');
    //         $('#id_' + prefix + '-TOTAL_FORMS').val(formCount + 1);

    //         return false;

    //     }
    // });
    // function updateElementFormset(el, prefix, ndx) {
    //     var id_regex = new RegExp('(' + prefix + '-\\d+-)');
    //     var replacement = prefix + '-' + ndx + '-';
    //     if ($(el).attr("for")) $(el).attr("for", $(el).attr("for").replace(id_regex,
    //         replacement));
    //     if (el.id) el.id = el.id.replace(id_regex, replacement);
    //     if (el.name) el.name = el.name.replace(id_regex, replacement);
    // }

    function updateElementFormset(el, prefix, ndx) {
        var id_regex = new RegExp('(' + prefix + '-\\d+-)');
        var replacement = prefix + '-' + ndx + '-';
        if ($(el).attr("for")) $(el).attr("for", $(el).attr("for").replace(id_regex,
            replacement));
        if (el.id) el.id = el.id.replace(id_regex, replacement);
        if (el.name) el.name = el.name.replace(id_regex, replacement);
    }



    $(document).on('click', '.add_rows_form', function() {
        let prefix = String($(this).attr('id'));
        var formCount = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
        var row = $(".item:last").clone(false).get(0);
        // alert(row)
        let tr = `<select name="${prefix}-${formCount}-account" data-row="class_row" class="formset-field form-control name_account s select2-hidden-accessible" id="id_${prefix}-${formCount}-account" data-autocomplete-light-language="ar" data-autocomplete-light-url="${account_auto_url}" data-autocomplete-light-function="select2" data-select2-id="id_${prefix}-${formCount}-account" tabindex="-1" aria-hidden="true">
           </select><span  class="select2 select2-container select2-container--default select2-container--below select2-container--focus" dir="ltr" data-select2-id="${formCount}" style="width: 183px;"></span>`;
        $(row).find('.td_two').html(tr);
        $(row).find('.td_two').attr('data-select2-id', formCount);
        // $(`#id_${prefix}-${formCount}-account`).css('outline', '');
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


    $(document).on('change', '.name_account', function() {

        let prefix = String($('.add_rows_form').attr('id'));
        var formCount = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
        var account_id = parseInt($(this).val());
        // let type_account = $(`#id_${prefix}-${formCount - 1}-analytical_account`);

        var account_index = $(this).attr('id').split('-')[1];
        var id_currency = 'id_' + prefix + '-' + account_index + '-currency';
        $("#" + id_currency).html('');

        var id_debit = 'id_' + prefix + '-' + account_index + '-debit';
        var id_credit = 'id_' + prefix + '-' + account_index + '-credit';
        var id_debit_foreigner = 'id_' + prefix + '-' + account_index + '-debit_foreigner';
        var id_credit_foreigner = 'id_' + prefix + '-' + account_index + '-credit_foreigner';
        var id_cost_center = 'id_' + prefix + '-' + account_index + '-cost_center';
        // alert('2')

        // // Prevent non-recurring account
        // var ac_id = $(this).val()
        // var counter = 0
        // $('.name_account s').each(function () {
        //     if ($(this).val() != '') {
        //         if ($(this).val() == ac_id) {
        //             counter = counter + 1

        //         }
        //     }
        // });

        // if (counter > 1) {
        //     alert(message_change_account)
        //     $(this).val('')
        //     $(this).text('--------')
        //     return false;
        // }
        // alert('as')
        // reset filed Clear data of debit credit 
        // $(`#id_${prefix}-${account_index}-analytical_account`).children('option').remove();
        $("#" + id_debit).val('');
        $("#" + id_credit).val('');
        $("#" + id_debit_foreigner).val('');
        $("#" + id_credit_foreigner).val('');
        if (account_id) {
            $.ajax({
                url: account_currency,
                method: 'get',
                data: {
                    'id': account_id,
                },
                success: function(data) {
                    // alert('5')
                    $("#" + id_cost_center).removeAttr('Disabled');
                    $("#" + id_cost_center).removeAttr('Required');
                    $("#" + id_cost_center).attr(data.cost_center, data.cost_center);
                    // var option = "";
                    let option = `<option value="">--------</option>`;
                    var res = JSON.parse(data.data);
                    $.each(res, function(i, cur) {
                        var name = cur.fields['name_ar']
                        option += '<option value="' + cur.pk + '">' + name + '</option>';
                    });

                    $("#" + id_currency).html('');
                    $("#" + id_currency).append(option);
                    $("#" + id_currency).attr('readonly', false);
                    // nameCurrency(("#" + id_currency));
                },
                error: function(data) {
                    // alert('6')
                }
            });
        }
    });


    $(document).on('change', '.name_currency', function(e) {
        e.preventDefault();
        nameCurrency(this);

        return false;
    });

    $(document).on('click', '.remove-row', function() {
        let prefix = String($(this).attr('id'));

        var total = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
        if (total > 2) {
            $(this).closest('.dynamic-form').remove();
            var forms = $('.dynamic-form');
            $('#id_' + prefix + '-TOTAL_FORMS').val(forms.length);
            // var formCount2 = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
            // alert(formCount2)  
            // $(".dynamic-form:last").find('td:first').text(formCount2 - 1);
            for (var i = 0, formCount = forms.length; i < formCount; i++) {
                $(forms.get(i)).find('.classallfeild').each(function() {
                    $(forms.get(i)).find('.counter').text(i + 1);
                    updateElementIndex(this, prefix, i);

                });
                // $(".counter").children('td:first').text(i);
            }

        }
        get_total();
        return false;

    });

    $(document).on('keyup', '.debit', function() {
        let prefix = String($('.add_rows_form').attr('id'));
        let index_row = $(this).attr('id').split('-')[1];
        if ($(this).val() && $(this).val()!="0.0") {
            $('#id_' + prefix + '-' + index_row + '-credit').val('0.0');
            $('#id_' + prefix + '-' + index_row + '-credit').removeAttr('required');
            $('#id_' + prefix + '-' + index_row + '-credit').attr('readonly',"readonly");
        } else {
            $('#id_' + prefix + '-' + index_row + '-debit').attr('required', 'required');
            $('#id_' + prefix + '-' + index_row + '-credit').attr('required', 'required');
            $('#id_' + prefix + '-' + index_row + '-credit').removeAttr('readonly');
        }

        get_total();
    });
//     del_disabled=(tr=true)=>{
//     let prefix = String($('.add_rows_form').attr('id'));
//     var formCount = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
//     if (formCount > 1) {
//         var forms = $('.name_debit'); // Get all the forms
//         var i = 0;
//         // Go through the forms and set their indices, names and IDs
//         for (i=0; i < formCount; i++) {
        
//             $('#id_' + prefix + '-' + i + '-credit').removeAttr('disabled');
//             $('#id_' + prefix + '-' + i + '-debit').removeAttr('disabled');
//             alert("credit->"+$('#id_' + prefix + '-' + i + '-credit').val());
//             alert("debit->"+$('#id_' + prefix + '-' + i + '-debit').val());

//     }
//     }
    
// }

    $(document).on('keyup', '.credit', function() {
        let prefix = String($('.add_rows_form').attr('id'));
        let index_row = $(this).attr('id').split('-')[1];
        if ($(this).val() && $(this).val()!="0.0") {
            $('#id_' + prefix + '-' + index_row + '-debit').val('0.0');
            $('#id_' + prefix + '-' + index_row + '-debit').removeAttr('required');
            $('#id_' + prefix + '-' + index_row + '-debit').attr('readonly', "readonly");


        } else {
            $('#id_' + prefix + '-' + index_row + '-debit').attr('required', 'required');
            $('#id_' + prefix + '-' + index_row + '-credit').attr('required', 'required');
            $('#id_' + prefix + '-' + index_row + '-debit').removeAttr('readonly');


        }
        get_total();
    });

    $(document).on('change', '.debit_foreigner', function() {
        let prefix = String($('.add_rows_form').attr('id'));
        let index_row = $(this).attr('id').split('-')[1];
        let val = 0;
        if ($(this).val() && $(this).val()!="0.0") {
            val = $(this).val();
            $('#id_' + prefix + '-' + index_row + '-credit_foreigner').val('');

            $('#id_' + prefix + '-' + index_row + '-credit_foreigner').removeAttr('required');
            $('#id_' + prefix + '-' + index_row + '-credit_foreigner').attr('readonly',"readonly");

        } else {
            $('#id_' + prefix + '-' + index_row + '-credit_foreigner').attr('required', 'required');
            $('#id_' + prefix + '-' + index_row + '-debit_foreigner').attr('required', 'required');
            $('#id_' + prefix + '-' + index_row + '-credit_foreigner').removeAttr('readonly');


        }
        var exchange_rate = $('#id_' + prefix + '-' + index_row + '-exchange_rate').val();
        if (parseFloat(exchange_rate)) {
            let amount = parseFloat(val) * parseFloat(exchange_rate);
            $('#id_' + prefix + '-' + index_row + '-debit').val(amount);
            $('#id_' + prefix + '-' + index_row + '-credit_foreigner').val('');
            $('#id_' + prefix + '-' + index_row + '-credit_foreigner').removeAttr('required');
            $('#id_' + prefix + '-' + index_row + '-credit').val('');

        }
        get_total();
    });

    $(document).on('change', '.credit_foreigner', function() {
        let prefix = String($('.add_rows_form').attr('id'));
        let index_row = $(this).attr('id').split('-')[1];
        let val = 0;
        if ($(this).val() && $(this).val()!="0.0") {
            val = $(this).val();
            $('#id_' + prefix + '-' + index_row + '-debit_foreigner').val('');
            $('#id_' + prefix + '-' + index_row + '-debit_foreigner').removeAttr('required');
            $('#id_' + prefix + '-' + index_row + '-debit_foreigner').attr('readonly',"readonly");
        } else {
            $('#id_' + prefix + '-' + index_row + '-credit_foreigner').attr('required', 'required');
            $('#id_' + prefix + '-' + index_row + '-debit_foreigner').attr('required', 'required');
            $('#id_' + prefix + '-' + index_row + '-debit_foreigner').removeAttr('readonly');

        }
        // if(val)
        var exchange_rate = $('#id_' + prefix + '-' + index_row + '-exchange_rate').val();
        if (parseFloat(exchange_rate)) {
            let amount = parseFloat(val) * parseFloat(exchange_rate);

            $('#id_' + prefix + '-' + index_row + '-credit').val(amount);
            $('#id_' + prefix + '-' + index_row + '-debit_foreigner').val('');
            $('#id_' + prefix + '-' + index_row + '-debit_foreigner').removeAttr('required');
            $('#id_' + prefix + '-' + index_row + '-debit').val('');
        }
        get_total();
    });


    $(document).on('keyup', '.exchange_rate', function(evt) {
        if (evt.key >= 0 || evt.key <= 9 || evt.keyCode == 8) {
            let amount = parseFloat($(this).val());
            let _max = parseFloat($(this).attr('max'))
            let _min = parseFloat($(this).attr('min'))


        }
        let index_row = $(this).attr('id').split('-')[1];
        change_exchange_rate(index_row);

        get_total();

    });

    $(document).on('change', '.exchange_rate', function(evt) {
        let amount = parseFloat($(this).val());
        let _max = parseFloat($(this).attr('max'))
        let _min = parseFloat($(this).attr('min'))
        if (amount > _max || amount < _min || isNaN(amount)) {
            if (amount > _max) {

                $(this).val(_max);
            }
            if (amount < _min || isNaN(amount)) {

                $(this).val(_min);
            }
        }

        let index_row = $(this).attr('id').split('-')[1];
        change_exchange_rate(index_row);
        get_total();

    });



    $(document).on('change', '#id_recurring_entry', function(evt) {

        is_check = $(this).prop('checked');
        if (is_check) {
            $('input[name="reverse_entry"]').attr('disabled', 'disabled');

            // $('#Previous_recurring_entry_btn').hide();
            $('#Previous_recurring_entry_btn').removeClass('hidden');
        } else {
            $('input[name="reverse_entry"]').removeAttr('disabled');
            $('#Previous_recurring_entry_btn').addClass('hidden');

        }
    });

    $(document).on('change', '#id_reverse_entry', function(evt) {
        is_check = $(this).prop('checked');
        if (is_check) {
            $('input[name="recurring_entry"]').attr('disabled', 'disabled');
        } else {
            $('input[name="recurring_entry"]').removeAttr('disabled');
        }
    });


    $(document).on('click', '#btn_delete', function(e) {
        let id_row_ = $("#id_id").val();
        
        if (id_row_ != null) {
            if (confirm_delete()) {
                $.ajax({
                    url: urls,
                    data: { 'id': id_row_ },
                    method: 'delete',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("X-CSRFToken", csrf_token);
                    },
                    success: function(data) {
                        if (data.status == 1) {
                            $('span[class="text-danger"]').remove();
                            $('#form_entries')[0].reset();
                            // $('#form_master')[0].reset();

                            $('#load_div').load(load_url);

                            alert_message(data.message.message, data.message.class);
                            // $(this).hide();
                           

                            table.ajax.reload();


                        } else if (data.status == 0) {

                            if (data.message.message != '') {

                                alert_message(data.message.message, data.message.class);
                            }

                        }
                        // $('#submit-button').button('reset');
                    },
                    error: function(data) {
                        alert('fail');
                    }

                });
            }
        }
        return false;
    });

    // $( document ).ready(function() {

    // });


    let form_id = '#form_entries';
    $(document).on('submit', form_id, function(e) {
        
            // var f = compare_total_amount();
            // if (f == 'yes') {
        // Get the values of the three fields.
        const totalDebit = $('input[name="total_Debit"]').val();
        const totalCredit = $('input[name="total_Credit"]').val();
        const idAmount = $('#id_amount').val();
        
        // Check if any of the fields are not equal.
        if (totalDebit !== totalCredit || totalDebit !== idAmount || totalCredit !== idAmount) {
        alert('يجب أن يكون المبلغ مساويًا لإجمالي الكلي')
        $(`input[name="total_Debit"]`).css('outline', 'red auto');
        $(`input[name="total_Credit"]`).css('outline', 'red auto');
        $(`#id_amount`).css('outline', 'red auto');
            return false;
        }else{
            $(`input[name="total_Debit"]`).css('outline', '');
            $(`input[name="total_Credit"]`).css('outline', '');
            $(`#id_amount`).css('outline', '');
                
        }
        e.preventDefault();
                let forms = new FormData(this);
                $('input[name="deported"]').removeAttr('readonly');
                forms.append('branch', $("#id_branch option:selected").val());
                forms.append('deported', $('input[name="deported"]').val());
                forms.append('reverse_entry', $('input[name="reverse_entry"]').val());
                forms.append('recurring_entry', $('input[name="recurring_entry"]').val());
                forms.append('operation_date', $('#id_operation_date').val());
                forms.append('number', $('input[name="number"]').val());
                forms.append('amount', $('input[name="amount"]').val());
                forms.append('deported', $('input[name="deported"]').prop('checked'));
                forms.append('reverse_entry', $('input[name="reverse_entry"]').prop('checked'));
                forms.append('recurring_entry', $('input[name="recurring_entry"]').prop('checked'));

                forms.append('note', $('#id_note').val());

                // Add ID when Update the data of form 

                if (normal_entry_or_Recurring == 1) {
                    let id_row_ = $("#id_id").val();
                    if (id_row_ != null) {
                        forms.append('id',id_row_);
                    }
                } else {
                    forms.append('entries-INITIAL_FORMS', 0);

                }
                // del_disabled(false);
                $.ajax({
                    url: $(this).attr('action'),
                    data: forms,
                    method: 'POST',
                    contentType: false,
                    processData: false,
                    success: function(data) {
                        $('input[name="deported"]').attr('readonly', 'readonly');
                        $('span[class="text-danger"]').remove();
                        
                        if (data.status == 1) {
                            
                            // $(`textarea`).text('');
                            // del_disabled(true);
                            // $('#form_master')[0].reset();
                            $('#id_amount').val('')
                            $('#id_note').val(data.note)
                            
                            // alert('Susecc')a
                            
                            $('#load_div').load(load_url);
                            alert_message(data.message.message, data.message.class, 0);
                            $('#id_number').val(data.max_entry_number)
                            // $('#load_div').children().remove();
                            table.ajax.reload();
                            
                            var answer = window.confirm("هل تريد طباعه القيد اليومي?");
                            if (answer) {
                                create_Entry_report(data.id);
                                $("#ReportAfterSave").modal('show');
                            }
                            // print_custom('Daily Entry Reports', 'dailyentries', data.id)
                            $('#id_reverse_entry').prop('checked', false);
                            $('#id_recurring_entry').prop('checked', false);
                            $('span[class="text-danger"]').remove();
                            $(form_id)[0].reset();

                        } else if (data.status == 2) {

                            $.each(data.error, function() {
                                let form = $(this)[0].form_id;
                                $(`#id_${form}-accounts`).parents('.item').css('outline', 'red auto');
                                alert_message($(this)[0].message, 'alert alert-danger', 0);
                            });
                            del_disabled(true);
                        } else if (data.status == 0) {
                            if (data.message.message != '') {

                                alert_message(data.message.message, data.message.class, 0);
                            }
                            let row_id = data.error.form_id;
                            let row_id2 = data.error['form_id'];

                            let error = JSON.parse(data.error.error);

                            $.each(error, function(i, value) {
                                let div = '<span class="text-danger">';
                                $.each(value, function(j, message) {
                                    div += `- ${message.message}<br>`;
                                });

                                $(`#id_${row_id}-0-${i}`).parent().append(div);
                            });
                        }
                    },
                    error: function(data) {
                        alert('fail');
                        $('input[name="deported"]').attr('readonly', 'readonly');

                    }
                });

            // } else {
            //     if($('#id_note').val()){

            //     }
            //     alert(message_err);
            //     $("#btn_update").click();
            //     return false;
            // }
        

    });

});


// function chick_repate() {
//     var formCount = parseInt($('#id_entries-TOTAL_FORMS').val());
//     var flag = 1;
//     // for(i=0;i<formCount-1;i++){
//     //     for(j=i+1;j<formCount;j++){
//     //         var div = '<span class="text-danger">';

//     //         div += `- ${message_change_account}<br>`;

//     //         if(($(`#id_entries-${i}-account`).val() == $(`#id_entries-${j}-account`).val()) && ($(`#id_entries-${i}-analytical_account`).val() == $(`#id_entries-${j}-analytical_account`).val()) && ($(`#id_entries-${i}-currency`).val() == $(`#id_entries-${j}-currency`).val())&& ($(`#id_entries-${i}-cost_center`).val() == $(`#id_entries-${j}-cost_center`).val())){
//     //         $(`#id_entries-${i}-account`).parent().append(div);
//     //         $(`#id_entries-${j}-account`).parent().append(div);


//     //             flag = 0;
//     //         }




//     //     }
//     // }
//     return flag;
// }