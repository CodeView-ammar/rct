
// alert("a");
// $(document).ready(function() {
//     $('#id_purchase_invoicelocal').change(function() {
//        alert('تم اختيار العنصر: ');
//     });
//   });
function getTotalPriceReturned(element) {
    let element_index = element.name.split('-')[1];
    let totalQty = parseFloat(document.getElementById(`id_PurchaseDetailsReturns-${element_index}-qty`).value);
    if (!isNaN(parseInt(element.value)) && parseInt(element.value) > totalQty) {
        alert_message('Returned quantity can not be more than total quantity !', 'alert alert-danger', 'fa fa-times', 'normal');
        $(`#id_PurchaseDetailsReturns-${element_index}-returns_qty`).val(parseFloat(0));
    } else if (!isNaN(parseInt(element.value))) {
        let purchasePrice = parseFloat(document.getElementById(`id_PurchaseDetailsReturns-${element_index}-price`).value);
        let returnedQty = parseFloat(document.getElementById(`id_PurchaseDetailsReturns-${element_index}-returns_qty`).value);
        $(`#id_PurchaseDetailsReturns-${element_index}-returned_price`).val(parseFloat(returnedQty * purchasePrice));
        getAmount();
    }
}

function clearForm(form) {
    form_id = '#form-id-return-purchases';
    $("#load_div_retutn").load(load_url);
    $(form_id)[0].reset();
    $(`textarea`).text('');
    // $('select[id$="-item"]').each(function() {
    //     $(this).children("option").remove();
    // });

    // $(`#id_purchase_invoicelocal`).children("option").remove();
    $(`#id_supplir`).children("option").remove();
    $('select').each(function() {


        $(this).prop('selectedIndex', -1);
        //$(this).children("option").remove();
    });
    $(form_id)[0].reset();
    $(`textarea`).text('');
    // $('select[id$="-item"]').each(function() {
    //     $(this).children("option").remove();
    // });
    // $('select').each(function() {


    //     $(this).prop('selectedIndex', 0);
    //     //$(this).children("option").remove();
    // });
    ////////////


    $(':input', form).each(function() {
        let type = this.type;
        let tag = this.tagName.toLowerCase(); // normalize case
        if (type === 'text' || type === 'password' || tag === 'textarea')
            this.value = "";
        else if (type === 'checkbox' || type === 'radio')
            this.checked = false;


    });

}

function init_info_purchod (var_option,id,code){
    purchases_option = `<option value="${id}">${var_option}-${code}</option>`;
    $('#id_purchase_invoicelocal').append(purchases_option);
} 

function clearForm_onChange(form) {
    $(':input', form).each(function() {

        let type = this.type;
        let tag = this.tagName.toLowerCase(); // normalize case
        if (type === 'text' || type === 'password' || tag === 'textarea')
            this.value = "";
        else if (type === 'checkbox' || type === 'radio')
            this.checked = false;
        else if (tag === 'select') {

            if (!(this.id === 'id_purchase_invoice_type_returns' ||
                    this.id === 'id_typey' ||
                    this.id === 'id_previous_year' ||
                    this.id === 'id_item_costs'))
                this.selectedIndex = -1;
        } else if (type === 'date') {
            this.value = "";

        } else if (type === 'number') {
            this.value = 0;

        }


    });
}
var purchurl = url_PurchasesReturnsView;

function getExchangeRate(currency_id) {
    $.ajax({
        url: purchurl,
        data: {
            'id_currency': currency_id.value,
        },
        method: 'get',
        success: function(data) {
            if (data.status === 0) {
                $(`input[name="exchange_rate"][type="number"]`).val(parseFloat(data.exchange_rate));
            }
            if (data.status === 2) {
                alert_message(String(data.message.message), 'alert alert-warning', 'fa fa-times');
            }
        },
        error: function(data) {}
    });
}

function getNewCode(typeId) {
    // url = '/PurchasesReturnsView/';
    $.ajax({
        url: purchurl,
        data: {
            'purchase_type': typeId.value,
        },
        method: 'get',
        success: function(data) {
            if (data.status === 0) {
                let newCode = parseInt(data.new_code['code__max']) + 1
                $(`input[name="code"]`).val(newCode);
            }
            if (data.status === 2) {
                alert_message(String(data.message.message), 'alert alert-warning', 'fa fa-times');
            }
        },
        error: function(data) {}
    });
}


