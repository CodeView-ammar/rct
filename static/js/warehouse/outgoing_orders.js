
$(document).on('change', 'select[class=items_val]', function() {
      var id = $(this).attr('id');
      var x = id.split('-');
      $('#id_OutgoingOrderDetails-' + x[1] + '-unit').html("");
      var url = "{% url 'load_unit' %} "; // get the url of the `load_cities` view
      var items = $(this).val(); // get the selected country ID from the HTML input
      if ($(".currency").val() != "") {
          $.ajax({
              method: "post", // initialize an AJAX request
              url: url,

              data: {
                  'items': items,
                  'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
              },
              success: function(data, status) {
                  var option = `<option vaule="">---</option>`;
                  $.each(data, function(index, itemData) {

                      option += '<option value="' + index + ' ">' + itemData + '</option>';
                  });
                  $('#id_OutgoingOrderDetails-' + x[1] + '-unit').html("");
                  $('#id_OutgoingOrderDetails-' + x[1] + '-unit').append(option)
                      // `data` is the return of the `load_cities` view function
              }
          });
      } else {
          alert(msg);
          // $('.items_val').children('option').remove();
      }

      //load Store for that Item
      var id = $(this).attr('id');
      var x = id.split('-');
      $('#id_store').html("");
      var url = "{% url 'load_stores' %} ";
      var items = $(this).val(); // get the selected country ID from the HTML input
      $.ajax({
          method: "post", // initialize an AJAX request
          url: url,

          data: {
              'items': items,
              'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
          },
          success: function(data, status) {
              var option = `<option vaule="">---</option>`;
              $.each(data, function(index, itemData) {
                  option += '<option value="' + index + ' ">' + itemData + '</option>';
              });
              $('#id_store').html("");
              $('#id_store').append(option)
                  // `data` is the return of the `load_cities` view function
          }
      });
  });

  function calcualte_total_amount() {
    var grandTotal = 0;
    $('.total_price').each(function() {
        var stval = parseFloat($(this).val());
        grandTotal += isNaN(stval) ? 0 : stval;
    });

    // تحديد عدد الأرقام العشرية بعد الفاصلة إلى 2
    grandTotal = grandTotal.toFixed(2);

    return grandTotal;
}
function Calcualte() {

    var $tblrows = $("#tblProducts  tr.item");
    $tblrows.each(function(index) {
        var $tblrow = $(this);
        $tblrow.find(".qty_row, .price_row").on('keyup', function() {
            var id = $(this).attr('id');
            var strin = id.split('-');
            var qty = $tblrow.find('#' + strin[0] + '-' + strin[1] + '-' + 'qty').val();
            //    alert(qty);
            var price = $tblrow.find('#' + strin[0] + '-' + strin[1] + '-' + 'price').val();
            var subTotal = parseInt(qty, 10) * parseFloat(price);

            if (!isNaN(subTotal)) {

                $tblrow.find('#' + strin[0] + '-' + strin[1] + '-' + 'total_price').val(subTotal.toFixed(2));
                $('#grand-total').val(calcualte_total_amount());
            }

        });

        $tblrow.find(".remove-form-row").on('click', function() {


        });

    });
}
// addRowOnTabInTable('#control-formset', '.total_price','.add-form-row');

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
    $('#add-row1').addClass('hidden');
    $('.add-form-row').addClass('hidden');
    $('.remove_row').addClass('hidden');
    $('#show_daily_constraints_btn').removeClass('hidden');
    $('#add_new').removeClass('hidden');
    $('#delete_this').removeClass('hidden');

}

function get_total() {
    let all_total = 0;
    $('.qty_row ').each(function(i, j) {
        let qty = parseInt($(this).val());
        if (isNaN(qty)) {
            qty = 0;
        }
        let price = $(this).parent().siblings().children('.price_row').val();
        if (isNaN(price)) {
            price = 0;
        }
        let total = price * qty;
        all_total = all_total + total;
        $(this).parent().siblings().children('.total_price').val(total.toFixed(2));
        $('#grand-total').val(all_total.toFixed(2));
    });
}


