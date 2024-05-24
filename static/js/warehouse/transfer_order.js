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
$(document).on('click', `.delete_form`, function() {
    alert("a");
    deleteFormset($(this), String($(this).attr('id')));
});

$("#code").attr("readonly","readonly");
       
$('#id_pricing_level').parent().parent().hide();

$("#id_is_stoped").change(function () {
    if ($(this).prop('checked') == true) {
        $('#id_pricing_level').parent().parent().show();
        $('#id_pricing_level').prop('required', true);
    } else {
        $('#id_pricing_level').html('');
        $('#id_pricing_level').parent().parent().hide();
    }
});

   
function check_item_fund() {
    let status = [];
    let fu = [];
    let prefix = String($('.remove_row').attr('id'));
    let sta = true;
    $('.items_val').each(function (i, j) {
        let id_row = $(this).attr('id');
        
        if (id_row != undefined) {
            id_row = id_row.split('-');
            let row = {
                'data': '',
                'id': id_row[1],
            }
            let item = $(`#id_${prefix}-${id_row[1]}-item`).val();
            let store = $(`#id_${prefix}-${id_row[1]}-store`).val();


            let data = [item, store];
            let found = false;

            $.each(status, function (index, existing) {
                if (data[0] == existing.data[0] && data[1] == existing.data[1]) {
                    fu.push(id_row[1]);
                    fu.push(existing.id);
                    found = true;
                    return false; // Exit the loop
                }
            });

            if (!found) {
                row['data'] = data;
                status.push(row);
            }
        }
    });


    if (fu.length > 0) {
        sta = false;
        $('.item').removeAttr('style');

        $.each(fu, function (index, value) {
            $(`#id_${prefix}-${value}-item`).parents('.item').attr('style', 'outline:red auto;');

        });
    } else {
        $('.item').removeAttr('style');

    }
    return sta;

}
function clear(){

var rowsToRemove = $('#tblProducts tr:not(:first)');

// إزالة صفوف الـ formset المحددة
rowsToRemove.remove();
$('.items_val').children('option').remove();
$('.item').removeAttr('style');
}
function get_max_id() {
    
    $.ajax({
        url: url_max_transfer0rder_number,
        data:{},
        method: 'GET',
        success: function (data) {
            $('input[name="code"]').val(data.data);
        },
        error: function () {

        },
    });

}
$('#btn_new').click(function(e) {
    get_max_id();

});
 
form_id = '#transfer_order_form';
$(document).on('submit', form_id, function (e) {
   

    e.preventDefault();
    
    // if (check_item_fund()) {
        // alert("aaaa");
        let forms = new FormData(this);

        $.ajax({
            url: $(this).attr('action'),
            data:forms,
            method: 'POST',
            contentType: false,
            processData: false,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("X-CSRFToken", csrf);
            },
            success: function (data) {
                if (data.status == 1) {
                    
                    alert_message(data.message.message, data.message.class);
                    // $('#load_item_qty').children().remove();
                    table.ajax.reload();
                    clear();
                    print_custom("Transfer Order", "transferorder", data.id);
                    $(form_id)[0].reset();
                    $('span[class="text-danger"]').remove();
                } else if (data.status == 2) {

                    $.each(data.error, function () {
                        let form = $(this)[0].form_id;
                        $(`#id_${form}-item`).parents('.item').css('outline', 'red auto');
                        alert_message($(this)[0].message, 'alert alert-danger');
                    });
                    // get_max_id();
                } else if (data.status == 0) {
                    
                    if (data.message != 'base') {
                        alert_message(data.message.message, data.message.class);
                    }
                    let row_id = data.error.form_id;
                    let error = JSON.parse(data.error.error);

                    $.each(error, function (i, value) {
                        let div = '<span class="text-danger">';
                        $.each(value, function (j, message) {
                            div += `- ${message.message}<br>`;
                        });
                        
                        $(`#id_${row_id}-${i}`).parent().append(div);
                        $(`#div_id_${i}`).append(div);
                    });
                    // alert($('input[name="code"]').val());
                    // get_max_id();
                    // $('#account').val(null).trigger('change');
                    

                }

                // get_max_id();
            },
            error: function (data) {
                alert('check input values');

            }
        });
     

    // }
});