function changePaymentMethod(paymentMethod) {
    let paymentMethodSelected = parseInt(paymentMethod);
    if (paymentMethodSelected === 1) {
        $("#fund_filed").removeClass('hidden');
        $("#bank_filed").removeClass('hidden');
        $("#check_amount_filed").removeClass('hidden');
        $("#bank_filed").addClass('hidden');
        $("#check_amount_filed").addClass('hidden');
    }
    if (paymentMethodSelected === 2) {
        $("#fund_filed").removeClass('hidden');
        $("#bank_filed").removeClass('hidden');
        $("#check_amount_filed").removeClass('hidden');
        $("#fund_filed").addClass('hidden');
        $("#check_amount_filed").addClass('hidden');
    }
    if (paymentMethodSelected === 3) {
        $("#fund_filed").removeClass('hidden');
        $("#bank_filed").removeClass('hidden');
        $("#check_amount_filed").removeClass('hidden');
        $("#bank_filed").addClass('hidden');
        $("#fund_filed").addClass('hidden');
        $("#check_amount_filed").addClass('hidden');
    }
    if (paymentMethodSelected === 4) {
        $("#fund_filed").removeClass('hidden');
        $("#bank_filed").removeClass('hidden');
        $("#check_amount_filed").removeClass('hidden');
    }
}


