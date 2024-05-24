
$(document).ready(function() {


    // $("#load_div_retutn").load(load_url);
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


    
function getPurchaseInvoiceReturn(element) {

    let id = $("#id_purchase_invoicelocal").val();
    alert(id)
    $("#load_div_retutn").load(load_url + `?invoice_id=${id}`);
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
                
                let purchase_invoice_details = data.purchase_invoice_details;
                let supplierdata = data.supplierdata;
                let supplier_optoin = `<option selected value="${supplierdata.id}">${supplierdata.name}</option>`;
                $('#id_supplir').append(supplier_optoin);
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


                let rows = parseInt($('#id_' + 'PurchaseDetailsReturns' + '-TOTAL_FORMS').val());
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

                    });
                    let paymentMethod = document.getElementById("id_payment_method").selectedIndex;
                    changePaymentMethod(paymentMethod);
                    getAmount();
                }

                if (purchase_invoice_details.length !== 0) {
                    addFormReturn($('#PurchaseDetailsReturns'), "PurchaseDetailsReturns");
                    if (rows > 1) {
                        for (let i = 0; i < rows; i++) {
                        }
                    }
                    $.each(data.purchase_invoice_details, function(index) {
                        // let costCenterOption = '<option value="' + data.purchase_invoice_details[index]['cost_center']+ '">' + data.purchase_invoice_details[index]['cost_center__name_ar'] + '</option>';
                        $(`#id_cost_center`).val(data.purchase_invoice_details[index]['cost_center']);
                        if (index !== 0) {

                            addFormReturn($('.added1'), String($('.added1').attr('id')));
                        }
                            // alert('d')

                        // alert(index)
                        // alert(d)
                        // alert(data.purchase_invoice_details[index]['qty'])
                        $(`input[name="PurchaseDetailsReturns-${index}-qty"]`).val(data.purchase_invoice_details[index]['qty']);
                        $(`input[name="PurchaseDetailsReturns-${index}-free_qty"]`).val(data.purchase_invoice_details[index]['free_qty']);
                        $(`input[name="PurchaseDetailsReturns-${index}-expire_date"]`).val(data.purchase_invoice_details[index]['expire_date']);
                        $(`input[name="PurchaseDetailsReturns-${index}-price"]`).val(data.purchase_invoice_details[index]['price']);
                        $(`input[name="PurchaseDetailsReturns-${index}-discount"]`).val(data.purchase_invoice_details[index]['discount']);
                        $(`input[name="PurchaseDetailsReturns-${index}-discount_rate"]`).val(data.purchase_invoice_details[index]['discount_rate']);
                        $(`input[name="PurchaseDetailsReturns-${index}-selling_price"]`).val(data.purchase_invoice_details[index]['selling_price']);
                        let itemOption = '<option value="' + data.purchase_invoice_details[index]['item'] + '">' + data.purchase_invoice_details[index]['item__name_ar'] + '</option>';
                        
                        $(`#id_PurchaseDetailsReturns-${index}-item`).addclass("select-readonly");
                        $(`#id_PurchaseDetailsReturns-${index}-item`).html("").append(itemOption);
                        // alert(data.purchase_invoice_details[index]['item__name_ar']);
                        let storeOption = '<option value="' + data.purchase_invoice_details[index]['store'] + '">' + data.purchase_invoice_details[index]['store__name'] + '</option>';
                        $(`#id_PurchaseDetailsReturns-${index}-store`).html("").append(storeOption);
                        let unitOption = '<option value="' + data.purchase_invoice_details[index]['unit'] + '">' + data.purchase_invoice_details[index]['unit__name_ar'] + '</option>';
                        $(`#id_PurchaseDetailsReturns-${index}-unit`).html("").append(unitOption);
                        // let costCenterOption = '<option value="' + data.purchase_invoice_details[index]['cost_center']+ '">' + data.purchase_invoice_details[index]['cost_center__name_ar'] + '</option>';
                        // $(`#id_PurchaseDetailsReturns-${index}-cost_center`).html("").append(costCenterOption);
                        getTotal(document.getElementById(`id_PurchaseDetailsReturns-${index}-discount`));

                    });
                }
            } else if (data.status === 1) {
                alert_message(String(data.message.message), 'alert alert-warning', 'fa fa-times');
            }
        },
        error: function(data) {}
    });
}

});

