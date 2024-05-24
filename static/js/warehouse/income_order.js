function max_number(){
    $.ajax({
        url: url_get_code_incom,
        method: 'get',
        success: function(data) {
            if (data.status == 1) {
                $('#id_code').val(data.data);
                $('#id_code').attr('readonly', true);
            }
        },
        error: function(data) {}
    });
  
}
$(document).ready(function() {
    max_number();
    $(".main-header>.navbar").toggleClass('margin-50');
    $(".content-wrapper>.content-header").toggleClass('margin-50');
    $("#contentMain>.row").toggleClass('margin-right-row');
    $("#total_div").toggleClass('margin-5');
    $(".main-footer").toggleClass('margin-50');
    $('body.skin-blue.sidebar-mini').toggleClass('sidebar-collapse');



    function print_error_formset(error) {
        $.each(error, function(index1, errors1) {
            var x = JSON.parse(errors1.errors);
            $.each(x, function(i, value) {
                let div = '<span class="text-danger">';
                $.each(value, function(j, message) {
                    div += `- ${message.message}<br>`;
                });

                $(`#id_IncomeOrderDetails-${errors1.row}-${i}`).parent().append(div);
            });

        });
    }



    let daily_type = 'incomming_order'
    $(document).on('click', '#show_daily_constraints_btn', function() {
        let daily_entry = $("#id_code").attr("daily_entries");
        $('#div_daily_constraints').load(daily_constraints + `?daily_constraint_type=${daily_type}&url=${url_create_incoming_order}&dialy_entry_id=${daily_entry}`);
    });
    $(document).on('click', `#add_new`, function() {


        open_change_class_buttons();
        clearForm();
    });

    $(document).on('submit', '#form_income1', function(e) {
        e.preventDefault();
        let form_id = '#form_income1';
        $(".text-danger", form_id).remove();
        let i = is_valied();

        if (i) {
            //prevent submit form and submit by ajax        
            $.ajax({
                url: $(this).attr('action'),
                data: $(this).serialize(),
                method: 'POST',
                success: function(data) {
                    $(".text-danger", form_id).remove();

                    if (data.status == 1) {
                        clearForm();

                        let invoice_rows = parseInt($('#id_' + 'IncomeOrderDetails' + '-TOTAL_FORMS').val());
                        for (i = 0; i <= invoice_rows; i++) {

                            deleteForm($('#IncomeOrderDetails'), String($('.added1').attr('id')));
                        }

                        alert_message(data.message.message, data.message.class);

                        print_custom("Income Order Report", "incomeorder", data.id);

                        table.ajax.reload();
                        max_number();
                    } else if (data.status == 2) {
                        $.each(data.error, function() {
                            let form = $(this)[0].form_id;
                            alert_message($(this)[0].message, 'alert alert-danger');
                        });
                    } else if (data.status == 0) {
                        print_error_formset(data.error_formset);
                        let invoice_rows = parseInt($('#id_' + 'IncomeOrderDetails' + '-TOTAL_FORMS').val());
                        let error = JSON.parse(data.error);
                        $.each(error, function(i, value) {
                            let div = '<span class="text-danger">';
                            $.each(value, function(j, message) {
                                div += `- ${message.message}<br>`;
                            });

                            $(`#id_${i}`).parent().append(div);
                        });

                    } else if (data.status == 3) {
                        alert_message(String(data.message.message), 'alert alert-warning', 'fa fa-times');

                    }
                   
                   
                },
                error: function(data) {
                    //alert_message(String(data.message ), 'alert alert-warning', 'fa fa-times');


                    
                }
            });
        }
    });

    $(document).on('dblclick', '.show_Operation>tr', function() {
        $('#form_income1').trigger("reset");
        let id_row = $(this).children('td:nth(0)').children('.row_span_id').data('id');
      
        $.ajax({
            url: url_create_incoming_order,
            data: { 'id': id_row, },
            method: 'get',
            success: function(data) {
             



                table.ajax.reload();

                let form_data = JSON.parse(data.data);
                let dataItem = data.dataitem
                         
                let formset_data = JSON.parse(data.detail);

                let invoice_rows = parseInt($('#id_' + 'IncomeOrderDetails' + '-TOTAL_FORMS').val());
                $(`#id_code`).val(form_data[0].code);
                $("#id_invoice").val(form_data[0].id);
                if (data.status === 1) {
                    let account_option = `<option selected value="${form_data[0].account}">${form_data[0].account__arabic_name}</option>`;
                    $("#id_account").append(account_option);
                    if (form_data[0].supplir) {
                        let supplier_optoin = `<option selected value="${form_data[0].supplir}">${form_data[0].supplir__name}</option>`;
                        $('#id_supplir').append(supplier_optoin);
                    }
                    // $('#id_analytical_account').val(form_data[0].analytical_id).trigger("change")
                    // var data = {
                    //     id: 1,
                    //     text: 'Barn owl'
                    // };

                    // var newOption = new Option(data.text, data.id, false, false);
                    // $('#mySelect2').append(newOption).trigger('change');
                    // console.log(form_data)
                    if (form_data[0].analytical_id) { 

                        // let analytical_account_optoin = `<option selected value="${form_data[0].analytical_id}">${form_data[0].analytical_id}</option>`;
                        // $('#id_analytical_account').append(analytical_account_optoin);
                      
                        $('#id_analytical_account').prop('selectedIndex', form_data[0].analytical_id);
                    }

                    if (form_data[0].store) {

                        let store_option = `<option selected value="${form_data[0].store}">${form_data[0].store__name}</option>`;
                        $("#id_store").children('option').remove();
                        $("#id_store").append(store_option);
                    }
                    console.log(form_data[0])
                    if (form_data[0].cost_center!=null) {

                        let cost_center_option = `<option selected value="${form_data[0].cost_center}">${form_data[0].cost_center__name_ar}</option>`;
                        $("#id_cost_center").append(cost_center_option);
                    }
                    if (form_data.length !== 0) {
                        $.each(form_data[0], function(i, value) {
                            if (!$('#id_' + i).is(":text")) {
                                $(`textarea[name=${i}]`).text(value);

                            }
                            if (!$('#id_' + i).is(":checkbox")) {
                                $(`input[name="${i}"]`).val(value);
                            }
                            if ($('#id_' + i).is(":checkbox")) {
                                if (value === true) {
                                    $(`input[name="${i}"][type="checkbox"]`).val(value);
                                    $(`input[name="${i}"][type="checkbox"]`).attr('checked', 'checked');
                                } else {
                                    $(`input[name="${i}"][type="checkbox"]`).val(false);
                                    $(`input[name="${i}"][type="checkbox"]`).removeAttr('checked');
                                }
                                

                            }
                            $(`select[name="${i}"] option[value="${value}"]`).attr('selected', 'selected');
                            if (i == "daily_entries") {

                                $("#id_code").attr('daily_entries', value);
                            }




                        });
                        close_change_class_buttons();
                    }



                    if (formset_data.length !== 0) {
                        if (invoice_rows > 1) {

                            for (i = 0; i <= invoice_rows; i++) {
                                deleteForm($('#IncomeOrderDetails'), String($('.added1').attr('id')));

                            }

                        }
       
                        let row_counter = 0;
                        $.each(formset_data, function() {
                            
                            if (row_counter != 0) {
                                
                                addForm($('.added1'), String($('.added1').attr('id')));
                            }
                            
                            $.each(formset_data[row_counter].fields, function(i, value) {
                            
                                $(`input[name="IncomeOrderDetails-${row_counter}-${i}"]`).val(value);
                        $(`select[name="IncomeOrderDetails-${row_counter}-${i}"] option[value="${value}"]`).attr('selected', true);
                                   
                                
                                
                    });
                    
                            let item_optoin = `<option selected value="${dataItem[row_counter].id}">${dataItem[row_counter].name_ar}</option>`;
                            $(`#id_IncomeOrderDetails-${row_counter}-item `).append(item_optoin);
                            // let unit = $(`#id_IncomeOrderDetails-${row_counter}-unit`);
                            
                            row_counter += 1;
                            
                        });
                        
                    }
                    get_total();                            
                    getAlltotal();

                    $('#Previous_Operations_close').trigger('click');
                    $('#id_payment_method').trigger('change');
                } else if (data.status == 3) {
                    alert_message(String(data.message.message), 'alert alert-warning', 'fa fa-times');

                }
            },
            error: function(data) {}
        });
    });

    $(document).on('click', '#btn_delete', function(e) {
        form_id = '#form_income1';
        if(!$("#id_invoice").val())
        {
            alert_message("يجب عليك إختيار الامر المراد حذفة");
                       
            return;
        }
        var result = confirm(MsgConfirmDel);
        if (result) {
            let id_row = $("#id_invoice").val();
            $.ajax({
                url: $(this).data('url'),
                data: {
                    'id_invoice': id_row,
                },
                method: 'delete',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("X-CSRFToken", csrf);
                },
                success: function(data) {


                    if (data.status == 1) {

                        $(form_id)[0].reset();
                        $(`textarea`).text('');
                        $('select').each(function() {
                            $(this).prop('selectedIndex', 0);
                            $(this).children("option").remove();
                        });
                        // let invoice_rows = parseInt($('#id_' + 'PurchaseInvoicelocalDetails' + '-TOTAL_FORMS').val());
                        // for (i = 0; i <= invoice_rows; i++) {
                        //     deleteForm($('#PurchaseInvoicelocalDetails'), String($('.added1').attr('id')));
                        // }

                        alert_message(data.message.message, data.message.class);
                        table.ajax.reload();


                    } else if (data.status == 3) {
                        alert_message(data.message.message, data.message.class);




                    }
                    table.ajax.reload();
                    // $('#delete_this').addClass('hidden');

                },
                error: function(data) {
                    alert_message("error", 'alert alert-warning', 'fa fa-times');

                }
            });
        }
    });
}); //end ready Docuoment