function get_qty_expiry_date_transfer(myid){
    var ind = myid.name.split('-');

            if($("#id_store1").val()==""){
                alert("يجب إختيار المخزن")
                return false;
            }
            $.ajax({
                url: url_get_qty_expiry_date_transfer,
                data: {
                    "expiry_date":$(myid).val()
                },
                method: 'get',
                success: function(data) {
                    if(data.status == '1')
                    $(`#id_TransferOrderDetails-${ind[1]}-quantity_available`).val(data.quantity_available);
                }})
    
}
function getItemunit(id) {


        // if (RepeatInItem(id)) {
            var ind = id.name.split('-');
            $(`#id_TransferOrderDetails-${ind[1]}-unit`).html("");
            $(`#id_TransferOrderDetails-${ind[1]}-item_specification`).html("");
            $(`#id_TransferOrderDetails-${ind[1]}-item_specification`).attr("required", false);
            if($("#id_store1").val()==""){
                alert("يجب إختيار المخزن")
                return false;
            }
            $.ajax({
                url: url_get_units_item_transfer,
                data: {
                    'id': id.value,
                    "id_store":$("#id_store1").val()
                },
                method: 'get',
                success: function(data) {
                    
                    // var element = document.getElementById(`id_TransferOrderDetails-${ind[1]}-unit`);
                    // element.classList.remove("disabled");
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
                    $(`#id_TransferOrderDetails-${ind[1]}-unit`).html("");
                    $(`#id_TransferOrderDetails-${ind[1]}-unit`).append(option);
                    $(`#id_TransferOrderDetails-${ind[1]}-unit`).trigger('change');
                    ("select[class*=name_unit]")
                    if (data.data2.is_date == true) {
                        $(`#id_TransferOrderDetails-${ind[1]}-expiry_date`).attr("required", true);
                    } else{
                        $(`#id_TransferOrderDetails-${ind[1]}-expiry_date`).attr("required", false);
                    }
                        
                    $(`#id_TransferOrderDetails-${ind[1]}-qty`).val("1");
                    // alert(data.data2.tax_id)

                    // alert(data.data2.tax__tax_rate)
                    $(`#id_TransferOrderDetails-${ind[1]}-tax`).val(data.data2.tax_id);
                    $(`#id_TransferOrderDetails-${ind[1]}-tax_rate`).val(data.data2.tax__tax_rate);
                    if (data.data2.is_date == false) 
                    $(`#id_TransferOrderDetails-${ind[1]}-quantity_available`).val(data.data2.quantity_available);

                    var element3 = document.getElementById(`id_SalesBill-${ind[1]}-item_specification`);
                    if (element3 != null) {
                        element3.classList.remove("disabled");
                        $(`#id_TransferOrderDetails-${ind[1]}-item_specification`).val(data.data2.dis);
                    }
    
    
        $('#id_TransferOrderDetails-' + ind[1] + '-cost').val('');
        item = $('#id_TransferOrderDetails-' + ind[1] + '-item').val();
        unit = $('#id_TransferOrderDetails-' + ind[1] + '-unit').val();
        var qty = $('#id_TransferOrderDetails-' + ind[1] + '-qty').val();
        if(qty==undefined)
        {
            qty=1
        }
        $.ajax({
            method: "post", // initialize an AJAX request
            url: url_item_cost,
            data: {
                'item': item,
                'unit': unit,
                'qty': 1,
                'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
            },
            success: function (data, status) {

                var option;
                $.each(data, function (index, itemData) {
                    option = itemData;
                });
                $('#id_TransferOrderDetails-' + ind[1] + '-cost').val(option.toFixed(2));
                var subTotal = parseInt(qty, 10) * parseFloat(option);
                $('#id_TransferOrderDetails-' + ind[1] + '-tatal_cost').val(subTotal.toFixed(2));
                $('#grand-total').val(calcualte_total_amount().toFixed(2)
                );
            },

        })
        get_info_itm(id)
                },
                error: function(data) {}
            });
        // }
    }
    

    function get_info_itm(item){
        let id_row = $(item).attr('id');
        var strin = id_row.split('-');

        
        let store_id = $('#id_store1');
        let status_store = false;
        if (store_id.length > 0) {
            if (store_id.val() > 0) {
                store_id = store_id.val();
                status_store = true;
            } else {
                alert('يجب عليك إختيار المخزن');
           
                // item.children('option:selected').remove();
                status_store = false;
                store_id = '';
                item.prop('selectedIndex', 0);

            }
        } else {
            status_store = true;
            store_id = '';
        }

        if (status_store) {

            let id = $(item).val();
            let prefix = String($('.add_form').attr('id'));

            id_row = id_row.split('-');

            let store = $(`#id_TransferOrderDetails-${id_row[1]}-store`);
            let price = $(`#id_TransferOrderDetails-${id_row[1]}-price`);
            let discount = $(`#id_TransferOrderDetails-${id_row[1]}-discount`);
            let discount_pre_item = $(`#id_TransferOrderDetails-${id_row[1]}-discount_pre_item`);
            store.children('option').remove();
            let expiry_date = $(`#id_TransferOrderDetails-${id_row[1]}-expiry_date`);
            $.ajax({
                url: url_get_item_info_transfer,
                data: {
                    'id': id,
                    'store_id': store_id
                },
                method: 'GET',

                success: function(data) {
                    $(`#id_TransferOrderDetails-` + strin[1] + `-store`).html("");
                    $(item).parent().siblings('td').children('.name_currency').children('option').remove();

                    $(item).parent().siblings('td').children('.name_currency').children('option').remove();
                    
                    // Pricing of items
                    let data_price = data.data_price;
                    if (data_price) {
                        let min_price = 0;
                        let max_price = 0;
                        if (data_price[0]) {
                            min_price = parseFloat(data_price[0].min_price) * parseFloat(data_price[0].currency__exchange_rate);
                            max_price = max_price = parseFloat(data_price[0].max_price) * parseFloat(data_price[0].currency__exchange_rate);
                            data_price = parseFloat(data_price[0].price) * parseFloat(data_price[0].currency__exchange_rate);
                        } else {
                            data_price = 0;
                        }
                        let exchange_rate = parseFloat($('#id_exchange_rate').val());
                        $(price).val(data_price);
                        if (!isNaN(exchange_rate)) {
                            price_val = data_price / exchange_rate;
                            min_price_val = min_price / exchange_rate;
                            max_price_val = max_price / exchange_rate;
                        } else {
                            price_val = data_price;
                            min_price_val = min_price;
                            max_price_val = max_price;

                        }

                        let package = $(unit).children('option:selected').data('package');

                        if (!isNaN(package)) {
                            price_val = price_val * package;
                            min_price_val = min_price_val * package;
                            max_price_val = max_price_val * package;

                        } else {
                            price_val = price_val;
                            min_price_val = min_price_val;
                            max_price_val = max_price_val;
                        }
                        $(price).val(parseFloat(price_val).toFixed(0));
                        $(price).attr('min', parseFloat(min_price_val).toFixed(0));
                        $(price).attr('max', parseFloat(max_price_val).toFixed(0));
                    }

                         

                    if (store_id == '') {

                        let data_store = JSON.parse(data.data_store);
                        let option_store = `<option value="">.....</option>`;
                        $.each(data_store, function(i, j) {
                            option_store += `<option value="${j.pk}">${j.fields.name}</option>`;
                        });
                        store.append(option_store);


                    } else {

                        let qty = parseFloat(data.data_store.qty);

                        if (isNaN(qty)) {
                            $(`#id_TransferOrderDetails-${id_row[1]}-quantity`).attr('readonly', 'readonly');
                            $(`#id_TransferOrderDetails-${id_row[1]}-quantity`).val('');
                            $(`#id_TransferOrderDetails-${id_row[1]}-quantity`).parent().children('span').remove();
                            $(`#id_TransferOrderDetails-${id_row[1]}-quantity`).parent().append(`<span class="text-danger">-${quantity_error} </span>`);
                        } else {
                            let package = parseFloat($(`#id_TransferOrderDetails-${id_row[1]}-unit`).children('option:selected').data('package'));
                            $(`#id_TransferOrderDetails-${id_row[1]}-quantity`).removeAttr('readonly');
                            $(`#id_TransferOrderDetails-${id_row[1]}-quantity`).parent().children('span').remove();
                            if (!isNaN(package)) {
                                $(`#id_TransferOrderDetails-${id_row[1]}-quantity_available`).val(parseFloat(qty / package).toFixed(0));
                            } else {
                                $(`#id_TransferOrderDetails-${id_row[1]}-quantity_available`).val(qty);
                            }
                        }
                    }
                        /// expiry_date for itmes
                        expiry_date.children('option').remove();
                        
                        let option_expiry_date = ``;

                        let data_expiry_date = data.expiry_date_item;
                        $.each(data_expiry_date, function(h, p) {
                            option_expiry_date += `<option data-package="${p.qty}" value="${p.id}">${p.expire_date}</option>`;
                        });
                        expiry_date.append(option_expiry_date);
                        expiry_date.selectedIndex=1;
                        $(expiry_date).trigger('change');

                },
                error: function() {

                },
            });
        }


    }

  

