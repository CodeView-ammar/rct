$(document).ready(function() {
    $('.nav.navbar.navbar-static-top').toggleClass('margin-50');
    $('body.skin-blue.sidebar-mini').toggleClass('sidebar-collapse');

    //start handel event for payment_methode
    $('#id_payment_method').on('change', function() {
        // $('#id_fund').val(-1);
        // $('#id_bank').val(-1);
        // $('#id_check_amount').val(0);
        let choes = $(this).val();
        if (choes === '1') {
            $('#cash').removeClass('hidden');
            $("#id_fund").attr('required', true);
            $('#check').addClass('hidden');
            $('#cash_check').addClass('hidden');
        }
        if (choes === '2') {
            $('#check').removeClass('hidden');
            $('#cash').addClass('hidden');
            $('#cash_check').addClass('hidden');
        }
        if (choes === '3') {
            $('#cash_check').addClass('hidden');
            $('#cash').addClass('hidden');
            $('#check').addClass('hidden');
        }
        if (choes === '4') {
            $('#cash_check').removeClass('hidden');
            $('#cash').removeClass('hidden');
            $('#check').removeClass('hidden');
        }
        $.ajax({
            url: url_get_code,
            data: { 'payment_method': $(this).val(), },
            method: 'get',
            success: function(data) {

                if (data.status == 1) {
                    // console.log(data.data);

                    $('#id_code').val(data.data);
                    $('#id_code').attr('readonly', true);
                }
            },
            error: function(data) {}
        });

    });
    //end handel event for payment_methode
    $(document).on('change', '#id_store', function() {
        //alert($(this).children("option:selected").val());
    });
    addRowOnTabInTable('#control-formset', '.list_filde','.add_form');

    //handedl currency and form.exchange_rate
    $(document).on('change', '#id_currency', function() {
        let currency_id = $(this).val();
        $.ajax({
            url: urls_,
            data: { 'id': currency_id, },
            method: 'get',
            success: function(data) {
                if (data.status == 1) {
                    let resp = JSON.parse(data.data);
                    $.each(resp[0].fields, function(i, value) {

                        $(`input[name="${i}"]`).val(value);
                        $(`input[name=${i}]`).prop('checked', value);
                        $(`textarea[name=${i}]`).text(value);
                        $(`select[name="${i}"] option`).each(function() {
                            if ($(this).val() == value) {
                                $(this).prop("selected", true);
                            }
                        });
                    });
                    if ($("#id_exchange_rate").val() == 1) {
                        $("#id_exchange_rate").prop("readonly", true);
                    } else {
                        $("#id_exchange_rate").prop("readonly", false);

                    }
                }
            },
            error: function(data) {}
        });
    }); //end handel event handedl currency and form.exchange_rate

    $(document).on('click', '#PurchaseInvoicelocalDetails', function() {
        getAlltotal();
    });
    $(document).on('submit', '#myform_invoic', function(e) {
       
        let form_id = '#myform_invoic';
        $(".text-danger", form_id).remove();
        let i = is_valied();
        e.preventDefault();
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
                        let invoice_rows = parseInt($('#id_' + 'PurchaseInvoicelocalDetails' + '-TOTAL_FORMS').val());
                        for (i = 0; i <= invoice_rows; i++) {
                            deleteForm222($('#PurchaseInvoicelocalDetails'), String($('.added1').attr('id')));
                        }
                        alert_message(data.message.message, data.message.class);

                        table.ajax.reload();
                        setTimeout(function() {
                            control_button(true);
                            func_btn_new("1");
                            func_btn_save("1");
                        }, 2010);
                    } else if (data.status == 2) {
                        $.each(data.error, function() {
                            let form = $(this)[0].form_id;
                            alert_message($(this)[0].message, 'alert alert-danger');
                        });
                        setTimeout(function() {
                            control_button(true);
                            func_btn_new("1");
                            func_btn_save("1");
                        }, 2010);
                    } else if (data.status == 0) {

                        alert_message(data.message, data.class);


                        let invoice_rows = parseInt($('#id_' + 'PurchaseInvoicelocalDetails' + '-TOTAL_FORMS').val());

                        // if (data.message.message != '') {
                        //     alert_message(data.message.message, data.message.class);
                        // }


                        if (!data.error == "") {
                            alert(data.error);
                            let row_id = data.error.form_id;
                            let row_id2 = data.error['myform_invoic'];
                            let error = JSON.parse(data.error.error);
                            $.each(error, function(i, value) {
                                let div = '<span class="text-danger">';
                                $.each(value, function(j, message) {
                                    //console.log(message.message)
                                    div += `- ${message.message}<br>`;
                                });

                                $(`#id_${row_id}-0-${i}`).parent().append(div);
                            });
                        }
                        if (!data.error2 == "") {



                            let error2 = JSON.parse(data.error2);

                     
                            $.each(error2, function(i, value) {
                              
                                let div = '<span class="text-danger">';
                                $.each(value, function(j, message) {
                                    div += `- ${message.message}<br>`;
                                    alert_message(String(message.message), 'alert alert-warning', 'fa fa-times');
                                });
                                $(`#id_PurchaseInvoicelocalDetails-${data.row}-${i}`).parent().append(div);
                            });
                        }
                        setTimeout(function() {
                            control_button(true);
                            func_btn_new("1");
                            func_btn_save("1");
                        }, 2010);
                    } else if (data.status == 3) {
                        alert_message(data.message.message, data.message.class);
                        // alert_message(String(data.message + data.msg), 'alert alert-warning', 'fa fa-times');

                        //alert(data.message + data.msg)
                        setTimeout(function() {
                            control_button(true);
                            func_btn_new("1");
                            func_btn_save("1");
                        }, 2010);
                    }
                    $('#submit-button').button('reset');
                },
                error: function(data) {
                    // console.log(data)
                    //alert_message(String(data.message ), 'alert alert-warning', 'fa fa-times');
                    setTimeout(function() {
                        control_button(true);
                        func_btn_new("1");
                        func_btn_save("1");
                    }, 2010);
                    alert('fail');
                }
            });
        }else{
            setTimeout(function() {
                control_button(true);
                func_btn_new("1");
                func_btn_save("1");
            }, 2010);
        }

    });

    $(document).on('click', '.show_Operation>tr', function() {

        $('#myform_invoic').trigger("reset");
        let id_row = $(this).children('td:nth(0)').children('.row_span_id').data('id');
        
        $.ajax({
            url: $(this).children('td:nth(0)').children('.row_span_id').data('url'),
            data: { 'id': id_row, },
            method: 'get',
            success: function(data) {


                table.ajax.reload();

                let form_data = JSON.parse(data.data1);
                // console.log(form_data[0].pk);
                let dataItem = data.dataitem
                let datatax = data.datatax
                
                let formset_data = JSON.parse(data.data2);

                let invoice_rows = parseInt($('#id_' + 'PurchaseInvoicelocalDetails' + '-TOTAL_FORMS').val());
                $(`input[name="id_invoice"]`).val(form_data[0].pk);
                if (data.status === 1) {
                    let supplierdata = data.datasupplier;
                    let supplier_optoin = `<option selected value="${supplierdata.id}">${supplierdata.name}</option>`;
                    
                   
                    $('#id_supplir').append(supplier_optoin);
                    if (form_data.length !== 0) {
                        $.each(form_data[0].fields, function(i, value) {
                            console.log(i)
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
                                }

                            }
                            $(`select[name="${i}"] option[value="${value}"]`).attr('selected', 'selected');
                            // $(`select[name="${i}"]`).val(value);

                        });
                        // $('#delete_this').addAttr('style');
                        $('#Previous_Operations').modal('hide');
                        $('.modal-backdrop').remove();
                    }


                    if (formset_data.length !== 0) {
                     
                        if (invoice_rows > 1) {

                            for (i = 0; i <= invoice_rows; i++) {
                                deleteForm222($('#PurchaseInvoicelocalDetails'), String($('.added1').attr('id')));

                            }

                        }
                        //console.log(data.dataitem);
                        let unitrowcounter = 0;
                        $.each(formset_data, function() {
                            
                            if (unitrowcounter != 0) {
                                addForm222($('.added1'), String($('.added1').attr('id')));
                            }

                            $.each(formset_data[unitrowcounter].fields, function(i, value) {
                                $(`input[name="PurchaseInvoicelocalDetails-${unitrowcounter}-${i}"]`).val(value);
                           
                            });
                            let item_optoin = `<option selected value="${dataItem[unitrowcounter].id}">${dataItem[unitrowcounter].name_ar}</option>`;
                            $(`#id_PurchaseInvoicelocalDetails-${unitrowcounter}-item `).append(item_optoin);
                            // $(`#id_PurchaseInvoicelocalDetails-${unitrowcounter}-item `).val(dataItem[unitrowcounter].id);

                          
                            // $(`#id_PurchaseInvoicelocalDetails-${unitrowcounter}-tax`).val(datatax[unitrowcounter].id);
                            $(`#id_PurchaseInvoicelocalDetails-${unitrowcounter}-tax`).val(datatax[unitrowcounter].id);
                            // $(`#id_PurchaseInvoicelocalDetails-${unitrowcounter}-tax`).val(datatax[unitrowcounter].id).change();
                            // $("div.id_100 select").val("val2").change();


                            // $(`input[name="PurchaseDetailsReturns-${index}-item"]`).val(data.purchase_invoice_details[index]['price']);

                            // let tax_optoin = `<option selected value="${dataItem[unitrowcounter].id}">${dataItem[unitrowcounter].name_ar}</option>`;
                            // $(`#id_PurchaseInvoicelocalDetails-${unitrowcounter}-item `).append(item_optoin);

                            // console.log("unit");
                            let unit = $(`#id_PurchaseInvoicelocalDetails-${unitrowcounter}-unit`).val();
                            // console.log(unit);
                            getItemunit(document.getElementById(`id_PurchaseInvoicelocalDetails-${unitrowcounter}-item`),"edit");
                            $(`#id_PurchaseInvoicelocalDetails-${unitrowcounter}-unit`).val(unit);
                            
                            getTotal(document.getElementById(`id_PurchaseInvoicelocalDetails-${unitrowcounter}-discount`));
                          
                             getTaxValue(document.getElementById(`id_PurchaseInvoicelocalDetails-${unitrowcounter}-tax`));
                            //  setTimeout(function() {
                            //     $(`#id_PurchaseInvoicelocalDetails-${unitrowcounter}-tax`).val(datatax[unitrowcounter].id);
                            // }, 2010);
                            //  $(`#id_PurchaseInvoicelocalDetails-${unitrowcounter}-tax `).val(datatax[unitrowcounter].id);
                                // alert("Click OK")
                            
                            unitrowcounter += 1;
                        });
                    }
                    if (isNaN(document.getElementById('id_store'))) {
                        $(`#id_store`).val(formset_data[0].fields.store)
                    }
                    $(`#id_cost_center`).val(formset_data[0].fields.cost_center)
                    $('#Previous_Operations_close').trigger('click');
                    $('#id_payment_method').trigger('change');
                } else if (data.status == 3) {
                    alert_message(String(data.message + data.msg), 'alert alert-warning', 'fa fa-times');

                    // alert(data.message + data.msg)
                }
            },
            error: function(data) {}
        });
    });

    $(document).on('click', '#btn_delete', function(e) {
        var result = confirm("هل تريد حقا حذف الفاتورة");
        if (result) {
            let id_row = $("#id_invoice1").val();

            $.ajax({
                url: $(this).data('url'),
                data: {
                    'id': id_row,
                },
                method: 'delete',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("X-CSRFToken", csrf);
                },
                success: function(data) {


                    if (data.status == 1) {

                        $(`textarea`).text('');
                        $('select').each(function() {
                            $(this).prop('selectedIndex', 0);
                            $(this).children("option").remove();
                        });
                        let invoice_rows = parseInt($('#id_' + 'PurchaseInvoicelocalDetails' + '-TOTAL_FORMS').val());
                        for (i = 0; i <= invoice_rows; i++) {
                            deleteForm222($('#PurchaseInvoicelocalDetails'), String($('.added1').attr('id')));
                        }

                        alert_message(data.message.message, data.message.class);
                        table.ajax.reload();

                        $('#myform_invoic')[0].reset();


                    } else if (data.status == 3) {

                        alert_message(String(data.message + data.msg), 'alert alert-warning', 'fa fa-times');

                        // alert(data.message + data.msg)
                    }
                    table.ajax.reload();
                    $('#delete_this').addClass('hidden');

                },
                error: function(data) {

                }
            });
        }
    });
}); //end ready Docuoment

