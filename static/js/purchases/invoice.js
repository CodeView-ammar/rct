
function getItemunit(id) {
    if (RepeatInItem(id)) {
        url1 = "{% url 'get_units_item' %}";
        var ind = id.name.split('-');
        $(`#id_PurchaseInvoicelocalDetails-${ind[1]}-unit`).html("");
        $(`#id_PurchaseInvoicelocalDetails-${ind[1]}-item_specification`).html("");
        $(`#id_PurchaseInvoicelocalDetails-${ind[1]}-item_specification`).attr("required", false);

        $.ajax({
            url: url1,
            data: {
                'id': id.value,
            },
            method: 'get',
            success: function (data) {
                var element = document.getElementById(`id_PurchaseInvoicelocalDetails-${ind[1]}-unit`);
                element.classList.remove("disabled");
                var option;
                console.log(data);
                $.each(data.data, function (index, main_supplier) {
                    option += '<option value="' + index + ' ">' + main_supplier + '</option>';
                });
                $(`#id_PurchaseInvoicelocalDetails-${ind[1]}-unit`).html("");
                $(`#id_PurchaseInvoicelocalDetails-${ind[1]}-unit`).append(option);

                // $(`#id_PurchaseInvoicelocalDetails-${ind[1]}-store`).val($('#id_store').children("option:selected").val());
                if (data.data2.is_date == true) {
                    $(`#id_PurchaseInvoicelocalDetails-${ind[1]}-expire_date`).attr("required", true);
                }
                var element3 = document.getElementById(`id_PurchaseInvoicelocalDetails-${ind[1]}-item_specification`);
                if (element3 != null) {
                    element3.classList.remove("disabled");
                    $(`#id_PurchaseInvoicelocalDetails-${ind[1]}-item_specification`).val(data.data2.dis);
                }



            },
            error: function (data) {
            }
        });
    }
}