function is_valied() {

    let div = '<span class="text-danger">';

    amount = 0;
    total1 = 0;
    check_amount = 0;
    if (!isNaN(parseFloat($('#id_net_amount').val()))) {
        total1 = parseFloat($('#id_net_amount').val());
    }
    // if (!isNaN(parseFloat($('#id_net_amount').val()))) {
    //     total1 = parseFloat($('#id_net_amount').val());
    // }
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

function open_change_class_buttons() {
    $('#submit-button').removeClass('hidden');
    $('.add_form').removeClass('hidden');
    $('.delete_form').removeClass('hidden');
    $('#id_bond_number').removeAttr('daily_entries');
    $('#show_daily_constraints_btn').toggleClass('hidden');
    $('#add_new').toggleClass('hidden');
    $('#delete_this').toggleClass('hidden');

}

function getTaxValue(id) {
    var ind = id.name.split('-');
     
        $.ajax({
            url: url_get_tax_value,
            data: {
                'id': id.value,
            },
            method: 'get',
            success: function(data) {

                    $(`#id_PurchaseDetailsReturns-${ind[1]}-tax_rate`).val(data.data.tax_rate);
                

                getTotal(id)

            },
            error: function(data) {}
        });
}

function close_change_class_buttons() {
    $('#show_daily_constraints_btn').removeClass('hidden');
    $('#add_new').removeClass('hidden');
    $('#delete_this').removeClass('hidden');

}

function getPurchaseInvoice(element) {
    let id = $("#id_purchase_invoicelocal").val();
 
    $("#load_div_retutn").load(load_url + `?invoice_id=${id}`, function() {
        // Content has been loaded, add your event here
        totalitem();
    });
    // let invoiceId = element.value;
    $.ajax({
        url: purchurl,
        data: {
            'invoice_id': element.value,
            'previous_year': $("#id_previous_year").val()
        },
        method: 'get',
        success: function(data) {
            
            if (data.status === 0) {

                let purchase_invoice = JSON.parse(data.purchase_invoice);
                // let purchase_returns = JSON.parse(data.purchase_returns);
                
                let purchase_invoice_details = data.purchase_invoice_details;
                let supplierdata = data.supplierdata;
                let supplier_optoin = `<option selected value="${supplierdata.id}">${supplierdata.name}</option>`;
                $('#id_supplir').append(supplier_optoin);
                $('#id_supplir').val(supplierdata.id);
                $(`select[name="supplir"]`).val(supplierdata.id);
                $(`select[name="store"]`).val(purchase_invoice_details[0].store);
                if(purchase_invoice_details[0].cost_center)
                {

                    $(`select[name="cost_center"]`).val(purchase_invoice_details[0].cost_center);
                }
                
             
                

                $.ajax({
                    url: urlmax,
                    data: { 'data': '' },
                    method: 'get',
                    success: function(data) {
        
                        if (data.status == 1) {
                            
                            $('#id_code').val(data.data);
                            $('#id_code').attr('readonly', true);
                        }
                    },
                    error: function(data) {}
                });
        

                // let purchase_invoice_details = (data['purchase_invoice_details']);


                // let rows = parseInt($('#id_' + 'PurchaseDetailsReturns' + '-TOTAL_FORMS').val());
                if (purchase_invoice.length !== 0) {
                    $.each(purchase_invoice[0].fields, function(i, value) {
                        if (!$('#id_' + i).is(":checkbox") && i !== 'code' && i !== 'date' && i !== 'check_amount' && i !== 'total_amount' && i !== 'discount_rate') {
                            $(`input[name="${i}"]`).val(value);
                        }
                        if ($('#id_' + i).is(":checkbox")) {
                            if (value === true) {
                                $(`input[name="${i}"][type="checkbox"]`).val(value).attr('checked', 'checked');
                            }
                        }
                        if (i !== 'item_costs' && i !== 'bank' && i !== 'fund') {
                            $(`select[name="${i}"]`).val(value);
                        }
                        if (i == 'fund' || i=="bank") {
                           
                            $(`select[name="${i}"]`).val(value);
                        }
                        if (i=="total_amount") {
                           
                            // $(`input[name="amount"]`).val(purchase_invoice_details[0].total_amount);
                            $(`input[name="amount"]`).val(value);
                            $(`input[name="total_amount"]`).val(value);
                            
                        }
                        // if (i=="supplier_bill_date") {
                        //     alert(value)
                           
                        //     // $(`input[name="amount"]`).val(purchase_invoice_details[0].total_amount);
                        //     $(`input[name="supplier_bill_date"]`).val(value);
                        // }

                    });
                    let paymentMethod = document.getElementById("id_payment_method").selectedIndex;
                    changePaymentMethod(paymentMethod);

                }
                // getNettotal()
            } else if (data.status === 1) {
                alert_message(String(data.message.message), 'alert alert-warning', 'fa fa-times');
            }
        },
        error: function(data) {}
    });
}

function getAmount(element = '') {
    let purchases_rows = parseInt($('#id_' + 'PurchaseDetailsReturns' + '-TOTAL_FORMS').val() - 1);
    let discount_rate = 0;
    let discount = 0;
    let totalAmount = 0;
    for (let i = 0; i <= purchases_rows; i++) {
        if (!isNaN(parseFloat(document.getElementById(`id_PurchaseDetailsReturns-${i}-price`).value))) {
            totalAmount += parseFloat(document.getElementById(`id_PurchaseDetailsReturns-${i}-price`).value);
        }
    }
    $(`#id_total_amount`).val(parseFloat(totalAmount));
    if (element.id === 'id_discount_rate') {
        discount_rate = document.getElementById(`id_discount_rate`).value;
        if (parseInt(discount_rate) > 100) {
            alert_message('Discount rate can not be more than 100 !', 'alert alert-danger', 'fa fa-times', 'normal');
            $(`#id_discount_rate`).val(parseFloat(0));
        }
        if (parseInt(discount_rate) < 0) {
            alert_message('Discount rate can not be less than 0 !', 'alert alert-danger', 'fa fa-times', 'normal');
            $(`#id_discount_rate`).val(parseFloat(0));
        } else {
            $(`#id_discount`).val(parseInt((discount_rate / 100) * totalAmount));
        }

    }
    if (element.id === 'id_discount') {
        discount = document.getElementById(`id_discount`).value;
        if (parseInt(discount) > parseInt(document.getElementById(`id_net_amount`).value)) {
            alert_message('Discount can not be more than ' + document.getElementById(`id_net_amount`).value, 'alert alert-danger', 'fa fa-times', 'normal');
            $(`#id_discount`).val(parseFloat(0));
        }
        if (discount < 0) {
            alert_message('Discount can not be less than 0', 'alert alert-danger', 'fa fa-times', 'normal');
            $(`#id_discount`).val(parseFloat(0));
        }
        $(`#id_discount_rate`).val(parseFloat(discount / totalAmount * 100));
        totalAmount = totalAmount - discount;
    }
    $(`#id_net_amount`).val(parseInt(totalAmount));


}



function getItemunit(id) {
    if (RepeatInItem(id)) {
        
        var ind = id.name.split('-');
        $(`#id_PurchaseDetailsReturns-${ind[1]}-unit`).html("");
        $(`#id_PurchaseDetailsReturns-${ind[1]}-item_specification`).html("");
        $(`#id_PurchaseDetailsReturns-${ind[1]}-item_specification`).attr("required", false);

        $.ajax({
            url: url_get_units_item,
            data: {
                'id': id.value,
            },
            method: 'get',
            success: function(data) {
                var element = document.getElementById(`id_PurchaseDetailsReturns-${ind[1]}-unit`);
                element.classList.remove("disabled");
                
                var option;
                $.each(data.data, function(index, units) {
                    option += '<option value="' + index + ' ">' + units + '</option>';
                });
                $(`#id_PurchaseDetailsReturns-${ind[1]}-unit`).html("");
                $(`#id_PurchaseDetailsReturns-${ind[1]}-unit`).append(option);
                // $(`#id_PurchaseDetailsReturns-${ind[1]}-store`).val($('#id_store').children("option:selected").val());
                if (data.data2.is_date == true) {
                    //("asdfghjkl;'\'");
                    $(`#id_PurchaseDetailsReturns-${ind[1]}-expire_date`).attr("required", true);
                } else
                $(`#id_PurchaseDetailsReturns-${ind[1]}-expire_date`).attr("required", false);
                
                var element3 = document.getElementById(`id_PurchaseDetailsReturns-${ind[1]}-item_specification`);
                if (element3 != null) {
                    element3.classList.remove("disabled");
                    $(`#id_PurchaseDetailsReturns-${ind[1]}-item_specification`).val(data.data2.dis);
                }
                
                

            },
            error: function(data) {}
        });
    }
}
function totalitem(){
// $('input[id$="-tax"]').each(function() {
    
//     getTaxValue(this)
// });
$('input[id$="-tax_rate"]').each(function() {
    getTotal(this);
    
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
    if (!isNaN(parseInt($(`#id_PurchaseDetailsReturns-${index[1]}-discount_rate`).val()))) {
        rate = parseInt($(`#id_PurchaseDetailsReturns-${index[1]}-discount_rate`).val());
    }else{
        $(`#id_PurchaseDetailsReturns-${index[1]}-discount_rate`).val(0);
    }

    if (!isNaN(parseInt($(`#id_PurchaseDetailsReturns-${index[1]}-tax_rate`).val()))) {
        tax_rate = parseInt($(`#id_PurchaseDetailsReturns-${index[1]}-tax_rate`).val());
    }

    if (!isNaN(parseInt($(`#id_PurchaseDetailsReturns-${index[1]}-qty`).val()))) {
        qty = parseInt($(`#id_PurchaseDetailsReturns-${index[1]}-qty`).val());
    }

    if (!isNaN(parseFloat($(`#id_PurchaseDetailsReturns-${index[1]}-price`).val()))) {
        price = parseFloat($(`#id_PurchaseDetailsReturns-${index[1]}-price`).val());
    }

    if (!isNaN(parseFloat($(`#id_PurchaseDetailsReturns-${index[1]}-discount`).val()))) {
        discount = parseFloat($(`#id_PurchaseDetailsReturns-${index[1]}-discount`).val());
    }

    let i = element_id.id;

    if (i == `id_PurchaseDetailsReturns-${index[1]}-discount_rate`) {
        discount = qty * price * (rate / 100);
        $(`#id_PurchaseDetailsReturns-${index[1]}-discount`).val(discount);
    }

    if (i == `id_PurchaseDetailsReturns-${index[1]}-discount`) {
        rate = (discount / (qty * price)) * 100;
        rate=rate.toFixed(2);
        $(`#id_PurchaseDetailsReturns-${index[1]}-discount_rate`).val(rate);
    }

    totalPrice = ((qty * price) - discount);
    let tax = (totalPrice * (tax_rate / 100));
  
    
    let totalPriceWithTax = (totalPrice).toFixed(2); 
    $(`#id_PurchaseDetailsReturns-${index[1]}-total_tax`).val(parseFloat(tax).toFixed(2))
    $(`#id_PurchaseDetailsReturns-${index[1]}-total_price`).val(totalPriceWithTax);
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
    $("#id_discount_item").val(total_debit);
}

function getNettotal() {
    let total = 0;
    let descount = 0;
    let tax_total=0;
    if (!isNaN(parseFloat($('#id_total_amount').val()))) {
        total = parseFloat($('#id_total_amount').val());
    }
    if (!isNaN(parseFloat($('#id_discount').val()))) {
        descount = parseFloat($('#id_discount').val());
    }
    if (!isNaN(parseFloat($('#id_tax').val()))) {
        tax_total = parseFloat($('#id_tax').val());
    }
    $('#id_amount').val(total + descount+tax_total);

    $("#id_net_amount").val(total + descount+tax_total);

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
    //alert(index);
    let qty = 0;
    let total = 0;
    if (!isNaN(parseInt(document.getElementById(`id_PurchaseDetailsReturns-${index[1]}-qty`).value))) {
        qty = parseInt(document.getElementById(`id_PurchaseDetailsReturns-${index[1]}-qty`).value);
        //alert(qty);
    }
    if (!isNaN(parseFloat(document.getElementById(`id_PurchaseDetailsReturns-${index[1]}-total_price`).value))) {
        total = parseFloat(document.getElementById(`id_PurchaseDetailsReturns-${index[1]}-total_price`).value);
    }
    $(`#id_PurchaseDetailsReturns-${index[1]}-price`).val(total / qty);
    $(`#id_PurchaseDetailsReturns-${index[1]}-discount`).val(0);
    getAlltotal();
    getAllDiscountItem();
}

function RepeatInItem(id) {
    let data = id.name;
    $('select[id$="-item"]').each(function() {
        if (this.name != data) {
            if (this.value == id.value) {
                // alert(alreay_msg);
                $(id).children("option").remove();
                return false;
            }
        }
    });
    return true;
}


$(document).ready(function() {
    // alert('Afeef')
    // $('[data-toggle="tooltip"]').tooltip();
    let formId = '#form-id-return-purchases';
    // alert('Afeef2')

    $("#id_previous_year").on('change', function() {
        clearForm_onChange(formId);
    });
    // alert('Afeef3')
    $("#id_typey").on('change', function() {
        clearForm_onChange(formId);
        let typey = $(this).val();
        if (typey === '2') {
            $("#id_previous_year").removeClass('hidden');
        } else {
            $("#id_previous_year").addClass('hidden');
        }
    });










    $(document).on('submit', "#form-id-return-purchases", function(e) {

    //    alert($(this).attr('action'))

        $('span[class="text-danger"]').remove();
        let purchases_rows = parseInt($('#id_' + 'PurchaseDetailsReturns' + '-TOTAL_FORMS').val());
        let check=false;
        for(let i=0;i<purchases_rows;i++){
            if($(`#id_PurchaseDetailsReturns-${i}-qty`).val()>0){
                check=true;
                if($(`#id_PurchaseDetailsReturns-${i}-qty_main_item`).val()===$(`#id_PurchaseDetailsReturns-${i}-qty_return_item`).val()){
                let div = '<span class="text-danger">-</br>لقد تم إرجاع الصنف التالي بالفعل';
                $(`#id_PurchaseDetailsReturns-${i}-qty`).parent().append(div);
                setTimeout(function() {
                    control_button(true);
                    func_btn_new("1");
                    func_btn_save("1");
                }, 2010);
                return false;        
            }
        }

        }
        if(!check){
            alert("يجب إضافة كمية المرتجع حتى لصنف واحد")
            setTimeout(function() {
                control_button(true);
                func_btn_new("1");
                func_btn_save("1");
            }, 2010);
            return false;        
        
        }
        // for(i=0;i>=;i++){
        // }

        let i = is_valied();
        e.preventDefault();
        
         if (i) {
            //$('#purchases-returns-submit-button').button('loading');
            let data_=$(this).serialize() + '&previous_year=' + $("#id_previous_year").val()
            if($("#id_amount").val()==undefined)
                data_+='&amount='+$("#id_net_amount").val()
            $.ajax({
                url: $(this).attr('action'),
                data:data_ ,
                method: 'post',
                success: function(data) {
                    table.ajax.reload();
                    $('span[class="text-danger"]').remove();
                    if (data.status == 0) {

                        alert_message(data.message.message, data.message.class);
                        // for (let i = 0; i < purchases_rows; i++) {
                            //     deleteFormreturn($('#id_PurchaseDetailsReturns-0'), String($('.add-form-row').attr('id')));
                            // }
                        print_custom("Purchase Returns Report", "purchaseinvoicelocalreturns", data.id);
                            
                            clearForm();

                        // $(`.clear-this`).val('');
                        setTimeout(function() {
                            control_button(true);
                            func_btn_new("1");
                            func_btn_save("1");
                        }, 2010);
                    }
                    if (data.status === 3) {
                        alert_message(data.message.message, data.message.class);
                        $('#purchases-returns-submit-button').button('reset');
                        setTimeout(function() {
                            control_button(true);
                            func_btn_new("1");
                            func_btn_save("1");
                        }, 2010);
                    } else if (data.status === 2) {
                        alert_message(data.message.message, data.message.class);
                        setTimeout(function() {
                            control_button(true);
                            func_btn_new("1");
                            func_btn_save("1");
                        }, 2010);
                    } else if (data.status === 5) {
                        alert_message(data.message.message, data.message.class);
                        setTimeout(function() {
                            control_button(true);
                            func_btn_new("1");
                            func_btn_save("1");
                        }, 2010);

                    } else if (data.status === 1) {

                        let error = JSON.parse(data.error);
                        let errorform = data.errorformset;
                        $.each(error, function(i, value) {
                            alert_message(String(data.message), 'alert alert-warning', 'fa fa-times');
                            let div = '<span class="text-danger">';
                            $.each(value, function(j, message) {
                                div += `- ${message.message}<br>`;
                            });
                            $(`#div_id_${i}`).append(div);

                        });
                        $.each(errorform, function(i, value) {

                            $.each(value, function(j, message) {
                                alert_message(String(message), 'alert alert-warning', 'fa fa-times');
                            });
                        });

                        setTimeout(function() {
                            control_button(true);
                            func_btn_new("1");
                            func_btn_save("1");
                        }, 2010);
                    }
                },
                error: function(data) {}
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


        $(formId).trigger("reset");
        let id_row = $(this).children('td:nth(0)').children('.row_span_id').data('id');
        // alert($(this).children('td:nth(0)').children('.row_span_id').data('url'))
        $.ajax({
            url: $(this).children('td:nth(0)').children('.row_span_id').data('url'),
            data: { 'id': id_row, },
            method: 'get',
            success: function(data) {
                table.ajax.reload();




                let form_data = JSON.parse(data.data1);
                let dataItem = data.dataitem
                let formset_data = JSON.parse(data.data2);
                let invoice_rows = parseInt($('#id_' + 'PurchaseDetailsReturns' + '-TOTAL_FORMS').val());
                $(`input[name="id_invoice_r"]`).val(form_data[0].pk);
                if (data.status === 1) {

                    let supplierdata = data.datasupplier;
                    let supplier_optoin = `<option selected value="${supplierdata.id}">${supplierdata.name}</option>`;
                    $('#id_supplir').append(supplier_optoin);
                    let purchase_returns = data.purchase_returns;
                    let purchases_optoin = `<option selected value="${purchase_returns.id}">${purchase_returns.code + "-" + purchase_returns.statement}</option>`;
                    $('#id_purchase_invoicelocal').append(purchases_optoin);
                    if (form_data.length !== 0) {
                        $.each(form_data[0].fields, function(i, value) {
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
                            if (i == 'daily_entries') {

                                $("#id_code").attr('daily_entries', `${value}`);
                            }

                            $('#delete_this').removeClass('hidden');
                            $('#delete_this').removeAttr('style');
                            // $('#modalLRForm').modal('show');
                        });

                    }




                    close_change_class_buttons();
                    if (formset_data.length !== 0) {
                        if (invoice_rows > 1) {

                            for (i = 0; i <= invoice_rows; i++) {
                                deleteFormreturn($('#PurchaseDetailsReturns'), String($('.added1').attr('id')));

                            }

                        }
                        let unitrowcounter = 0;
                        $.each(formset_data, function() {
                            if (unitrowcounter != 0) {
                                addForm($('.added1'), String($('.added1').attr('id')));
                            }

                            $.each(formset_data[unitrowcounter].fields, function(i, value) {
                                // alert(value);

                                $(`select[name="PurchaseDetailsReturns-${unitrowcounter}-${i}"]`).val(value);

                                $(`input[name="PurchaseDetailsReturns-${unitrowcounter}-${i}"]`).val(value);
                            });
                            let item_optoin = `<option selected value="${dataItem[unitrowcounter].id}">${dataItem[unitrowcounter].name_ar}</option>`;

                            // $(`#id_PurchaseDetailsReturns-${unitrowcounter}-item`).addclass("select-readonly");
                            $(`#id_PurchaseDetailsReturns-${unitrowcounter}-item`).append(item_optoin);

                            let unit = $(`#id_PurchaseDetailsReturns-${unitrowcounter}-unit`).val();

                            //    getItemunit(document.getElementById(`id_PurchaseDetailsReturns-${unitrowcounter}-item`));

                            //   $(`#id_PurchaseDetailsReturns-${unitrowcounter}-unit`).val(unit);
                            //getTotal(document.getElementById(`id_PurchaseDetailsReturns-${unitrowcounter}-discount`));
                            unitrowcounter += 1;
                        });
                        if (isNaN(document.getElementById('id_cost_center'))) {
                            $(`#id_cost_center`).val(formset_data[0].fields.cost_center)
                        }
                        // $(`#id_cost_center`).val(formset_data[0].fields.cost_center)
                        $('#Previous_Operations').modal('hide');

                        // $('#id_payment_method').trigger('change');
                    } else if (data.status == 3) {
                        alert_message(data.message, 'alert alert-warning', 'fa fa-times');

                        // alert(data.message + data.msg)
                    }
                }
            },
            error: function(data) {}

        });
    });


    $(document).on('click', '#delete_this', function(e) {
        form_id = '#form-id-return-purchases';
        var result = confirm(MsgConfirmDel);
        if (result) {
            let id_row = $("#id_invoice_r").val();

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
                    table.ajax.reload();


                    if (data.status == 1) {

                        $(form_id)[0].reset();
                        $(`textarea`).text('');
                        $('select').each(function() {
                            $(this).prop('selectedIndex', 0);
                            $(this).children("option").remove();
                        });
                        let invoice_rows = parseInt($('#id_' + 'PurchaseDetailsReturns' + '-TOTAL_FORMS').val());
                        for (i = 0; i <= invoice_rows; i++) {
                            deleteFormreturn($('#PurchaseDetailsReturns'), String($('.added1').attr('id')));
                        }

                        alert_message(data.message.message, data.message.class);
                        table.ajax.reload();


                    } else if (data.status == 3) {

                        alert_message(String(data.message.message), 'alert alert-warning', 'fa fa-times');

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

    let daily_type = 'purchase_returns'
    let _url = 'PurchasesReturnsView'
    $(document).on('click', '#show_daily_constraints_btn', function() {
        let daily_entry = $("#id_code").attr("daily_entries");
        $('#div_daily_constraints').load(daily_constraints + `?daily_constraint_type=${daily_type}&url=${_url}&dialy_entry_id=${daily_entry}`);
    });
    $(document).on('click', `#add_new`, function() {

        open_change_class_buttons();
        clearForm();
    });

    //start handel event for payment_methode
    $('#id_purchase_invoicelocal').on('change', function() {
        $.ajax({
            url: urlmax,
            data: { 'data': '' },
            method: 'get',
            success: function(data) {

                if (data.status == 1) {
                    
                    $('#id_code').val(data.data);
                    $('#id_code').attr('readonly', true);
                }
            },
            error: function(data) {}
        });

    });

});