$(document).keydown(function(e) {
    if (e.ctrlKey && e.keyCode == 32 && !$("#btn_save").prop("disabled")) {
        $('.add_form').click();
        let list_itme="";
        let index=0;
        let nameprefix="";
        let namefield="";
        $('select[id$="-item"]').each(function() {
            list_itme=$(this).attr("id");
            
        });
        var ind = list_itme.split('-');
        nameprefix=ind[0]
        index=(parseInt(ind[1]));
        namefield=ind[2]
        list_itme=nameprefix+"-"+index+"-"+namefield
        $("#"+list_itme).select2('open'); // تشغيل حدث الـ focus والـ keydown على العنصر المحدد
        $('.select2-search__field').focus();

}
});
function getItemunit(id,edit_="") {
    if (RepeatInItem(id)) {
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
                if (data.status == 1) {
                  var element = document.getElementById(`id_PurchaseInvoicelocalDetails-${ind[1]}-unit`);
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
                    // console.log(units)
                    // console.log(units[1].name)
                    option += '<option data-price="'+units[1].buy_price+'" value="' + units[0] + '">' + units[1].name + '</option>';
                    
                });
                $(`#id_PurchaseInvoicelocalDetails-${ind[1]}-unit`).html("");
                $(`#id_PurchaseInvoicelocalDetails-${ind[1]}-unit`).append(option);
                if(edit_==""){
                    $(`#id_PurchaseInvoicelocalDetails-${ind[1]}-qty`).val("1");
                    
                }
                var selectedOption = $(`#id_PurchaseInvoicelocalDetails-${ind[1]}-unit`).find('option:selected');
                var price = selectedOption.data('price');
                $(`#id_PurchaseInvoicelocalDetails-${ind[1]}-price`).val(price);
                $(document).on('change', `#id_PurchaseInvoicelocalDetails-${ind[1]}-unit`, function() {
                    var selectedOption = $(this).find('option:selected');
                    var price = selectedOption.data('price');
                    $(`#id_PurchaseInvoicelocalDetails-${ind[1]}-price`).val(price);
                });
                if (data.data2.is_date == true) {
                    $(`#id_PurchaseInvoicelocalDetails-${ind[1]}-expire_date`).attr("required", true);
                } else
                    $(`#id_PurchaseInvoicelocalDetails-${ind[1]}-expire_date`).attr("required", false);

                var element3 = document.getElementById(`id_PurchaseInvoicelocalDetails-${ind[1]}-item_specification`);
                if (element3 != null) {
                    element3.classList.remove("disabled");
                    $(`#id_PurchaseInvoicelocalDetails-${ind[1]}-item_specification`).val(data.data2.dis);
                }

                $(`#id_PurchaseInvoicelocalDetails-${ind[1]}-tax`).val(data.data2.tax_id);
                $(`#id_PurchaseInvoicelocalDetails-${ind[1]}-tax_rate`).val(data.data2.tax__tax_rate);
                }


            },
            error: function(data) {}
        });
    }
}