function rest_all_formset() {
    // alert('hjass')
    $(".item").each(function() {
        $(this).find('.formset-field').each(function() {
            if ($(this).attr('style') == 'border:1px red solid;') {
                $(this).removeAttr('style');
            }
            if ($(this).attr('type') == 'number') {
                $(this).val(0);
            } else {
                $(this).val('');
            }
            // $(this).children('option').remove();
            $(this).parent().children('span[class="text-danger"]').remove();
        });


    });

}

$(document).on('click', '.add_form', function() {
    add_formset(this);
});
function add_formset(ele){
    
    let prefix = String($(ele).attr('id'));
    var formCount = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
    var row = $(".item:last").clone(false).get(0);
    let tr = `
    <select name="${prefix}-${formCount}-item" required="" onchange="getItemunit(this)" 
    class="formset-field items_val form-control select2-hidden-accessible" 
    style="width: 220px !important" 
    id="id_${prefix}-${formCount}-item" 
    data-autocomplete-light-language="ar" 
    data-autocomplete-light-url="${trnsfer_item_url}" 
    data-autocomplete-light-function="select2" 
    data-select2-id="id_${prefix}-${formCount}-item" 
    tabindex="-1" aria-hidden="true">
 
</select>
<span class="select2 select2-container select2-container--default select2-container--below select2-container--focus"
    dir="ltr" data-select2-id="${formCount}" ></span>
    `;
    
    let tr_unit =` <select name="${prefix}-${formCount}-unit" 
     class="formset-field select unit_class form-control" required="" style="width: 120px !important" id="id_${prefix}-${formCount}-unit">
     </select>`
    $(row).find('.td_two').html(tr);
    $(row).find('.td_unit').html(tr_unit);
    $(row).find('.td_two').attr('data-select2-id', formCount);
    $(`#id_${prefix}-${formCount}-item`).css('outline', '');
    $(row).find('.td_id').text(formCount + 1);
    $("span[cass='text-danger']", row).remove();
    $(row).children().removeClass("error");
    $(row).find('.formset-field').each(function() {
        updateElementFormset(this, prefix, formCount);
        $(this).val('');
        $(this).removeAttr('value');
        $(this).removeAttr('disabled');
        $(this).removeAttr('readonly');
        // $(ele).removeAttr('disabled');
    });
    $(row).find('.td_first').children('input').attr('readonly', 'readonly');
    $('.tbody_tb').append(row);
    // $(row).find(".delete_form").click(function() {

    // return deleteFormset(ele, prefix);
    // });
    $('#id_' + prefix + '-TOTAL_FORMS').val(formCount + 1);


}
function updateElementFormset(el, prefix, ndx) {
    var id_regex = new RegExp('(' + prefix + '-\\d+-)');
    var replacement = prefix + '-' + ndx + '-';
    if ($(el).attr("for")) $(el).attr("for", $(el).attr("for").replace(id_regex,
        replacement));
    if (el.id) el.id = el.id.replace(id_regex, replacement);
    if (el.name) el.name = el.name.replace(id_regex, replacement);
}