function getItemunit(id) {
    if (RepeatInItem(id)) {
        url1 = "/get_units_item/";
        var ind = id.name.split('-');
        $(`#id_PurchaseInvoicelocalDetails-${ind[1]}-unit`).html("");
        $(`#id_PurchaseInvoicelocalDetails-${ind[1]}-item_specification`).html("");
        $(`#id_PurchaseInvoicelocalDetails-${ind[1]}-item_specification`).attr("required", false);

        $.ajax({
            url: url_get_units_item,
            data: {
                'id': id.value,
            },
            method: 'get',
            success: function(data) {
                var element = document.getElementById(`id_PurchaseInvoicelocalDetails-${ind[1]}-unit`);
                element.classList.remove("disabled");
                var option;
                $.each(data.data, function(index, units) {
                    option += '<option value="' + index + ' ">' + units + '</option>';
                });
                $(`#id_PurchaseInvoicelocalDetails-${ind[1]}-unit`).html("");
                $(`#id_PurchaseInvoicelocalDetails-${ind[1]}-unit`).append(option);

                // $(`#id_PurchaseInvoicelocalDetails-${ind[1]}-store`).val($('#id_store').children("option:selected").val());
                if (data.data2.is_date == true) {
                    //("asdfghjkl;'\'");
                    $(`#id_PurchaseInvoicelocalDetails-${ind[1]}-expire_date`).attr("required", true);
                } else
                    $(`#id_PurchaseInvoicelocalDetails-${ind[1]}-expire_date`).attr("required", false);

                var element3 = document.getElementById(`id_PurchaseInvoicelocalDetails-${ind[1]}-item_specification`);
                if (element3 != null) {
                    element3.classList.remove("disabled");
                    $(`#id_PurchaseInvoicelocalDetails-${ind[1]}-item_specification`).val(data.data2.dis);
                }



            },
            error: function(data) {}
        });
    }
}