function getAlltotal() {
    let total_debit = 0;
    $('input[id$="-total_price"]').each(function() {
        if (!isNaN(parseFloat($(this).val()))) {
            total_debit += parseFloat($(this).val());
        }
    });
    let total_debit2=(total_debit).toFixed(2)

    $("#id_total_amount").val(total_debit2);
    let total_tax = 0;
    $('input[id$="-total_tax"]').each(function() {
        if (!isNaN(parseFloat($(this).val()))) {
            total_tax += parseFloat($(this).val());
        }
    });
    $("#id_tax").val(total_tax);
    
    
    getNettotal();

}

function getAllDiscountItem() {
    let total_debit = 0;
    $('input[id$="-discount"]').each(function() {
        if (!isNaN(parseFloat($(this).val()))) {
            total_debit += parseFloat($(this).val());
        }
    });
    let total_debit2=(total_debit).toFixed(2)

    $("#id_discount_item").val(total_debit2);
}

function getNettotal() {
    let total = 0;
    let discount = 0;
    let discountItem = 0;
    let taxTotal = 0;

    if (!isNaN(parseFloat($('#id_total_amount').val()))) {
        total = parseFloat($('#id_total_amount').val());
    }

    if (!isNaN(parseFloat($('#id_tax').val()))) {
        taxTotal = parseFloat($('#id_tax').val());
    }

    if (!isNaN(parseFloat($('#id_discount').val()))) {
        discount = parseFloat($('#id_discount').val());
    }

    if (!isNaN(parseFloat($('#id_discount_item').val()))) {
        discountItem = parseFloat($('#id_discount_item').val());
    }

    total = (total + taxTotal);
    total = total.toFixed(2);

    $("#id_total_net_bill").val(total);
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
                alert(alreay_msg);
                $(id).prop("selectedIndex", 0);

                return false;
            }
        }
    });
    return true;
}