function calcualte_total_amount() {
    
    var grandTotal = 0;
    $('.tatal_cost_row').each(function () {
        var stval = parseFloat($(this).val());
        ////// 'D.7# 9/E 'D,E9 
        grandTotal += isNaN(stval) ? 0 : stval;
    });
    return grandTotal
}
function open_change_class_buttons() {
    $('#add-row1').removeClass('hidden');
    $('.add-form-row').removeClass('hidden');
    $('.remove_row').removeClass('hidden');
    $('#id_bond_number').removeAttr('daily_entries');
    $('#show_daily_constraints_btn').toggleClass('hidden');
    $('#add_new').toggleClass('hidden');
    $('#delete_this').toggleClass('hidden');

}
function close_change_class_buttons() {
    // $('#add-row1').addClass('hidden');
    // $('.add-form-row').addClass('hidden');
    // $('.remove_row').addClass('hidden');
    // $('#show_daily_constraints_btn').removeClass('hidden');
    // $('#add_new').removeClass('hidden');
    // $('#delete_this').removeClass('hidden');

}

$(document).on('click', '#btn_delete', function(e) {
    form_id = '#form_income1';
    if(!$("#id").val())
    {
        alert_message("يجب عليك إختيار الامر المراد حذفة");
                   
        return;
    }
    var result = confirm(MsgConfirmDel);
    if (result) {
        let id_row = $("#id").val();
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
                    alert_message(data.message.message, data.message.class);
                    
                    

                    $('span[class="text-danger"]').remove();
                    clear();
                   

                    

                } else if (data.status == 3) {
                    alert_message(data.message.message, data.message.class);




                }
                table.ajax.reload();
                
            },
            error: function(data) {
                alert_message("error", 'alert alert-warning', 'fa fa-times');

            }
        });
    }
});
function Calcualte() {

    var $tblrows = $("#tblProducts  tr.item");
    $tblrows.each(function (index) {
        var $tblrow = $(this);
        $tblrow.find('.qty_row, .cost_row').on('keyup', function () {
            var id = $(this).attr('id');
            var strin = id.split('-');
            var qty = $tblrow.find('#' + strin[0] + '-' + strin[1] + '-' + 'qty').val();
            //    alert(qty);
            var price = $tblrow.find('#' + strin[0] + '-' + strin[1] + '-' + 'cost').val();
            var subTotal = parseInt(qty, 10) * parseFloat(price);
            if (!isNaN(subTotal)) {
                $tblrow.find('#' + strin[0] + '-' + strin[1] + '-' + 'tatal_cost').val(subTotal.toFixed(2));
                $('#grand-total').val(calcualte_total_amount().toFixed(2)
                );
            }

        });
    });
}