function getTotal(element_id) {
    let index = element_id.name.split('-');
    let qty = 0;
    let price = 0;
    let discount = 0;
    let rate = 0;

    if (!isNaN(parseInt(document.getElementById(`id_PurchaseInvoicelocalDetails-${index[1]}-discount_rate`).value))) {
        rate = parseInt(document.getElementById(`id_PurchaseInvoicelocalDetails-${index[1]}-discount_rate`).value);

    }

    if (!isNaN(parseInt(document.getElementById(`id_PurchaseInvoicelocalDetails-${index[1]}-qty`).value))) {
        qty = parseInt(document.getElementById(`id_PurchaseInvoicelocalDetails-${index[1]}-qty`).value);
    }
    if (!isNaN(parseFloat(document.getElementById(`id_PurchaseInvoicelocalDetails-${index[1]}-price`).value))) {
        price = parseFloat(document.getElementById(`id_PurchaseInvoicelocalDetails-${index[1]}-price`).value);
    }
    if (!isNaN(parseFloat(document.getElementById(`id_PurchaseInvoicelocalDetails-${index[1]}-discount`).value))) {
        discount = parseFloat(document.getElementById(`id_PurchaseInvoicelocalDetails-${index[1]}-discount`).value);
    }
    let i = element_id.id;
    if (i == `id_PurchaseInvoicelocalDetails-${index[1]}-discount_rate`) {
        discount = (qty * price * rate / 100);
        $(`#id_PurchaseInvoicelocalDetails-${index[1]}-discount`).val(discount)
    }
    if (i == (`id_PurchaseInvoicelocalDetails-${index[1]}-discount`)) {
        rate = (discount * 100 / (qty * price));
        $(`#id_PurchaseInvoicelocalDetails-${index[1]}-discount_rate`).val(rate)
    }
    $(`#id_PurchaseInvoicelocalDetails-${index[1]}-total_price`).val((qty * price) - discount);
    getAlltotal();
    getAllDiscountItem();
}