$(document).ready(function() {

    $(".main-header>.navbar").toggleClass('margin-50');
    $(".content-wrapper>.content-header").toggleClass('margin-50');
    $("#contentMain>.row").toggleClass('margin-right-row');
    $("#total_div").toggleClass('margin-5');
    $(".main-footer").toggleClass('margin-50');
    $('body.skin-blue.sidebar-mini').toggleClass('sidebar-collapse');
    let num = $('#id_OutgoingOrderDetails-TOTAL_FORMS').val();
    get_max_id();
    // for (let index = 0; index < num; index++) {
    //     $('#id_OutgoingOrderDetails-' + index + '-unit').html('');
    //     $('#id_OutgoingOrderDetails-' + index + '-store').html('');
    //     // $('#id_OutgoingOrderDetails-'+index+'-item').html('');
    // }
    $('#clear').on("click", function() {
        $('#form_outgo')[0].reset();
        // $('.items_val').children('option').remove();
        open_change_class_buttons();
        reset_form_all(form_id);
        get_max_id();

    });

    // using jQuery
    
    let form_id = '#form_outgo';
    $(document).on('submit', form_id, function(e) {
        e.preventDefault();
        check_item_fund();
        $('span[class="text-danger"]').remove();
        if(!$("#id_store_main").val()){
            alert("يجب إختيار المخزن");
            return false;
        }
        if (check_item_fund()) {
            $.ajax({
                
                url: $(this).attr('action'),
                data: $(this).serialize(),
                method: 'POST',

                success: function(data) {
                    if (data.status == 1) {
                        alert_message(data.message.message, data.message.class);
                        $(form_id)[0].reset();
                        reset_form_all(form_id);
                        $('#id_account').children('option').remove();
                        get_max_id();
                        clear()
                        table.ajax.reload();
                        print_custom("Outgoing Order Report", "outgoingorder", data.id);
                        
                        // prefix = String($('.add-form-row').attr('id'));
                        // var formCount = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());

                        // while (formCount > 1) {

                        //     $(btn).parents('.item').remove();
                        // }

                    } else if (data.status == 2) {
                        $.each(data.error, function() {
                            let form = $(this)[0].form_id;
                            $(`#id_${form}-item`).parents('.item').css('outline', 'red auto');
                            alert_message($(this)[0].message, 'alert alert-danger');
                        });
                    } else if (data.status == 0) {
                        if (data.message == 'base') {
                            alert_message(data.message.message, data.message.class);
                        }
                        let row_id = data.error.form_id;

                        let error = JSON.parse(data.error.error);
                        $.each(error, function(i, value) {
                            let div = '<span class="text-danger">';
                            $.each(value, function(j, message) {
                                div += `- ${message.message}<br>`;
                            });
                            $(`#id_${row_id}-${i}`).parent().append(div);
                            $(`#div_id_${i}`).append(div);
                        });
                    }

                },
                error: function(data) {

                    alert_message(message_error, "alert alert-danger");

                }
            });
        } else {
            alert("error");
        }

    });
    function clear(){

        var rowsToRemove = $('#tblProducts tr:not(:first)');
      
        // إزالة صفوف الـ formset المحددة
        rowsToRemove.remove();
        $('.items_val').children('option').remove();
    }
    $(document).on('change', account_val, function() {
        var url = load_currency; // get the url of the `get_accounts_and_currency` view
        var accounts = $(this).val(); // get the selected account ID from the HTML input
        $.ajax({
            method: "post", // initialize an AJAX request
            url: url,
            data: {
                'accounts': accounts,
                'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
            },
            success: function(data, status) {
                $('#id_currency').html("")
                var option = `<option vaule="">---</option>`;
                $.each(data, function(index, itemData) {

                    option += '<option value="' + index + ' ">' + itemData + '</option>';
                });


                $('.currency').append(option)

                //   Get_Suppler()






            }
        });
        // Get exchange_rate

    });
    $(document).on('change', '.currency', function() {
        var currencys = $(this).val(); // get the selected currency ID from the HTML input

        $.ajax({
            url: url_currency,
            method: 'get',
            data: {
                'id': currencys,
            },
            success: function(data, status) {
                let res = JSON.parse(data.data);
                let exchange_rate = $(`.exchange_val`);

                exchange_rate.val(res[0].fields.exchange_rate);
                exchange_rate.attr('max', res[0].fields.highest_conversion_rate);
                exchange_rate.attr('min', res[0].fields.lowest_conversion_rates);
                $('.exchange_val').removeAttr('readonly');

                if (res[0].fields.currency_type == "local") {
                    $('.exchange_val').attr('readonly', 'readonly');

                }

                var option;

                // $('.tax_val').hide()
            }
        });
    });

    //    // get Currency
    //    $(document).on('change','select[class*=account_val]' '.', function () {
    //     var accounts = $(this).val(); // get the selected account ID from the HTML input
    //     $.ajax({
    //         method: "post", // initialize an AJAX request
    //         url: load_currency,
    //         data: {
    //             'accounts': accounts,
    //             'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
    //         },
    //         success: function (data, status) {
    //             var option = `<option vaule="">---</option>`;
    //             $.each(data, function (index, itemData) {
    //                 option += '<option value="' + index + ' ">' + itemData + '</option>';
    //             });
    //             $('.currency').html("")
    //             $('.currency').append(option)
    //         }
    //     });
    //     // Get exchange_rate 

    // });


    
$(document).on('click', '#btn_delete', function() {

    if (confirm_delete()) {
        let id_row = $("#id_invoice").val();
        $.ajax({
            url: url_outgoing_order_list,
            data: {
                'id': id_row,
            },
            method: 'delete',

            success: function(data) {
                if (data.status == 1) {
                    $(form_id)[0].reset();
                    reset_form_all(form_id);
                    alert_message(data.message.message, data.message.class);
                    $('#id_account').children('option').remove();
                    get_max_id();
                    clear()
                    table.ajax.reload();
                    
                    $('span[class="text-danger"]').remove();
                    $('#id_fund').children('option').remove();
                    $(`textarea`).text('');

                }

            },
            error: function(status, href, error) {
                alert_message(error, 'alert alert-danger');

            }
        });
    }
});

    $(document).on('change', '.exchange_val', function() {
        let amount = parseFloat($(this).val());
        let _max = parseFloat($(this).attr('max'))
        let _min = parseFloat($(this).attr('min'))
        if (amount > _max || amount < _min || isNaN(amount)) {
            $(this).removeAttr('style');
            $(this).parent().append(`<span class="text-danger">-${price_enter}  ${_min} - ${_max}</span>`);
            $(this).attr('style', 'border:1px red solid;');
        } else {
            $(this).parent().children(`span`).remove();
            $(this).removeAttr('style');

        }

        get_total();

    });

    $(document).on('change', '.items_val', function() {
        var formCount = parseInt($('#id_OutgoingOrderDetails' + '-TOTAL_FORMS').val());
        for (let i = 0; i < formCount; i++) {
    


        }

    });
    // $(document).on('change', '.currency, .exchange_val', function () {
    //     var formCount = parseInt($('#id_OutgoingOrderDetails' + '-TOTAL_FORMS').val());
    //     for (let i = 0; i < formCount; i++) {
    //         $('#id_OutgoingOrderDetails-' + i + '-total_price').html("");
    //         var item = $('#id_OutgoingOrderDetails-' + i + '-item').val();
    //         var unit = $('#id_OutgoingOrderDetails-' + i + '-unit').val();
    //         let qty = $('#id_OutgoingOrderDetails-' + i + '-qty').val();

    //         $.ajax({
    //             method: "post", // initialize an AJAX request
    //             url: url_item_cost,
    //             data: {
    //                 'item': item,
    //                 'unit': unit,
    //                 'qty': qty,
    //                 'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
    //             },
    //             success: function (data, status) {

    //                 var option;
    //                 $.each(data, function (index, itemData) {
    //                     option = itemData;
    //                 });
    //                 var exchange_rate = parseFloat($('#id_exchange_rate').val());
    //                 var price = parseFloat(option);
    //                 if (!isNaN(exchange_rate)) {
    //                     price = price / exchange_rate
    //                 }
    //                 $('#id_OutgoingOrderDetails-' + i + '-price').val(price.toFixed(2));
    //                 get_total();
    //             }
    //         });


    //     }

    // });



    let daily_type = 'outgoing_order'
    let _url = 'outgoing_order_list'
    $(document).on('click', `#add_new`, function() {

        open_change_class_buttons();

        reset_form_all(form_id);
        $('#form_outgo')[0].reset();
        get_max_id();
    });
    $(document).on('dblclick', '.show_Operation>tr', function() {
        $('#form_outgo').trigger("reset");

        let id_row = $(this).children('td:nth(0)').children('.row_span_id').data('id');
        $.ajax({
            url: edit_url,
            data: { 'id': id_row, },
            method: 'get',
            success: function(data) {


                table.ajax.reload();

                let master = JSON.parse(data.data);
                let dataItem = data.dataitem
                let detail = JSON.parse(data.detail);

                let row_count = parseInt($('#id_' + 'OutgoingOrderDetails' + '-TOTAL_FORMS').val());
                if (data.status === 1) {
                    
                    $(`#id_invoice`).val(master[0].id);
                    let account_option = `<option selected value="${master[0].account}">${master[0].account__arabic_name}</option>`;
                    $("#id_account").append(account_option);
                    if (master[0].cost_center) {

                        let cost_center_option = `<option selected value="${master[0].cost_center}">${master[0].cost_center__name_ar}</option>`;
                        $("#id_cost_center").append(cost_center_option);
                    }
                    if(master[0].outgoing_order_type=="null"){
                    let outgoing_order_type_option = `<option selected value="${master[0].outgoing_order_type}">${master[0].outgoing_order_type__name_ar}</option>`;
                    $("#id_outgoing_order_type").append(outgoing_order_type_option);
                    }
                    if (master.length !== 0) {

                        $.each(master[0], function(i, value) {
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
                                $("#id_code").attr('daily_entries', value);
                            }

                            close_change_class_buttons();
                            // $('#modalLRForm').modal('show');


                        });
                    }

                    if (detail.length !== 0) {
                        if (row_count > 1) {

                            for (i = 0; i <= row_count; i++) {
                                deleteForm($('.remove-form-row'), String($('.remove-form-row').attr('id')));
                            }
                        }
                        let unitrowcounter = 0;
                        $.each(detail, function() {

                            deleteForm($('.remove-form-row'), String($('.remove-form-row').attr('id')));
                            if (unitrowcounter != 0) {
                                addForm($('.added1'), String($('.added1').attr('id')));
                                $("#add-row11").addClass('hidden');
                            }
                            // addForm($('.remove-form-row'), String($('.remove-form-row').attr('id')));
                            $.each(detail[unitrowcounter].fields, function(i, value) {


                                $(`select[name="OutgoingOrderDetails-${unitrowcounter}-${i}"]`).val(value)
                                $(`input[name="OutgoingOrderDetails-${unitrowcounter}-${i}"]`).val(value);
                            });
                            let item_optoin = `<option selected value="${dataItem[unitrowcounter].id}">${dataItem[unitrowcounter].name_ar}</option>`;
                            $(`#id_OutgoingOrderDetails-${unitrowcounter}-item `).append(item_optoin);
                            let unit = $(`#id_OutgoingOrderDetails-${unitrowcounter}-unit`).val();
                            $(`#id_OutgoingOrderDetails-${unitrowcounter}-unit`).val(unit);
                            unitrowcounter += 1;
                        });
                    }
                    get_total();
                    $('#Previous_Operations_close').trigger('click');
                } else if (data.status == 3) {
                    alert_message(String(data.message.message), 'alert alert-warning', 'fa fa-times');
                }
            },
            error: function(data) {}
        });
    });

});