$(document).ready(function () {
    
    $(".main-header>.navbar").toggleClass('margin-50');
    $(".content-wrapper>.content-header").toggleClass('margin-50');
    $("#contentMain>.row").toggleClass('margin-right-row');
    $("#total_div").toggleClass('margin-5');
    $(".main-footer").toggleClass('margin-50');
    $('body.skin-blue.sidebar-mini').toggleClass('sidebar-collapse');
    let num = $('#id_TransferOrderDetails-TOTAL_FORMS').val();
    // get_max_id();
    for (let index = 0; index < num; index++) {
        // $('#id_TransferOrderDetails-' + index + '-item').html("");
        // $('#id_TransferOrderDetails-' + index + '-unit').html("");

    }
    $('#clear').on("click", function () {
        $('#transfer_order_form')[0].reset();
        $('.items_val').children('option').remove();
        reset_form_all(form_id);
        // get_max_id();
    });
    
    
    $(document).on('change', 'select[name*=store2]', function () {
        let id = $(this).val();
        if(id==$("#id_store1").val()){

            alert_message("لا تستطيع نقل الصنف من نفس المخزن", "alert alert-danger");
            $(this).prop('selectedIndex', 0);
            $('.items_val').children('option').remove();
        }

    });
    
    let daily_type = 'transfering_order'
    let _url = 'transfer_order_list'
    $(document).on('click', '#show_daily_constraints_btn', function () {
        let daily_entry = $("#code").attr("daily_entries");
        $('#div_daily_constraints').load(daily_constraints + `?daily_constraint_type=${daily_type}&url=${_url}&dialy_entry_id=${daily_entry}`);
    });

    $(document).on('click', `#add_new`, function () {

        open_change_class_buttons();
        let form_id = '#transfer_order_form';
        reset_form_all(form_id);
        $('#transfer_order_form')[0].reset();
        // get_max_id();
    });

    $(document).on('click', '#btn_print', function(e) {
        e.preventDefault();
 
        if($("#id").val()) {
            create_transfer_report($("#id").val());
          $("#ReportAfterSave").modal('show');

        }
        else  {
            alert("يجب إختيار السند المراد طباعتة");

        }
    });
    // =============================================

    function create_transfer_report(id_row) {
        $.ajax({
            method: "get", // initialize an AJAX request
            dataType: "JSON",
            url:"/get_footer/",
            data:{"id":1},
        
            success: function(data) {
                let res = JSON.parse(data.data);
        
              $("#company_report").html(res[0].fields.name_ar);
              $("#phone_number").html(res[0].fields.phone);
              document.getElementById("logo_report").src=data.host+res[0].fields.image;
                $.ajax({
                  url: url_get_transfer_order_report,
                  
                  data: {
                    "id":id_row,
                    method: "get"
                    },
                    success: function (data) {
                        let res = data.data;
                        let ide=data.ide;
                        let header = data.header;
                        // res = res[0];
                        header = header[0];
                        console.log(res)
                        $("#name_report_Ar").html("امر تــحويل مــخزني");
                        $("#name_report_En").html("");
                        $("#incoming_order_type").html("نوع الصرف : "+header['outgoing_order_type__name_ar']);
                        
                        
                        $("#number_R").html(`رقم فاتورة:     ${header['code']}`);
                        $("#date_bill_R").html(`تاريخ فاتورة:     ${header['date']}`);
                        $("#reason_R").html(`${header['reason']}`);
                        $("#branch_R").html(`الفرع :${header['branch__name_ar']}`);
                        
                        $("#final_total_R").html(header['tatal_amount']);
                        
                        $("#statement_R").html(res['note']);
                        
                        
                        
                        // $("#discount_R").html(res['discount']);
                        
                        // $("#discount_item_R").html(res['discount_item']);
                        
                        
                        // $("#reference_R").html(res['reference_number']);
                        
                        
                        
                        
                        $("#Stor_R").html(`من المخزن: ${header['store1__name']}`+`<br> إلى مخزن: ${header['store2__name']}`);
                        
                        let table = document.createElement('table');let thead = document.createElement('thead');let tbody = document.createElement('tbody');let row_1 = document.createElement('tr');let heading_1 = document.createElement('th');let heading_2 = document.createElement('th');let heading_4 = document.createElement('th');let heading_5 = document.createElement('th');let heading_6 = document.createElement('th');let heading_7 = document.createElement('th');
                          
                          table.id="table_report_";
                          heading_1.innerHTML = "رقم الصنف";
                          heading_2.innerHTML = "اسم الصنف";
                          // heading_3.innerHTML = "تاريخ الانتهاء";
                          heading_4.innerHTML = "الوحدة";
                          heading_5.innerHTML = "الكمية";
                          heading_6.innerHTML = "السعر";
                          heading_7.innerHTML = "المجموع";
                        row_1.appendChild(heading_1);
                        row_1.appendChild(heading_2);
                        // row_1.appendChild(heading_3);
                        row_1.appendChild(heading_4);
                        row_1.appendChild(heading_5);
                        row_1.appendChild(heading_6);
                        row_1.appendChild(heading_7);
                        thead.appendChild(row_1);
        
        
                        // Creating and adding data to second row of the table
                        let row_2,row_2_data_1,row_2_data_2,row_2_data_3,row_2_data_4,row_2_data_5,row_2_data_6,row_2_data_7,row_2_data_8;
                        for (var i = 0; i < res.length; i++) {
                                row_2 = document.createElement('tr');
                                row_2_data_1 = document.createElement('td');
                                row_2_data_2 = document.createElement('td');
                                // row_2_data_3 = document.createElement('td');
                                row_2_data_4 = document.createElement('td');
                                row_2_data_5 = document.createElement('td');
                                row_2_data_6 = document.createElement('td');
                                row_2_data_7 = document.createElement('td');
                                
                                row_2_data_1.innerHTML = res[i]['item__number'];
                                row_2_data_2.innerHTML = res[i]['item__name_ar'];
 
                                row_2_data_4.innerHTML = res[i]['unit__name_ar'];
                                row_2_data_5.innerHTML = res[i]['qty'];
                                row_2_data_6.innerHTML = (res[i]['tatal_cost']/res[i]['qty']).toFixed(2);;
                                row_2_data_7.innerHTML = res[i]['tatal_cost'];
        
                                row_2.appendChild(row_2_data_1);
                                row_2.appendChild(row_2_data_2);
                                // row_2.appendChild(row_2_data_3);
                                row_2.appendChild(row_2_data_4);
                                row_2.appendChild(row_2_data_5);
                                row_2.appendChild(row_2_data_6);
                                row_2.appendChild(row_2_data_7);
                                tbody.appendChild(row_2);
                        }
        
                        // Creating and adding data to third row of the table
                        
                        
                        table.appendChild(thead);
                        table.appendChild(tbody);
        
                          $("#table_report").html(table);
                        
                        //   $("#note_repo").html(res[cou]['notes'])
        
        
        
                     
        
                        }
                  });    
        },
        error: function (data) {
                alert(data.status);
        
            }
        })
    }


    $(document).on('dblclick', '.show_Operation>tr', function () {
        $('#transfer_order_form').trigger("reset");
        let id_row = $(this).children('td:nth(0)').children('.row_span_id').data('id');
        if (id_row) {
            $.ajax({
                url: edit_url,
                data: { 'id': id_row, },
                method: 'get',
                success: function (data) {


                    table.ajax.reload();

                    let master = JSON.parse(data.data);
                    let dataItem = data.dataitem
                    let detail = JSON.parse(data.detail);
                    let row_count = parseInt($('#id_' + 'TransferOrderDetails' + '-TOTAL_FORMS').val());

                    $(`#id`).val(master[0].id);
                    if (data.status === 1) {
                        if (master[0].cost_center) {
                            
                            let cost_center_option = `<option selected value="${master[0].cost_center}">${master[0].cost_center__name_ar}</option>`;
                            $("#id_cost_center").append(cost_center_option);
                        }
                          
                        let transfer_order_type_option = `<option selected value="${master[0].transfer_order_type}">${master[0].transfer_order_type__name_ar}</option>`;
                        $("#id_transfer_order_type").append(transfer_order_type_option);
                        console.log(detail[0].fields['store1'])
                        console.log(detail[0].fields['store2__name'])
                        let store1_option = `<option selected value="${detail[0].store1}">${detail[0].store1__name}</option>`;
                        $("#id_store1").append(store1_option);
                        let store2_option = `<option selected value="${detail[0].store2}">${detail[0].store2__name}</option>`;
                        $("#id_store2").append(store2_option);
                        if (master.length !== 0) {

                            $.each(master[0], function (i, value) {
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
                                if (i == "daily_entries") {

                                    $("#code").attr('daily_entries', value);
                                }

                                close_change_class_buttons();
                                $('#Previous_Operations').modal('hide');

                            });

                        }


                        if (detail.length !== 0) {
                            var rowsToRemove = $('#tblProducts tr:not(:first)');
                            
                            rowsToRemove.remove();
                            $('.items_val').children('option').remove();
                            $('.item').removeAttr('style');
                            
                            let row_counter = 0;
                            let qty_value = 0;
                            let total_cost = 0;
                            $.each(detail.slice(0, detail.length - 1), function () {
                                add_formset($(".add_form"));
                            });
                            $.each(detail, function () {
                                $.each(detail[row_counter].fields, function (i, value) {

                                    $(`select[name="TransferOrderDetails-${row_counter}-${i}"]`).val(value)
                                    $(`input[name="TransferOrderDetails-${row_counter}-${i}"]`).val(value);
                                    if (i == "qty") {
                                        qty_value = value;
                                    }
                                    if (i == "tatal_cost") {
                                        total_cost = value;
                                    }
                                    $(`input[name="TransferOrderDetails-${row_counter}-cost"]`).val(parseFloat(total_cost) / parseFloat(qty_value));

                                });
                                let item_optoin = `<option selected value="${dataItem[row_counter].id}">${dataItem[row_counter].name_ar}</option>`;
                                $(`#id_TransferOrderDetails-${row_counter}-item `).append(item_optoin);

                                let unit = $(`#id_TransferOrderDetails-${row_counter}-unit`).val();

                                $(`#id_TransferOrderDetails-${row_counter}-unit`).val(unit);
                                row_counter += 1;
                            });
                        }
                        if (isNaN(document.getElementById('id_store'))) {
                        }
                        $('#Previous_Operations_close').trigger('click');

                    } else if (data.status == 3) {
                        alert_message(String(data.message.message), 'alert alert-warning', 'fa fa-times');

                        // alert(data.message + data.msg)
                    }
                },
                error: function (data) {
                }
            });
        }

    });


});