function getAlltotal() {
    let total_debit = 0;
    $('input[id$="-total_price"]').each(function() {
        if (!isNaN(parseFloat($(this).val()))) {
            total_debit += parseFloat($(this).val());
        }
    });

    $("#id_total_amount").val(total_debit);
    getNettotal();

}

function getAllDiscountItem() {
    let total_debit = 0;
    $('input[id$="-discount"]').each(function() {
        if (!isNaN(parseFloat($(this).val()))) {
            total_debit += parseFloat($(this).val());
        }
    });
    $("#id_discount_item").val(total_debit);
}

function getNettotal() {
    let total = 0;
    let descount = 0;
    if (!isNaN(parseFloat($('#id_total_amount').val()))) {
        total = parseFloat($('#id_total_amount').val());
    }
    if (!isNaN(parseFloat($('#id_discount').val()))) {
        descount = parseFloat($('#id_discount').val());
    }
    $("#id_total_net_bill").val(total - descount);
}

function getPercentag(idelment) {
    let value1 = 0;
    let reat = 0;
    let total1 = 0;
    if (idelment.id === 'id_discount_rate') {
        if (!isNaN(parseFloat($('#id_discount_rate').val()))) {
            value1 = parseFloat($('#id_discount_rate').val());
        }
        if (!isNaN(parseFloat($('#id_total_amount').val()))) {
            total1 = parseFloat($('#id_total_amount').val());
        }
        $('#id_discount').val(value1 / 100 * total1)
    }
    if (idelment.id === 'id_discount') {
        if (!isNaN(parseFloat($('#id_discount').val()))) {
            value1 = parseFloat($('#id_discount').val());
        }
        if (!isNaN(parseFloat($('#id_total_amount').val()))) {
            total1 = parseFloat($('#id_total_amount').val());
        }
        $('#id_discount_rate').val(value1 * 100 / total1)
    }
    getNettotal();
}

function getPrice(element_id) {
    let index = element_id.name.split('-');
  
    let qty = 0;
    let total = 0;
    if (!isNaN(parseInt(document.getElementById(`id_PurchaseInvoicelocalDetails-${index[1]}-qty`).value))) {
        qty = parseInt(document.getElementById(`id_PurchaseInvoicelocalDetails-${index[1]}-qty`).value);
        
    }
    if (!isNaN(parseFloat(document.getElementById(`id_PurchaseInvoicelocalDetails-${index[1]}-total_price`).value))) {
        total = parseFloat(document.getElementById(`id_PurchaseInvoicelocalDetails-${index[1]}-total_price`).value);
    }
    $(`#id_PurchaseInvoicelocalDetails-${index[1]}-price`).val(total / qty);
    $(`#id_PurchaseInvoicelocalDetails-${index[1]}-discount`).val(0);
    getAlltotal();
    getAllDiscountItem();
}