$(document).ready(function () {
    alert("fffff");
    $(document).on('submit', '#myform_invoic', function (e) {
        // check_account_fund();
        // var f = compare_total_amount();
    
        {
            //prevent submit form and submit by ajax
            e.preventDefault();
            alert($(this).serialize());
            $.ajax({
                url: $(this).attr('action'),
                data: $(this).serialize(),
                method: 'POST',
                success: function (data) {
                    alert('Susecc')
                    console.log(data);
                    if (data.status == 1) {
                        $(`textarea`).text('');
                        alert_message(data.message.message, data.message.class);
                        $('#load_div').children().remove();
                        table.ajax.reload();
                        $(form_id)[0].reset();
                    } else if (data.status == 2) {
    
                        $.each(data.error, function () {
                            let form = $(this)[0].form_id;
                            $(`#id_${form}-accounts`).parents('.item').css('outline', 'red auto');
                            alert_message($(this)[0].message, 'alert alert-danger');
                        });
                    } else if (data.status == 0) {
    
                        if (data.message.message != '') {
    
                            alert_message(data.message.message, data.message.class);
                        }
                        let row_id = data.error.form_id;
                        let row_id2 = data.error['form_id'];
    
                        let error = JSON.parse(data.error.error);
                        console.log(error)
                        // console.log(row_id)
                        // console.log(row_id2)
                        $.each(error, function (i, value) {
                            let div = '<span class="text-danger">';
                            $.each(value, function (j, message) {
                                console.log(message.message)
                                div += `- ${message.message}<br>`;
                            });
                            console.log(i)
                            console.log(value)
                            // $.each(value, function(j, message) {
                            //     console.log(message.message)
                            //     div += `- ${message.message}<br>`;
                            // });
                            $(`#id_${row_id}-0-${i}`).parent().append(div);
                            // div.insertBefore($(`#id_${row_id}-0-${i}`));
                        });
                    }
                    // $('#submit-button').button('reset');
                },
                error: function (data) {
                    alert('fail');
                }
            });
    
        }
    
    
    
    });
    
    $(document).on('click', '.edit_row', function () {
    
        $('#myform_invoic').trigger("reset");
        let id_row = $(this).data('id');
        $.ajax({
            url: $(this).data('url'),
            data: { 'id': id_row, },
            method: 'get',
            success: function (data) {
    
                console.log(data);
                let form_data = JSON.parse(data.data1);
                let formset_data = JSON.parse(data.data2);
                let invoice_rows = parseInt($('#id_' + 'PurchaseInvoicelocalDetails' + '-TOTAL_FORMS').val());
    
                if (data.status === 1) {
                    if (form_data.length !== 0) {
                        $.each(form_data[0].fields, function (i, value) {
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
                            // $('#modalLRForm').modal('show');
                        });
                    }
    
    
    
                    if (formset_data.length !== 0) {
                        if (invoice_rows > 1) {
    
                            for (i = 0; i < invoice_rows; i++) {
                                deleteForm($('#PurchaseInvoicelocalDetails-0'), String($('.added').attr('id')));
                            }
                        }
                        let unitrowcounter = 0;
                        $.each(formset_data, function () {
                            addForm222($('.added'), String($('.added').attr('id')));
    
                            $.each(formset_data[unitrowcounter].fields, function (i, value) {
                                // alert(value);
    
                                $(`input[name="PurchaseInvoicelocalDetails-${unitrowcounter}-${i}"]`).val(value);
    
                                // if($('#id_PurchaseInvoicelocalDetails-'+unitrowcounter+'-'+i).is(":checkbox")) {
                                //     if(value === true){
                                //         $(`input[name="PurchaseInvoicelocalDetails-${unitrowcounter}-${i}"][type="checkbox"]`).val(value);
                                //         $(`input[name="PurchaseInvoicelocalDetails-${unitrowcounter}-${i}"][type="checkbox"]`).attr('checked','checked');
                                //         $(`input[name="PurchaseInvoicelocalDetails-${unitrowcounter}-package"][type="number"]`).attr('readonly', 'readonly');
                                //         $(`input[name="PurchaseInvoicelocalDetails-${unitrowcounter+1}-is_primary"][type="checkbox"]`).attr('disabled','disabled');
    
                                //     if (value === false){
                                //         $(`input[name="PurchaseInvoicelocalDetails-${unitrowcounter}-${i}"][type="checkbox"]`).attr('disabled','disabled');
                                //     }
                                //     }
                                // }
                                $(`select[name="PurchaseInvoicelocalDetails-${unitrowcounter}-${i}"] option[value="${value}"]`).attr('selected', 'selected');
    
    
                            });
                            console.log("unit");
                            let unit = $(`#id_PurchaseInvoicelocalDetails-${unitrowcounter}-unit`).val();
                            console.log(unit);
                            getItemunit(document.getElementById(`id_PurchaseInvoicelocalDetails-${unitrowcounter}-item`));
                            $(`#id_PurchaseInvoicelocalDetails-${unitrowcounter}-unit`).val(unit);
    
    
                            console.log("222unit");
                            //$(`#PurchaseInvoicelocalDetails-${unitrowcounter}-unit`)
                            //let qty=$(`#PurchaseInvoicelocalDetails-${unitrowcounter}-qty`).val();
                            //let price=$(`#PurchaseInvoicelocalDetails-${unitrowcounter}-price`).val();
                            getTotal(document.getElementById(`id_PurchaseInvoicelocalDetails-${unitrowcounter}-discount`));
                            //$(`#PurchaseInvoicelocalDetails-${unitrowcounter}-discount`).trigger('input');
                            //alert((qty * price) - discount)
                            // $(`#PurchaseInvoicelocalDetails-${unitrowcounter}-total_price`).val((qty * price) - discount);
                            unitrowcounter += 1;
                        });
                    }
    
    
    
                    console.log("end");
                    // $('#id_payment_method').trigger('change');
                    // console.log("end1"); 
    
                    if (isNaN(document.getElementById('id_store'))) {
                        $(`#id_store`).val(formset_data[0].fields.store)
                        console.log(formset_data[0].fields.store)
    
                    }
                    $('#Previous_Operations_close').trigger('click');
    
                }
            },
            error: function (data) {
            }
        });
    });
    //start handel event for payment_methode
    $('#id_payment_method').on('change', function () {

        let choes = $(this).val();
        if (choes === '1') {
            $('#cash').removeClass('hidden');
            $("id_fund").attr('required', true);
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
            $('#cash').addClass('hidden');
            $('#check').addClass('hidden');
        }
        $.ajax({
            url: "{% url 'get_code'%}",
            data: { 'payment_method': $(this).val(), },
            method: 'get',
            success: function (data) {
                if (data.status == 1) {
                    console.log(data.data);
                    $('#id_code').val(data.data);
                    $('#id_code').attr('readonly', true);
                }
            },
            error: function (data) {
            }
        });

    });
    //end handel event for payment_methode
    $(document).on('change', '#id_store', function () {
        alert($(this).children("option:selected").val());
    });
    //handedl currency and form.exchange_rate
    $(document).on('change', '#id_currency', function () {
        let currency_id = $(this).val();
        $.ajax({
            url: "{% url 'get_exchange_raty'%}",
            data: { 'id': currency_id, },
            method: 'get',
            success: function (data) {
                if (data.status == 1) {
                    let resp = JSON.parse(data.data);
                    $(`input[name="id"]`).val(resp[0].pk);
                    $.each(resp[0].fields, function (i, value) {
                        $(`input[name="${i}"]`).val(value);
                        $(`input[name=${i}]`).prop('checked', value);
                        $(`textarea[name=${i}]`).text(value);
                        $(`select[name="${i}"] option`).each(function () {
                            if ($(this).val() == value) {
                                $(this).prop("selected", true);
                            }
                        });
                    });
                }
            },
            error: function (data) {
            }
        });
    });//end handel event handedl currency and form.exchange_rate

    //start empty the feild unit
    // let num = $('#id_PurchaseInvoicelocalDetails-TOTAL_FORMS').val();
    //        for (let index = 0; index < num; index++) {
    //           $('#id_PurchaseInvoicelocalDetails-' + index + '-unit').html('');

    //      }
    //end empty the feild unit
    //start handel event for item's unit
    //end handel event for item's unit

    $(document).on('click', '#PurchaseInvoicelocalDetails', function () {
        getAlltotal();
    });

});//end ready Docuoment