function clearForm() {
    let form_id = '#myform_invoic';
    $(form_id)[0].reset();
    $(`textarea`).text('');
    $('#id_supplir').children('option').remove();

    $('select[id$="-item"]').each(function() {
        $(this).children("option").remove();
    });
    // $(`#id_supplir`).prop('selectedIndex', 0);;
    $('select').each(function() {
        $(this).prop('selectedIndex', 0);
        $("#cash").addClass("hidden");
        $("#check").addClass("hidden");
        $("#cash_check").addClass("hidden");
        $("#check_amount").addClass("hidden");
        //$(this).children("option").remove();
    });
}


 
function getTotal(element_id) {
    let index = element_id.name.split('-');
    let qty = 0;
    let price = 0;
    let discount = 0;
    let tax_rate = 0;
    let rate = 0;
    let totalPrice = 0;

    if (!isNaN(parseInt(document.getElementById(`id_PurchaseInvoicelocalDetails-${index[1]}-discount_rate`).value))) {
        rate = parseInt(document.getElementById(`id_PurchaseInvoicelocalDetails-${index[1]}-discount_rate`).value);
    }

    if (!isNaN(parseInt(document.getElementById(`id_PurchaseInvoicelocalDetails-${index[1]}-tax_rate`).value))) {
        tax_rate = parseInt(document.getElementById(`id_PurchaseInvoicelocalDetails-${index[1]}-tax_rate`).value);
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
        discount = qty * price * (rate / 100);
        $(`#id_PurchaseInvoicelocalDetails-${index[1]}-discount`).val(discount);
    }

    if (i == `id_PurchaseInvoicelocalDetails-${index[1]}-discount`) {
        rate = (discount / (qty * price)) * 100;
        rate=rate.toFixed(2);
        $(`#id_PurchaseInvoicelocalDetails-${index[1]}-discount_rate`).val(rate);
    }

    totalPrice = ((qty * price) - discount);
    let tax = (totalPrice * (tax_rate / 100));
  
    
    let totalPriceWithTax = (totalPrice).toFixed(2);
    $(`#id_PurchaseInvoicelocalDetails-${index[1]}-total_tax`).val(parseFloat(tax).toFixed(2))
    $(`#id_PurchaseInvoicelocalDetails-${index[1]}-total_price`).val(totalPriceWithTax);
    getAlltotal();
    getAllDiscountItem();
}
function getTaxValue(id) {
   
    //   alert('s')
        var ind = id.name.split('-');
     
        $.ajax({
            url: url_get_tax_value,
            data: {
                'id': id.value,
            },
            method: 'get',
            success: function(data) {

                // alert(data.data.tax_id)
                // alert(data.data.tax_rate)
                // alert(data.data.is_disabled)
                // setTimeout(function() {
                    $(`#id_PurchaseInvoicelocalDetails-${ind[1]}-tax_rate`).val(data.data.tax_rate);
                    // $(`#id_PurchaseInvoicelocalDetails-${ind[1]}-tax`).val(data.data.tax_id);
                // }, 2010);
                

                getTotal(id)

            },
            error: function(data) {}
        });
}