function is_valied() {

    let div = '<span class="text-danger">';

    amount = 0;
    total1 = 0;
    check_amount = 0;
    if (!isNaN(parseFloat($('#id_total_net_bill').val()))) {
        total1 = parseFloat($('#id_total_net_bill').val());
    }
    if (!isNaN(parseFloat($('#id_check_amount').val()))) {
        check_amount = parseFloat($('#id_check_amount').val());
    }
    if (!isNaN(parseFloat($('#id_amount').val()))) {
        amount = parseFloat($('#id_amount').val());
    }
    if (amount != total1 && amount != 0) {
        div += `- ${message_error_amount}<br>`;
        alert_message(message_error_amount, 'alert alert-danger');
        $(`#id_amount`).parent().append(div);
        if (!check_amount < total1) {
            div = '<span class="text-danger">';
            div += `- ${message_error_check_amount}<br>`;
            $(`#id_check_amount`).parent().append(div);
            alert_message(message_error_check_amount, 'alert alert-danger');
        }
        return false;
    } else if ((check_amount > total1) && $("#id_payment_method").val() === '4') {
      
        div += `- ${message_error_check_amount}<br>`;
        $(`#id_check_amount`).parent().append(div);
        alert_message(message_error_check_amount, 'alert alert-danger');
        return false;
    } else return true;
}


function RepeatInItem(id) {
    let data = id.name;
    
    $('select[id$="-item"]').each(function() {
        if (this.name != data) {
            if (this.value == id.value) { 

                $(id).children("option").remove();
                return false;
            }
        }
    });
    return true;
}