function getTotal(element_id) {
    alert(element_id.name)
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
    $('input[id$="-total_price"]').each(function () {
        if (!isNaN(parseFloat($(this).val()))) {
            total_debit += parseFloat($(this).val());
        }
    });

    $("#id_total_amount").val(total_debit);
    getNettotal();

}
function getAllDiscountItem() {
    let total_debit = 0;
    $('input[id$="-discount"]').each(function () {
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
    alert(index);
    let qty = 0;
    let total = 0;

    if (!isNaN(parseInt(document.getElementById(`id_PurchaseInvoicelocalDetails-${index[1]}-qty`).value))) {
        qty = parseInt(document.getElementById(`id_PurchaseInvoicelocalDetails-${index[1]}-qty`).value);
        alert(qty);
    }
    if (!isNaN(parseFloat(document.getElementById(`id_PurchaseInvoicelocalDetails-${index[1]}-total_price`).value))) {
        total = parseFloat(document.getElementById(`id_PurchaseInvoicelocalDetails-${index[1]}-total_price`).value);
    }
    $(`#id_PurchaseInvoicelocalDetails-${index[1]}-price`).val(total / qty);
    $(`#id_PurchaseInvoicelocalDetails-${index[1]}-discount`).val(0);
    getAlltotal();
    getAllDiscountItem();
}
function RepeatInItem(id) {
    let data = id.name;
    $('select[id$="-item"]').each(function () {
        if (this.name != data) {
            if (this.value == id.value) {
                alert("The item already exists");
                $(id).val(0)
                return false;
            }
        }
    });
    return true;
}