$(document).on('change', 'select[class*=items_val]', function() {
    let packagefff = $(this).val();



    let prefix = String($('.add_form').attr('id'));
    let id_row = $(this).attr('id');

    let store_id = $('#id_store1');
    let status_store = false;
    if (store_id.length > 0) {
        if (store_id.val() > 0) {
            store_id = store_id.val();
            status_store = true;
        } else {
            alert_message("لا تستطيع نقل الصنف من نفس المخزن", "alert alert-danger");
            $('.items_val').children('option').remove();
      
            status_store = false;
            store_id = '';

        }
    } else {

        status_store = true;
        store_id = '';
    }
    id_row = id_row.split('-');
    $('#id_TransferOrderDetails-' + id_row[1] + '-unit').html("");
    var item = $(this).val();  // get the selected country ID from the HTML input
    $.ajax({
        method: "post",                       // initialize an AJAX request
        url:  url_unit ,

        data: {
            'items': item,
            'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
        },
        success: function (data, status) {
            var option = `<option vaule="">---</option>`;
            $.each(data, function (index, itemData) {
           
                option += '<option value="' + index + ' ">' + itemData + '</option>';
            });
            $('#id_TransferOrderDetails-' + id_row[1] + '-unit').html("");
            $('#id_TransferOrderDetails-' + id_row[1] + '-unit').append(option)
            // `data` is the return of the `load_cities` view function
        }
    });
    let id =store_id


    if (id && item) {
        $.ajax({
            url: get_store_qty_expiry_date_url,
            data: {
                'id': id,
                'item_id': item
            },
            method: 'GET',
            success: function(data) {
               let option_expiry_date = `<option value="">.....</option>`;
                let data_expiry_date = data.store_quantity;
                $(`#id_TransferOrderDetails-${id_row[1]}-expiry_date`).html("");
                $.each(data_expiry_date, function(i, j) {
                    option_expiry_date += `<option value="${j.expiry_date}">${j.expiry_date}</option>`;
                });
                $(`#id_TransferOrderDetails-${id_row[1]}-expiry_date`).append(option_expiry_date);
            },
            error: function() {

            },
        });
    }


});