function clearForm() {
    let form_id = '#form_income1';
    $(form_id)[0].reset();
    $(`textarea`).text('');
    let patent_value =
    `<option selected value=""></option>`;
    
    $('select[id$="-item"]').each(function() {
        $(this).append(patent_value);
    });
    $("#id_store").prop('selectedIndex', 0);
    $("#id_currency").prop('selectedIndex', 0);
    $("#id_cost_center").prop('selectedIndex', 0);
    $('#id_account option').remove();
    // $(`#id_supplir`).children("option").remove();
    // $(`#id_analytical_account`).children("option").remove();

    // $(`#id_cost_center`).children("option").remove();
    // $('select').each(function () {
    //     if (!this.id == ("id_branch")) {
    //       
    //         $(this).prop('selectedIndex', 0);
    //     }
    //     //$(this).children("option").remove();
    // });

    max_number();

}
function get_item_value(element){
    var id = $(element).attr('id');
    var x = id.split('-');

    let prefix = String($(element).attr('id'));
    var formCount = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
    var row = $(".item:last").clone(element).get(0);
    var val_store =$('#id_store_main').val(); // get the selected country ID from the HTML input
    var val_item =$('#id_IncomeOrderDetails-' + x[1] + '-item').val(); // get the selected country ID from the HTML input
    if($('#id_exchange_rate').val()=="0.0")
        {
            $('#id_exchange_rate').val(1)
        }
    $.ajax({
            method: "post", // initialize an AJAX request
            url: url_date_item_inside_store,

            data: {
                
                'val_store': val_store,
                'val_item': val_item,
                'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
            },
            success: function(data, status) {
                let data_expire_date = data.store_quantity;
                let data_use_expire = data.use_expire;
                if(data_use_expire){
                var option_expire_date = `<option value="" selected="">---------</option>`;
                $.each(data_expire_date, function(index, itemData) {
                    

                    option_expire_date += `<option data-quantity_available="${itemData.qty}" value="${itemData.expire_date}">${itemData.expire_date}</option>`;
                });
                $('#id_IncomeOrderDetails-' + x[1] + '-expire_date').html("");
                $('#id_IncomeOrderDetails-' + x[1] + '-expire_date').append(option_expire_date)
            }
                $("#id_IncomeOrderDetails-"+x[1]+"-quantity_available").val(data_expire_date[0]['qty']);
               
                $.ajax({
                    url: url_load_unit_item,
                    data: {
                        'id': val_item,
                    },
                    method: 'get',
                    success: function(data) {
                        var element = document.getElementById(`id_IncomeOrderDetails-${x[1]}-unit`);
                        element.classList.remove("disabled");
                        var option = '';
                        var sortedData = Object.entries(data.data).sort(function(a, b) {
                            if (b[1].is_primary && !a[1].is_primary) {
                            return 1;
                        } else if (!b[1].is_primary && a[1].is_primary) {
                            return -1;
                        } else {
                            return 0;
                        }
                    });
                    $.each(sortedData, function(index, units) {
                            option += '<option value="' + units[0] + '">' + units[1].name + '</option>';
                        });
                        $(`#id_IncomeOrderDetails-${x[1]}-unit`).html("");
                        $(`#id_IncomeOrderDetails-${x[1]}-unit`).append(option);
                        $(`#id_IncomeOrderDetails-${x[1]}-unit`).trigger('change');
                        $(`#id_IncomeOrderDetails-${x[1]}-qty`).val("1");
                        $(`#id_IncomeOrderDetails-${x[1]}-total_price`).html("");
                        

                        if (data.data2.is_date == true) {
                            $(`#id_IncomeOrderDetails-${x[1]}-expire_date`).attr("required", true);
                        } else
                            $(`#id_IncomeOrderDetails-${x[1]}-expire_date`).attr("required", false);
        
    
                        // alert(data.data2.tax_id)
    
                        // alert(data.data2.tax__tax_rate)
                        
                        $(`#id_IncomeOrderDetails-${x[1]}-tax`).val(data.data2.tax_id);
                        $(`#id_IncomeOrderDetails-${x[1]}-tax_rate`).val(data.data2.tax__tax_rate);
    
                        var element3 = document.getElementById(`id_IncomeOrderDetails-${x[1]}-item_specification`);
                        if (element3 != null) {
                            element3.classList.remove("disabled");
                            $(`#id_IncomeOrderDetails-${x[1]}-item_specification`).val(data.data2.dis);
                        }
        
        
        
                    },
                    error: function(data) {}
                });
            

            },
            error: function(data) {
                alert(data.error);
            }

        });
    $.ajax({
            method: "post", // initialize an AJAX request
            url: url_item_cost,
            data: {
                'item': $(`#id_IncomeOrderDetails-${x[1]}-item`).val(),
                'unit': $(`#id_IncomeOrderDetails-${x[1]}-unit`).val(),
                'qty':0,
                'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
            },
            success: function(data, status) {

                var option;
                $.each(data, function(index, itemData) {
                    option = itemData;
                });
                var exchange_rate = parseFloat($('#id_exchange_rate').val());
                var price = parseFloat(option);
                if (!isNaN(exchange_rate)) {
                    price = price / exchange_rate
                }
                alert(price);
                $(`#id_IncomeOrderDetails-${x[1]}-price`).val(price.toFixed(2));
                get_total();
            }
        });    

        
    }

function open_change_class_buttons() {
    $('#add-row1').removeClass('hidden');
    $('.add-form-row').removeClass('hidden');
    $('.delete-row').removeClass('hidden');
    $('#id_code').removeAttr('daily_entries');
    $('#show_daily_constraints_btn').toggleClass('hidden');
    $('#add_new').toggleClass('hidden');
    $('#delete_this').toggleClass('hidden');

}

function close_change_class_buttons() {
    // $('#add-row1').addClass('hidden');
    // $('.add-form-row').addClass('hidden');
    // $('.delete-row').addClass('hidden');
    // $('#show_daily_constraints_btn').removeClass('hidden');
    // $('#add_new').removeClass('hidden');
    // $('#delete_this').removeClass('hidden');

}