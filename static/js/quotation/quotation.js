var form_id_ = '#quotation_form';

$body = $("body");
$(document).ready(function() {

    $("#submit_button_delete_sall_bill").hide();
    $('.nav.navbar.navbar-static-top').toggleClass('margin-50');
    $('body.skin-blue.sidebar-mini').toggleClass('sidebar-collapse');
    $('#load_div').load(load_url);
    $('select[name="fund"]').attr('required', 'required');


    get_max_id($('#id_payment_method').val());
    setTimeout(() => {
        get_advanced_option_sales();

    }, 1000);

    $(document).on('click', `.delete_form`, function() {
        deleteFormset($(this), String($(this).attr('id')));
        get_total();
    });

    $(document).on('click', `.delete_form_burden`, function() {
        deleteburdenFormset($(this), String($(this).attr('id')));

    });


    // $(document).on('click', '.add_form_burden', function () {

    //     let prefix = String($(this).attr('id'));
    //     var formCount = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
    //     var row = $(".burden:last").clone(false).get(0);
    //     let tr = `<select name="${prefix}-${formCount}-burden_type_sales" data-row="class_row" class="formset-field form-control Burdens_name_burden_type_sales select2-hidden-accessible" id="id_${prefix}-${formCount}-burden_type_sales" data-autocomplete-light-language="en" data-autocomplete-light-url="${burden_url}" data-autocomplete-light-function="select2" data-select2-id="id_${prefix}-${formCount + 1}-burden_type_sales" tabindex="-1" aria-hidden="true">
    //        </select>`;
    //     $(row).find('.td_two_burden').html(tr);
    //     $(row).find('.td_two').attr('data-select2-id', formCount);
    //     $(`#id_${prefix}-${formCount}-burden_type_sales`).css('outline', '');
    //     $(row).find('.td_id_burden').text(formCount + 1);
    //     $("span[cass='text-danger']", row).remove();
    //     $(row).children().removeClass("error");
    //     $(row).find('.formset-field').each(function () {
    //         updateElementFormset(this, prefix, formCount);
    //         $(this).val('');
    //         $(this).removeAttr('value');
    //         $(this).attr('required', 'required');
    //     });
    //     $(row).find('.td_first_burden').children('input').attr('readonly', 'readonly');
    //     $(row).find(".delete_form_burden").click(function () {
    //         return deleteburdenFormset(this, prefix);
    //     });
    //     $('.tbody_tb_burden').append(row);
    //     $('#id_' + prefix + '-TOTAL_FORMS').val(formCount + 1);
    //     edit_form_burden();
    // });

    $(document).on('click', '.add_form', function() {

        let prefix = String($(this).attr('id'));
        var formCount = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
        var row = $(".item:last").clone(false).get(0);
        let tr = `<select name="${prefix}-${formCount}-item" data-row="class_row" style="width: 200px !important" class="formset-field form-control name_item focus-item s select2-hidden-accessible" onchange="getItemunit(this)"  id="id_${prefix}-${formCount}-item" data-autocomplete-light-language="ar" data-autocomplete-light-url="${item_url}" data-autocomplete-light-function="select2" data-select2-id="id_${prefix}-${formCount}-item" tabindex="0" aria-hidden="true">
        </select><span  class="select2 select2-container select2-container--default select2-container--below select2-container--focus" dir="ltr" data-select2-id="${formCount}" style="width: 183px;"></span>`;
        $(row).find('.td_two').html(tr);
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
        }); 
        $(row).find('.td_first').children('input').attr('readonly', 'readonly');
        $('.tbody_tb').append(row);
        $(`#id_${prefix}-${formCount}-discount`).val('0');
        $(`#id_${prefix}-${formCount}-quantity_available`).val('0');
        
        $(`#id_${prefix}-${formCount}-discount_pre_item`).val('0');
        $(row).find(".delete_form").click(function() {
            return deleteFormset(this, prefix);
        });
        $('#id_' + prefix + '-TOTAL_FORMS').val(formCount + 1);
        
        // $(`#id_${prefix}-${formCount}-item`).trigger('focus').trigger('keydown'); // تشغيل حدث الـ focus والـ keydown على العنصر المحدد
        // $('.select2-search__field').focus();
    });
    // $('.selection').on('keydown', function(e) {
    //     if (e.keyCode === 40) { // 40 يمثل زر السهم لأسفل
    //         // الكود الذي ترغب في تنفيذه عند الضغط على زر السهم لأسفل هنا
    //         console.log("a");
    //     }
    // });
    $(document).on('input', '#id_barcode_number', function(e) {
        e.preventDefault();
        read_barcode($(this));

    })

    let cun = 0;

    function read_barcode(valu_) {
        let barcode_number = '';
        let birdForm = document.querySelectorAll(".item")
        let formNum = birdForm.length - 1;

        if ($(valu_).val()) {
            // $(`.add_form`).trigger('click');
            barcode_number = $(valu_).val();
            $.ajax({
                url: get_items_barcode_number,
                data: {
                    'barcode_number': barcode_number,
                },
                method: 'GET',
                success: function(data) {
                    if (data.status == 1) {
                        $("#id_barcode_number").val('');
                        $("#id_barcode_number").focus();

                        if (cun >= 1) {
                            formNum += 1
                            $(".add_form").trigger("click");
                        }
                        if (data.barcode_item != '' && data.barcode_unit == '') {

                            // $(`#id_SalesBill-0-item option[value=` + data.barcode_item + `]`).change();
                            $(`#id_SalesBill-${formNum}-item`).val(data.barcode_item);
                            setTimeout(() => {
                                $(`#id_SalesBill-${formNum}-item`).val(data.barcode_item).change();
                            }, 1000);


                        } else {
                            // var last  = birdForm.lastElementChild.;
                            // alert(last)
                            for (var i = 0; i < formNum; i++) {
                                if ($(`#id_SalesBill-${i}-item`).val() == data.barcode_unit_item && $(`#id_SalesBill-${i}-unit`).val() == data.barcode_unit_unit) {

                                    $(`#id_SalesBill-${i}-quantity`).val(parseInt($(`#id_SalesBill-${i}-quantity`).val()) + 1).change();

                                    // deleteFormset($(".delete_form"), String($(".delete_form").attr('id')));
                                    // get_total();
                                    return;
                                }

                            }

                            $(`#id_SalesBill-${formNum}-item`).val(data.barcode_unit_item);
                            $(`#id_SalesBill-${formNum}-item`).val(data.barcode_unit_item).change();
                            $(`#id_SalesBill-${formNum}-unit`).val(data.barcode_unit_unit);
                            setTimeout(() => {
                                $(`#id_SalesBill-${formNum}-unit`).val(data.barcode_unit_unit).change();
                            }, 1000);
                            cun += 1;
                            $(`#id_SalesBill-${formNum}-quantity`).val(1).change();
                            // $(".name_quantity").trigger('change');
                        }

                        return;
                    } else {
                        alert('لا يوجد صنف بهذا الباركود')
                    }



                },
                error: function() {

                },
            });

        }

    }



    $(document).on('change', 'select[name="payment_method"]', function() {
        let val = $(this).val();
        get_max_id(val);
        check_paymant_method(val);


    });
    $(document).on('click', '.delete_row', function() {
        if (confirm_delete()) {

            let id_row = $(this).data('id');

            $.ajax({

                url: $(this).data('url'),
                data: {
                    'id': id_row,
                },
                method: 'DELETE',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("X-CSRFToken", csrf);
                },
                success: function(data) {
                    if (data.status == 1) {
                        alert_message(data.message.message, data.message.class);
                        table.ajax.reload();
                    }
                },
                error: function(data) {}
            });
        }
    });


    $(document).keydown(function(e) {
        if (e.ctrlKey && e.keyCode == 32 && !$("#btn_save").prop("disabled")) {
            $('.add_form').click();
            // let lastRow = $('.name_item:last'); // جلب آخر سطر داخل الجدول
            // let id_row = lastRow.attr('id'); // الحصول على قيمة الـ id من السطر
            // console.log(id_row);
            // $(`#${id_row}`).trigger('focus').trigger('keydown'); // تشغيل حدث الـ focus والـ keydown على العنصر المحدد
            // $('.select2-search__field').focus();
    }
    });

    $(document).on('change', 'select[class*=name_unit]', function() {

        let prefix = String($('.add_form').attr('id'));
        let id = $(this).val();
        let id_row = $(this).attr('id');
        id_row = id_row.split('-');

        let price = $(`#id_${prefix}-${id_row[1]}-price`);
        let item = $(`#id_${prefix}-${id_row[1]}-item`).val();
        let expiry_date_id = $(`#id_${prefix}-${id_row[1]}-expiry_date`);
        let store_id = $('#id_store');
        // let expiry_date_id = $('.name_expiry_date');

        let store = '';
        let expiry_date = '';
        if (store_id.length > 0) {
            if (store_id.val() > 0) {
                store = store_id.val();
            } else {
                alert("Please Select Store First");

                // $(this).children('option:selected').remove();
                // $(this).attr('readonly');

                $('.name_quantity').attr('readonly', true);

            }
        } else {

            store = $(`#id_${prefix}-${id_row[1]}-store`).val();
        }
        // توقفت هنا انه يندي الكميات حسب تواريخ الانتها عندما يستخدم تواريخ الانتهاء
        if (expiry_date_id.length > 0) {
            if (expiry_date_id.val() > 0) {
                expiry_date = expiry_date_id.val();
            } else {
                alert('يجب عليك إختيار تاريخ الإتهاء');
                $(this).children('option:selected').remove();

            }
        }

        // alert('expiry_date')
        // alert(expiry_date)

        if (id && item && store) {
            $.ajax({
                url: get_item_details,
                data: {
                    'store_id': store,
                    'item_id': item,
                    'unit_id': id,
                    'expiry_date_id': expiry_date,
                },
                method: 'GET',
                success: function(data) {
                    let qty = parseFloat(data.data.qty);
                    // alert('Afeef')
                    $(`#id_${prefix}-${id_row[1]}-quantity_available`).val("0");

                    let package = parseFloat(data.package);
                    // let package = parseFloat($(`#id_${prefix}-${id_row[1]}-unit`).children('option:selected').data('package'));
                    if (!isNaN(package)) {
                        $(`#id_${prefix}-${id_row[1]}-quantity_available`).val(parseFloat(qty / package).toFixed(0));
                    } else {
                        $(`#id_${prefix}-${id_row[1]}-quantity_available`).val(qty);
                    }
                    if($(`#id_${prefix}-${id_row[1]}-quantity_available`).val()=="")
                        $(`#id_${prefix}-${id_row[1]}-quantity_available`).val('0');





                    let data_price = data.data_price;
                    let min_price = 0;
                    let max_price = 0;
                    if (data_price[0]) {
                        min_price = parseFloat(data_price[0].min_price) / parseFloat(data_price[0].currency__exchange_rate);
                        max_price = max_price = parseFloat(data_price[0].max_price) / parseFloat(data_price[0].currency__exchange_rate);
                        data_price = parseFloat(data_price[0].price) / parseFloat(data_price[0].currency__exchange_rate);
                    } else {
                        data_price = 0;
                    }
                    let exchange_rate = parseFloat($('#id_exchange_rate').val());

                    if (!isNaN(exchange_rate)) {
                        if (exchange_rate > 1) {
                            price_val = (parseFloat(data_price) / parseFloat(exchange_rate)).toFixed(0);
                            min_price_val = (min_price / exchange_rate).toFixed(0);
                            max_price_val = (max_price / exchange_rate).toFixed(0);
                        } else {
                            price_val = parseFloat(data_price) / parseFloat(exchange_rate);
                            min_price_val = min_price / exchange_rate;
                            max_price_val = max_price / exchange_rate;
                        }

                    } else {

                        price_val = data_price;
                        min_price_val = min_price;
                        max_price_val = max_price;

                    }



                    // if (!isNaN(package)) {
                    //     // price_val = price_val * package;
                    //     // min_price_val = min_price_val * package;
                    //     // max_price_val = max_price_val * package;
                    //     price_val = price_val;
                    //     min_price_val = min_price_val;
                    //     max_price_val = max_price_val;
                    // } else {
                    price_val = price_val;
                    min_price_val = min_price_val;
                    max_price_val = max_price_val;
                    // }
                    $(price).val(price_val);
                    $(price).attr('min', min_price_val);
                    $(price).attr('max', max_price_val);
                    let discount = $(`#id_${prefix}-${id_row[1]}-discount`);
                    let discount_pre_item = $(`#id_${prefix}-${id_row[1]}-discount_pre_item`);
                    // get_discount_info(item, id, discount, discount_pre_item);

                },
                error: function() {

                },
            });
            get_total();
        }
        setTimeout(() => {
            $(`#id_${prefix}-${id_row[1]}-quantity`).trigger('click');
        }, 100);
    });





    $(document).on('change', 'select[class*=name_expiry_date]', function() {
        let packagefff = $(this).val();



        let prefix = String($('.add_form').attr('id'));
        let id_row = $(this).attr('id');

        // let store_id = $('#id_store');
        // let status_store = false;
        // if (store_id.length > 0) {
        //     if (store_id.val() > 0) {
        //         store_id = store_id.val();
        //         status_store = true;
        //     } else {
        //         alert('{% trans "Please Select Store First" %}');
        //         // $(this).children('option:selected').remove();
        //         status_store = false;
        //         store_id = '';
        //         $(this).prop('selectedIndex', 0);

        //     }
        // } else {

        //     status_store = true;
        //     store_id = '';
        // }

        // // clear_item_store(id_row);
        // let id = $(this).val();
        // id_row = id_row.split('-');
        // let item = $(`#id_${prefix}-${id_row[1]}-item`).val();
        // let item = $(`#id_${prefix}-${id_row[1]}-item`).val();

        // let expire_date = $(`#id_${prefix}-${id_row[1]}-expiry_date`);

        // if (id && item) {
        //     $.ajax({
        //         url: get_store_qty_expiry_date,
        //         data: {
        //             'id': id,
        //             'item_id': item
        //         },
        //         method: 'GET',
        //         success: function(data) {
        //             // alert('s')

        //             // let qty = parseFloat(data.data.qty);
        //             // let package = parseFloat($(`#id_${prefix}-${id_row[1]}-unit`).children('option:selected').data('package'));
        //             // if (!isNaN(package)) {
        //             //     $(`#id_${prefix}-${id_row[1]}-quantity_available`).val(parseFloat(qty / package).toFixed(2));
        //             // } else {
        //             //     $(`#id_${prefix}-${id_row[1]}-quantity_available`).val(qty);
        //             // }
        //             // alert('s7')
        //             // $(`#id_SalesBill-` + strin[1] + `-expiry_date`).html("")
        //             let option_expire_date = `<option value="">.....</option>`;
        //             // let option_expire_date = ``;
        //             let data_expire_date = data.store_quantity;
        //             // alert(data_expire_date)
        //             // $(this).parent().siblings('td').children('.name_currency').children('option').remove();
        //             $.each(data_expire_date, function(i, j) {
        //                 // alert('a')
        //                 // let selected = 'selected';
        //                 // if (j.ItemUnit__sales_unit) {
        //                 //     selected = 'selected';
        //                 //     // get_discount_info(id, j.id, discount, discount_pre_item);
        //                 // }
        //                 option_expire_date += `<option data-package="${j.qty}" value="${j.id}">${j.expire_date}</option>`;
        //             });
        //             expire_date.append(option_expire_date);



        //         },
        //         error: function() {

        //         },
        //     });
        // }

        // alert('e')

        // alert('4')
        clear_item_store(id_row);
        // alert('44')
        id_row = id_row.split('-');
        // let item = $(`#id_${prefix}-${id_row[1]}-item`).val();

        let qty = parseFloat($(`#id_${prefix}-${id_row[1]}-expiry_date`).children('option:selected').data('package'));
        // alert('7')
        // alert(qty)
        // let qty = parseFloat(data.data.qty);
        let package = parseFloat($(`#id_${prefix}-${id_row[1]}-unit`).children('option:selected').data('package'));
        if (!isNaN(package)) {
            $(`#id_${prefix}-${id_row[1]}-quantity_available`).val(parseFloat(qty / package).toFixed(0));
        } else {
            $(`#id_${prefix}-${id_row[1]}-quantity_available`).val(qty);
        }



    });



    $(document).on('change', 'select[class*=name_store]', function() {
        let id = $(this).val();
        let prefix = String($('.add_form').attr('id'));
        let id_row = $(this).attr('id');

        let unit = $(`#id_${prefix}-${id_row[1]}-unit`);
        unit.parents('tr').find('span[class="text-danger"]').remove();
        // unit.parents('tr').find('input,select').removeAttr('style');
        id_row = id_row.split('-');
        let item = $(`#id_${prefix}-${id_row[1]}-item`).val();


        // alert('jave')

        let expire_date = $(`#id_${prefix}-${id_row[1]}-expiry_date`);
        expire_date.children('option').remove();
        // alert('jave')

        if (id && item) {
            $.ajax({
                url: get_storeqty_info,
                data: {
                    'id': id,
                    'item_id': item
                },
                method: 'GET',
                success: function(data) {
                    // alert('s')

                    let qty = parseFloat(data.data.qty);
                    let package = parseFloat($(`#id_${prefix}-${id_row[1]}-unit`).children('option:selected').data('package'));
                    if (!isNaN(package)) {
                        $(`#id_${prefix}-${id_row[1]}-quantity_available`).val(parseFloat(qty / package).toFixed(0));
                    } else {
                        $(`#id_${prefix}-${id_row[1]}-quantity_available`).val(qty);
                    }
                    // alert('s7')
                    // $(`#id_SalesBill-` + strin[1] + `-expiry_date`).html("")
                    let option_expire_date = `<option value="">.....</option>`;
                    // let option_expire_date = ``;
                    let data_expire_date = data.store_quantity;
                    // alert(data_expire_date)
                    // $(this).parent().siblings('td').children('.name_currency').children('option').remove();
                    $.each(data_expire_date, function(i, j) {
                        // alert('a')
                        // let selected = 'selected';
                        // if (j.ItemUnit__sales_unit) {
                        //     selected = 'selected';
                        //     // get_discount_info(id, j.id, discount, discount_pre_item);
                        // }
                        option_expire_date += `<option data-package="${j.qty}" value="${j.id}">${j.expire_date}</option>`;
                    });
                    expire_date.append(option_expire_date);

                    // alert('afeef')

                },
                error: function() {

                },
            });
        }

    });

    $(document).on('change', 'input[class*=Burdens_name_value]', function() {
        let val = $(this).val();
        let prefix = String($('.add_form_burden').attr('id'));
        let id_row = $(this).attr('id');
        id_row = id_row.split('-');
        let total_burden = $(`#id_${prefix}-${id_row[1]}-total`);
        if (isNaN(val)) {
            val = 0;
        }
        let total = parseFloat($('#total').val());
        if (isNaN(total)) {
            total = 0;
        }
        let final_total = ((val * 100) / total);
        $(`#id_${prefix}-${id_row[1]}-ratio`).val(final_total);
        $(total_burden).val(val);
        get_total();

    });

    $(document).on('change', 'input[class*=Burdens_name_ratio]', function() {
        let val = $(this).val();
        let prefix = String($('.add_form_burden').attr('id'));
        let id_row = $(this).attr('id');
        id_row = id_row.split('-');
        let value = $(`#id_${prefix}-${id_row[1]}-value`);
        let total_burden = $(`#id_${prefix}-${id_row[1]}-total`);
        if (isNaN(val)) {
            val = 0;
        }
        let total = parseFloat($('#total').val());
        if (isNaN(total)) {
            total = 0;
        }
        let final_total = (val * total) / 100;
        $(value).val(final_total);
        $(total_burden).val(final_total);
        get_total();

    });

    $(document).on('change', '.name_discount', function() {
        let id = parseFloat($(this).val());
        let prefix = String($('.add_form').attr('id'));
        let id_row = $(this).attr('id');
        id_row = id_row.split('-');
        let discount_pre_item = $(`#id_${prefix}-${id_row[1]}-discount_pre_item`);
        let total = $(`#id_${prefix}-${id_row[1]}-total`).val();
        let quantity = $(`#id_${prefix}-${id_row[1]}-quantity`).val();
        discount_pre_item.parent().children(`span`).remove();
        // discount_pre_item.removeAttr('style');
        if (id > parseFloat(total) || id > parseFloat(quantity)) {
            $(this).parent().append(`<span class="text-danger">-${discount_enter} </span>`);
            $(this).attr('style', 'border:1px red solid;');
        } else {
            $(this).parent().children(`span`).remove();
            // $(this).removeAttr('style');
            $(discount_pre_item).val(parseInt((100 * id) / total));
        }

    });

    $(document).on('change', 'input[class*=name_discount_pre_item]', function() {

        let id = $(this).val();
        let prefix = String($('.add_form').attr('id'));
        let id_row = $(this).attr('id');
        id_row = id_row.split('-');
        let discount = $(`#id_${prefix}-${id_row[1]}-discounted_price`);
        let total = $(`#id_${prefix}-${id_row[1]}-total`).val();
        discount.parent().children(`span`).remove();
        // discount.removeAttr('style');
        if (id > 100) {
            $(this).parent().append(`<span class="text-danger">aaaaaaaaaaaaaaa-${discount_enter} </span>`);
            $(this).attr('style', 'border:1px red solid;');
        } else {

            let tot = parseFloat(id) * parseFloat(total);

            $(this).parent().children(`span`).remove();
            // $(this).removeAttr('style');
            $(discount).val(tot / 100);
            // $(discount).val(parseFloat((id * total) / 100));
        }


    });

    $(document).on('change  click', '.name_quantity', function() {
        let id = $(this).val();

        let prefix = String($('.add_form').attr('id'));
        let id_row = $(this).attr('id');
        id_row = id_row.split('-');

        let quantity_available = parseFloat($(`#id_${prefix}-${id_row[1]}-quantity_available`).val());
        $(this).parent().children(`span`).remove();

        $.ajax({
            url: url_check_item_services,
            method: 'POST',
            data: {
                'item_id': $(`#id_${prefix}-${id_row[1]}-item`).val(),
                'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
            },
            success: function(data) {

        if (!isNaN(parseFloat(id))&& data['result']==false) {
            
        }
    }})

    });

    $(document).on('change', '.name_price', function() {
        let id = $(this).val();
        let prefix = String($('.add_form').attr('id'));
        let id_row = $(this).attr('id');

        id_row = id_row.split('-');
        let min_price = parseFloat($(this).attr('min'));
        let max_price = parseFloat($(this).attr('max'));
        $(this).parent().children(`span`).remove();
        if (!isNaN(parseFloat(id))) {

            if ((parseFloat(id) > max_price) || (parseFloat(id) < min_price)) {
                $(this).parent().children(`span`).remove();
                $(this).parent().append(`<span class="text-danger">-${price_enter}  ${min_price} - ${max_price}</span>`);
                $(this).attr('style', 'width: 110px !important');
            } 
        } else {

            parseFloat(id) = 0;
            $(this).parent().children(`span`).remove();
            // $(this).removeAttr('style');

        }


    });

    $(document).on('change', '#id_currency', function() {
        $('#id_exchange_rate').val('');
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
                        change_currency(res[0].fields.exchange_rate);
                    }
                },
                error: function(data) {}
            });

            get_total();
        }
    });
    $(document).on('change', '#id_store', function() {
        rest_all_formset();
        get_total();
        $('.name_quantity').attr('readonly', false);
    });


    $(document).on('change', '#id_exchange_rate', function(evt) {
        let amount = parseFloat($(this).val());
        let _max = parseFloat($(this).attr('max'))
        let _min = parseFloat($(this).attr('min'))
        if (amount > _max || amount < _min || isNaN(amount)) {
            $(this).parent().append(`<span class="text-danger">-ddddddd${price_enter}  ${_min} - ${_max}</span>`);
            $(this).attr('style', 'border:1px red solid;');
        } else {
            $(this).parent().children(`span`).remove();
            // $(this).removeAttr('style');

        }

        get_total();

    });

    $(document).on('change', '#discount', function() {
        let val = parseFloat($(this).val());

        let discount_items = parseFloat($(`#discount_items`).val());
        let total = parseFloat($(`#total`).val());
        let taxes = parseFloat($(`#taxes`).val());
        if (isNaN(taxes)) {
            taxes = 0;
        }
        let to = (total + taxes) - discount_items;
        if (val > to) {
            $(this).parent().append(`<span class="text-danger">-${discount_enter} </span>`);
            $(this).attr('style', 'border:1px red solid;');
        } else {
            $(this).parent().children(`span`).remove();
            // $(this).removeAttr('style');
            // $('#discount_presentg').val(parseInt((100 * val) / total));
        }

    });

    $(document).on('change', '#discount_presentg', function() {
        let val = parseFloat($(this).val());

        let discount_items = parseFloat($(`#discount_items`).val());
        let total = parseFloat($(`#total`).val());
        let taxes = parseFloat($(`#taxes`).val());
        if (isNaN(taxes)) {
            taxes = 0;
        }
        let to = (total + taxes) - discount_items;
        if (val > 100) {
            $(this).parent().parent().append(`<span class="text-danger">-${discount_enter} </span>`);
            $(this).attr('style', 'border:1px red solid;');
        } else {
            $(this).parent().parent().children(`span`).remove();
            $(this).removeAttr('style');
            $('#discount').val(parseFloat((val * total) / 100));
        }

    });

    $(document).on('click', '#Previous_Operations_btn', function() {
        table.ajax.reload();
    });
    let id;
    $(document).on('click', '.show_Operation>tr', function() {
        $("#id_deported").val("0");
        id = $(this).children('td:nth(0)').children('.row_span_id').data('id');
        if (id != undefined) {

            $.ajax({
                url: get_master,
                method: 'get',
                data: {
                    'id': id
                },
                success: function(data) {
                    if (data.data) {
                        let res = JSON.parse(data.data);
                        res = res[0];
                        $.each(res, function(i, j) {
                            $(`input[name="${i}"]`).val(j);
                            $(`input[name="${i}"][type="number"]`).val(parseFloat(j));
                            $(`input[name=${i}]`).prop('checked', j);
                            $(`textarea[name=${i}]`).text(j);
                            $(`select[name="${i}"] option`).each(function() {
                                if ($(this).val() == j) {
                                    $(this).prop("selected", true);
                                }
                            });
                        });

                        $("#id_id").val(res.id)
                        $('#id_store').children(`option[value="${res.quotationdetail__store_id}"]`).prop('selected', true);
                        let customer = `<option selected value="${res.customer_data}">${res.customer_data__number} ${res.customer_data__name_ar} ${res.customer_data__name_en}</option>`;
                        let fund = `<option selected value="${res.detailssalesbillpayment__fund}">${res.detailssalesbillpayment__fund__number} ${res.detailssalesbillpayment__fund__arabic_name}</option>`;

                        let bank = `<option selected value="${res.detailssalesbillpayment__bank}">${res.detailssalesbillpayment__bank} ${res.detailssalesbillpayment__bank__arabic_name}</option>`;
                        if (res.customer_data__number) {
                            $('#id_customer_data').append(customer);
                        }
                        // alert(res.detailssalesbillpayment__fund)

                        if (res.detailssalesbillpayment__fund) {
                            $('#id_fund').append(fund);
                        }
                        if (res.detailssalesbillpayment__bank) {
                            $('#id_bank').append(bank);
                        }
                     
                        // $(`#id_PurchaseInvoicelocalDetails-${unitrowcounter}-tax `).val(datatax[unitrowcounter].id);

                        $('#id_deported').prop('checked', res.daily_entry__deported);
                        check_paymant_method(res.payment_method);
                        $('#load_div').load(load_url + `?id=${id}`);


                    }
                    $('#Previous_Operations').modal('hide');
                    $('.modal-backdrop').remove();

                },
                error: function(data) {}
            });
            // setTimeout(function() {
            //     // change_class_buttons();
            //     get_total();
            // }, 10000);
        }
    });
    // $(document).on('click', '#btn_print', function(e) {
    //     e.preventDefault();
    //     if($("#id_id").val()){

    //         $("#ReportAfterSave").modal('show');
    //         create_profile_repo($("#id_invoice1").val());

    //     }else if($("#id_invoice_r").val()){
    //         $("#ReportAfterSave").modal('show');
    //         create_profile_repo($("#id_invoice_r").val());

    //     }
    //     else{
    //         alert("يجب إختيار فاتورة المراد طباعتة");

    //     }
    // });
    $(document).on('click', `#add_new`, function() {
        reset_(form_id_);

    });

    function reset_(form_id_) {
        // change_class_buttons();
        reset_form_all(form_id_);
        edit_form_item();
    }
    $(document).on('change', `input[class*=name_price],
        input[class*=name_discount],
        input[class*=name_discount_pre_item],
        #id_exchange_rate,
        #id_currency,
        #taxes,
        #discount,
        input[class*=name_quantity]`, function() {
        get_total();

    });


    $('select[name="bank"]').prop('required', false);
    $('input[name="burdens_quotation-0-type_"]').prop('required', false);

    // save 
    $(document).on('submit', form_id_, function(e) {
        e.preventDefault();






        $('span[class="text-danger"]').remove();
            let forms = new FormData(this);

            $.ajax({
                url: quotation,
                // data: forms.serialize(),
                data: forms,
                method: 'POST',
                contentType: false,
                processData: false,
                success: function(data) {
                    $('span[class="text-danger"]').remove();
                    if (data.status == 1) {


                        $('#load_div').load(load_url);
                        get_advanced_option_sales();
                        alert_message(data.message.message, data.message.class);
                        if (data.check_print.toString() == 'true') {
                            $("#print_hort").modal('show');
                            create_report_casher(data.id);
                        }
                        table.ajax.reload();
                        reset_form_all('#quotation_form');
                        cun = 0;
                        setTimeout(function() {
                            control_button(false);
                            func_btn_save("0");
                        }, 2010);

                    } else if (data.status == 0) {
                        // alert('success 4')

                        if (data.message != 'base') {

                            alert_message(data.message.message, data.message.class);
                        }
                        let row_id = data.error.form_id_;
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
                    } else if (data.status == 2) {
                        $.each(data.error, function() {
                            let form = $(this)[0].form_id_;
                            $(`#id_${form}-item`).parents('.item').css('outline', 'red auto');
                            alert_message($(this)[0].message, 'alert alert-danger');
                        });
                    }
                    setTimeout(function() {
                        control_button(false);
                        func_btn_save("1");
                    }, 2010);

                    $("#id_id").val(data.id)
                },
                error: function(data) {
                    alert('fail');
                 

                }
            });
       
           });

    $("#btn_delete").on("click", function(e) {
        e.preventDefault();
        if (confirm_delete()) {

            let id_sales_b_r = $("#id_id").val();
            if (id) {
                $.ajax({
                    url:quotation,
                    method: "DELETE",
                    data: {
                        'sall_bill_d': id_sales_b_r
                    },
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("X-CSRFToken", csrf);
                    },
                    
                    success: function(data) {

                        if (data.status == 1) {
                            reset_form_all('#quotation_form');
                            alert_message(data.message.message, data.message.class);
                            // $('#DataTables_Table_0').DataTable().ajax.reload();
                            table.ajax.reload();
                            // $("#submit-button").text("save");
                        } else {
                            // $("#submit-button").text("update");

                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        alert('An error occurred... Look at the console (F12 or Ctrl+Shift+I, Console tab) for more information!');

                        $('#result').html('<p>status code: ' + jqXHR.status + '</p><p>errorThrown: ' + errorThrown + '</p><p>jqXHR.responseText:</p><div>' + jqXHR.responseText + '</div>');
                    },

                });
            } else {
                alert("Error");
            }



        }



    });
});




// $(document).ready(function() {

//   
// }); 

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

function deleteburdenFormset(btn, prefix) {
    var formCount = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
    if (formCount > 1) {
        // Delete the item/form
        $(btn).parents('.burden').remove();
        var forms = $('.burden'); // Get all the forms
        // Update the total number of forms (1 less than before)
        $('#id_' + prefix + '-TOTAL_FORMS').val(forms.length);
        var i = 0;
        // Go through the forms and set their indices, names and IDs
        for (formCount = forms.length; i < formCount; i++) {
            $(forms.get(i)).find('.formset-field').each(function() {
                $(forms.get(i)).find('.td_id_burden').text(i + 1);
                updateElementFormset(this, prefix, i);
            });
        }
        get_total();
    } // End if
    edit_form_burden();

    return false;
}
$("#btn_new").on("click", function() {
    get_max_id("Cash");
});

function get_max_id(type) {
    $.ajax({
        url: max_url,
        data: { 'type': type },
        method: 'GET',
        success: function(data) {
            $('input[name="number"]').val(data.message);
        },
        error: function() {

        },
    });
}
// function get_discount_info(item_id, unit_id, discount, discount_pre_item) {
//     $.ajax({
//         url: get_discount_url,
//         data: {
//             'item_id': item_id,
//             'unit_id': unit_id,
//         },
//         method: 'GET',

//         success: function (data) {
//             if (data.data[0]) {
//                 let total = parseFloat(discount_pre_item.parent().siblings('.name_total').val());
//                 if (data.data[0].the_value) {
//                     let exchange_rate = parseFloat($('#id_exchange_rate').val());
//                     let val = parseFloat(data.data[0].the_value * data.data[0].currency__exchange_rate);
//                     if (!isNaN(exchange_rate)) {
//                         val = val / exchange_rate;
//                     }
//                     discount.val(val);
//                     discount_pre_item.val(parseInt((100 * val) / total));
//                 }
//                 if (data.data[0].ratio_amount) {
//                     let val = parseInt(data.data[0].ratio_amount);
//                     discount_pre_item.val(val);
//                     $(discount).val(parseFloat((val * total) / 100));
//                 }
//             }

//         },
//         error: function () {

//         },
//     });
// }
function get_advanced_option_sales() {

    $.ajax({
        url: advanced_option_url,
        method: 'GET',
        success: function(data) {
            if (data.status == 1) {
                if (data.data.statment) {
                    $('textarea[name="statement"]').attr('required', 'required');
                }

                if (data.data.reference) {
                    $('input[name="reference"]').attr('required', 'required');
                }
                if (data.data.mult_stor) {
                    if ($('#id_store').length > 0 || !($('.name_store').length > 0)) {
                        if ($('#id_store').length > 0) {
                            $('#id_store').parent().parent().remove();
                        } else {
                            //    window.location.reload();
                        }
                    }
                }

                if (!data.data.dorp_item_using_barcode) {
                    if ($('#id_barcode_number').length > 0) {
                        if ($('#id_barcode_number').length > 0) {
                            $('#id_barcode_number').parent().parent().remove();
                        } else {
                            //    window.location.reload();
                        }
                    }
                }



                if (data.data.discount) {
                    if (data.data.discount == 'all') {
                        if (!($('.name_discount_pre_item').length > 0) || !($('.name_discount').length > 0)) {
                            // window.location.reload();
                        }
                    } else {
                        if (!($(`.name_${data.data.discount}`).length > 0)) {
                            // window.location.reload();
                        }
                    }
                }
            } else {
                alert_message(data.message.message, data.message.class);

            }
        },
        error: function() {

        },
    });
}

function get_total_Burdens() {
    let burdens = 0;
    let prefix_Burdens = String($('.add_form_burden').attr('id'));
    let total = parseFloat($('#total').val());
    $('.Burdens_name_value').each(function(k, v) {
        let input = $(this).attr('readonly');
        if (input == 'readonly') {
            let ratio = parseFloat($(`#id_${prefix_Burdens}-${k}-ratio`).val());
            if (isNaN(ratio)) {
                ratio = 0;
            }
            let v = parseFloat((ratio * total) / 100);
            if (isNaN(v)) {
                v = 0;
            }
            $(`#id_${prefix_Burdens}-${k}-value`).val(v);
            $(`#id_${prefix_Burdens}-${k}-total`).val(v);

        } else {
            let value = parseFloat($(`#id_${prefix_Burdens}-${k}-value`).val());
            if (isNaN(value)) {
                value = 0;
            }
            let r = parseFloat((value * 100) / total).toFixed(0);
            $(`#id_${prefix_Burdens}-${k}-ratio`).val(r);
            $(`#id_${prefix_Burdens}-${k}-total`).val(value);
        }
        let val = parseFloat($(this).val());
        let type_ = $(`#id_${prefix_Burdens}-${k}-type_`).val();

        if (isNaN(val)) {
            val = 0;
        }
        if (type_ == 1) {
            burdens = burdens + val;
        }
        // if(type_==2){
        //     burdens=burdens-val;
        // }



    });
    $(`input[name="total_burden"]`).val(burdens);
}

$(document).on('change', ".items_val", function() {
    /* founction Fetch the units related to the item
    The initial cost of an item
    Show an indication that the item has a termination date or not
    */
    var id = $(this).attr('id');
    var x = id.split('-');
    let prefix = String($(".add-form-row").attr('id'));
    $('#id_' + prefix + '-' + x[1] + '-initial_cost').html("");
    // get the url of the `load_cities` view
    var items = $(this).val(); // get the selected country ID from
    $.ajax({

        method: "post", // initialize an AJAX request
        url: load_openning_store_unit_cost,

        data: {
            'items': items,
            'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
        },
        success: function(data) {
            $('#id_' + prefix + '-' + x[1] + '-unit').html('');
            $('#id_' + prefix + '-' + x[1] + '-initial_cost').val("");
            if (data.status == 1) {
                let data_unit = data.data_unit;
                let option = `<option vaule=""  data-package="">-----</option>`;
                $.each(data_unit, function(i, j) {
                    option += `<option  data-package="${j.itemunit__package}" value="${j.id}">${j.name_ar}</option>`;
                });
                $('#id_' + prefix + '-' + x[1] + '-unit').append(option)
                    // `data` is the return of the `load_cities` view function
            }
        }
    });

    $.ajax({
        method: "post", // initialize an AJAX request
        url: valid_item_expire_date_income,

        data: {
            'items': items,
            'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
        },
        success: function(data, status) {
            var option;
            $.each(data, function(index, itemData) {

                if (data.use_expir_date == true) {


                    $('#id_' + prefix + '-' + x[1] + '-expire_date').attr('required', 'required');
                    $('#id_' + prefix + '-' + x[1] + '-expire_date').val('').attr('readonly', false);

                } else {

                    // $('#id_' + prefix + '-' + x[1] + '-expire_date').attr('style', 'color:black;borderColor:red;cursor:pointer');
                    $('#id_' + prefix + '-' + x[1] + '-expire_date').val('').attr('readonly', 'readonly');
                    $('#id_' + prefix + '-' + x[1] + '-expire_date').removeAttr('required');
                }

            });

        }
    });
});

function check_item_fund() {
    let status = [];
    let fu = [];
    let prefix = String($('.add_form').attr('id'));
    let sta = true;
    let store_id = $('#id_store');


    $('.name_item').each(function(i, j) {

        let id_row = $(this).attr('id');
        if (id_row != undefined) {
            id_row = id_row.split('-');
            let row = {
                'data': '',
                'id': id_row[1],
            }
            let item = $(`#id_${prefix}-${id_row[1]}-item`).val();
            let unit = $(`#id_${prefix}-${id_row[1]}-unit`).val();

            let store = $(`#id_${prefix}-${id_row[1]}-store`).val();
            if (store_id.length > 0) {
                store = store_id.val();
            }
            let data = [item, store, unit];

            if (status.length > 0) {
                $.each(status, function(i, j) {
                    if (data[0] == j.data[0] && data[1] == j.data[1] && data[2] == j.data[2]) {
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
        // $('.item').removeAttr('style');
        $.each(fu, function(index, value) {
            $(`#id_${prefix}-${value}-item`).parents('.item').attr('style', 'outline:red auto;');

        });
    } else {
        // $('.item').removeAttr('style');

    }
    return sta;

}



function check_burden_fund() {
    let status = [];
    let fu = [];
    let prefix = String($('.add_form_burden').attr('id'));
    let sta = true;



    $('.Burdens_name_burden_type_sales').each(function(i, j) {
        let id_row = $(this).attr('id');
        if (id_row != undefined) {
            id_row = id_row.split('-');
            let row = {
                'data': '',
                'id': id_row[1],
            }
            let item = $(`#id_${prefix}-${id_row[1]}-burden_type_sales`).val();

            let data = [item];

            if (status.length > 0) {
                $.each(status, function(i, j) {
                    if (data[0] == j.data[0]) {
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
        // $('.burden').removeAttr('style');
        $.each(fu, function(index, value) {
            $(`#id_${prefix}-${value}-burden_type_sales`).parents('.burden').attr('style', 'outline:red auto;');

        });
    } else {
        // $('.burden').removeAttr('style');

    }
    return sta;

}

function change_currency(exchange_rate) {

    let prefix = String($('.add_form').attr('id'));
    if (isNaN(exchange_rate)) {
        exchange_rate = 1;
    }
    $('.name_price').each(function(i, j) {
        let id_row = $(this).attr('id');
        id_row = id_row.split('-');

        let price = parseFloat($(`#id_${prefix}-${id_row[1]}-price`).val());
        let max = parseFloat($(`#id_${prefix}-${id_row[1]}-price`).attr('max'));
        let min = parseFloat($(`#id_${prefix}-${id_row[1]}-price`).attr('min'));
        if (!isNaN(price)) {
            $(`#id_${prefix}-${id_row[1]}-price`).val(parseFloat(price / exchange_rate).toFixed(0));
            parseFloat($(`#id_${prefix}-${id_row[1]}-price`).attr('min', min));
            parseFloat($(`#id_${prefix}-${id_row[1]}-price`).attr('max', max));
        }
    });
}

function edit_form_burden() {
    let prefix = String($('.add_form_burden').attr('id'));
    var formCount = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
    if (formCount == 1) {
        var row = $(".burden:first");
        (row).find('.formset-field').each(function() {
            $(this).removeAttr('required');
        });
    } else if (formCount == 2) {
        var row = $(".burden:first");
        (row).find('.formset-field').each(function() {
            $(this).removeAttr('required');
            $(this).attr('required', 'required');
        });
    }
}

function edit_form_item() {
    $(".burden:not(:first)").remove();
    $(".burden:first").find('.formset-field').each(function() {
        $(this).val('');
    });
    $(".item:not(:first)").remove();
    $(".item:first").find('.formset-field').each(function() {
        $(this).val('');
    });

}

function clear_item(id_row) {
    // alert('d')
    let prefix = String($('.add_form').attr('id'));
    id_row = id_row.split('-');
    let unit = $(`#id_${prefix}-${id_row[1]}-unit`);
    let expiry_date = $(`#id_${prefix}-${id_row[1]}-expiry_date`);
    let price = $(`#id_${prefix}-${id_row[1]}-price`);
    let discount_pre_item = $(`#id_${prefix}-${id_row[1]}-discount_pre_item`);
    let discount = $(`#id_${prefix}-${id_row[1]}-discount`);
    let total = $(`#id_${prefix}-${id_row[1]}-total`);
    let quantity = $(`#id_${prefix}-${id_row[1]}-quantity`);
    let quantity_available = $(`#id_${prefix}-${id_row[1]}-quantity_available`);
    unit.parents('tr').find('span[class="text-danger"]').remove();
    // unit.parents('tr').find('input,select').removeAttr('style');
    expiry_date.parents('tr').find('span[class="text-danger"]').remove();
    // expiry_date.parents('tr').find('input,select').removeAttr('style');
    price.attr('min', '0');
    price.attr('max', '0');
    price.val(0);
    discount_pre_item.val(0);
    total.val(0);
    discount.val(0);
    quantity.val(0);
    quantity_available.val(0);
}

function clear_item_store(id_row) {
    let prefix = String($('.add_form').attr('id'));
    id_row = id_row.split('-');
    // let unit = $(`#id_${prefix}-${id_row[1]}-unit`);
    let total = $(`#id_${prefix}-${id_row[1]}-total`);
    let quantity = $(`#id_${prefix}-${id_row[1]}-quantity`);
    let quantity_available = $(`#id_${prefix}-${id_row[1]}-quantity_available`);
    // unit.parents('tr').find('span[class="text-danger"]').remove();
    // unit.parents('tr').find('input,select').removeAttr('style');
    quantity.parent().children(`span`).remove();
    // quantity.removeAttr('style');
    total.val(0);
    quantity.val(0);
    quantity_available.val(0);
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

function check_paymant_method(val) {
    if (val == 'Check') {
        $('select[name="fund"]').parents('.parent_hidden').addClass('hidden');
        $('select[name="bank"],input[name="check_number"],input[name="due_date"],input[name="check_amount"]').parents('.parent_hidden').removeClass('hidden');
        $('select[name="bank"],input[name="check_number"],input[name="due_date"],input[name="check_amount"]').attr('required', 'required');
        $('select[name="fund"]').removeAttr('required');
        $('#id_customer_data').removeAttr('required');
    } else if (val == 'Cash') {
        $('select[name="customer_data"]').removeAttr('required');
        $('select[name="fund"]').parents('.parent_hidden').removeClass('hidden');
        $('select[name="fund"]').attr('required', 'required');
        $('select[name="bank"],input[name="check_number"],input[name="due_date"],input[name="check_amount"]').parents('.parent_hidden').addClass('hidden');
        $('select[name="bank"],input[name="check_number"],input[name="due_date"],input[name="check_amount"]').removeAttr('required');

    } else if (val == 'Cash_Check') {
        $('#id_customer_data').removeAttr('required');

        $('select[name="fund"],select[name="bank"],input[name="check_number"],input[name="due_date"],input[name="check_amount"]').parents('.parent_hidden').removeClass('hidden');
        // $('select[name="fund"],select[name="bank"],input[name="check_number"],input[name="due_date"],input[name="check_amount"]').attr('required', 'required');

    } else if (val == 'Debt') {
        $('select[name="fund"],select[name="bank"],input[name="check_number"],input[name="due_date"],input[name="check_amount"]').parents('.parent_hidden').addClass('hidden');
        $('select[name="fund"],select[name="bank"],input[name="check_number"],input[name="due_date"],input[name="check_amount"]').removeAttr('required');
        $('select[name="customer_data"]').attr('required', 'required')
    }
}

function reset_form_all(form_id_) {
    $('span[class="text-danger"]').remove();
    $('#id_fund').children('option').remove();
    $('#id_customer_data').children('option').remove();

    $(form_id_)[0].reset();
    // $('select[name="customer_data"]').children('option').remove();
    // $('#id_bank').children('option').remove();
    // $('.name_item').children('option').remove();
    // $('.name_unit').children('option').remove();
    // $('.Burdens_name_burden_type_sales').children('option').remove();
    $(`textarea`).text('');
    get_max_id($('#id_payment_method').val());
}




function get_total() {

    let prefix = String($('.add_form').attr('id'));
    let total = 0;
    let discount_items = 0;
    let burdens = 0;
    let final_total = 0;
    let total_taxes = 0;
    let discount = parseFloat($(`#discount`).val());
    let taxes = parseFloat($(`#taxes`).val());
    let discounted_price_total = 0;
    $('.name_quantity').each(function() {
        let id_row = $(this).attr('id');

        id_row = id_row.split('-');

        let price = parseFloat($(`#id_${prefix}-${id_row[1]}-price`).val());
        $(`#id_${prefix}-${id_row[1]}-price`).val(price);
        let val = parseFloat($(this).val());
        let discount_pric = parseFloat($(`#id_${prefix}-${id_row[1]}-discount`).val());
        let discount_pre_item = parseFloat($(`#id_${prefix}-${id_row[1]}-discount_pre_item`).val());

        let qty = parseFloat($(`#id_${prefix}-${id_row[1]}-quantity`).val());
        let tax_rate = parseFloat($(`#id_${prefix}-${id_row[1]}-tax_rate`).val());

        if (isNaN(price)) { price = 0; }
        if (isNaN(val)) { val = 0; }
        if (isNaN(discount_pric)) { discount_pric = 0; }
        if (isNaN(qty)) { qty = 0; }
        if (isNaN(tax_rate)) { tax_rate = 0; }
        if (isNaN(discount_pre_item)) { discount_pre_item = 0; }
        let total_pric = val * price;
        let rate = tax_rate / 100 * (total_pric);
        let rate2 = tax_rate / 100 * total_pric;

        total = total + total_pric;
        total_taxes = total_taxes + rate;
        // alert(total)
        discount_items = discount_items + (discount_pric * qty);
        $(`#id_${prefix}-${id_row[1]}-total`).val(parseFloat(total_pric + rate).toFixed(2));
        // $(`#id_${prefix}-${id_row[1]}-discounted_price`).val(discount_items);

        let tot = parseFloat(discount_pre_item) * parseFloat(total_pric + rate);
        $(`#id_${prefix}-${id_row[1]}-discounted_price`).val(parseFloat(tot / 100).toFixed(2))
        discounted_price_total = discounted_price_total + parseFloat(tot / 100);
        // $(discount2323).val(tot/ 100);
    });


    $(`#total`).val(total.toFixed(2));
    $(`#total_taxes`).val(total_taxes.toFixed(2));
    // $(`#discount`).val(discounted_price_total);
    $(`#discount_items`).val(discounted_price_total.toFixed(2));
    if (isNaN(discount)) { discount = 0; }
    if (isNaN(taxes)) { taxes = 0; }
    get_total_Burdens();
    burdens = parseFloat($(`input[name="total_burden"]`).val());
    if (isNaN(burdens)) { burdens = 0; }


    // $(".name_discount_pre_item").trigger("change");


    // final_total = parseFloat(total) - (parseFloat(discount_items) + parseFloat(discount)) + parseFloat(taxes) + parseFloat(burdens)-parseFloat(discounted_price_total);
    final_total = parseFloat(total) - (parseFloat(discount_items) + parseFloat(discount)) + parseFloat(taxes) + parseFloat(burdens) - parseFloat(discounted_price_total) + parseFloat(total_taxes);



    $(`#final_total`).val(final_total.toFixed(2));
}


function getTaxValue(id) {

    urlTax = url_get_tax_value;

    var ind = id.name.split('-');

    $.ajax({
        url: urlTax,
        data: {
            'id': id.value,
        },
        method: 'get',
        success: function(data) {

            // alert(data.data.tax_rate)
            // alert(data.data.is_disabled)


            $(`#id_SalesBill-${ind[1]}-tax_rate`).val(data.data.tax_rate);

            get_total(id)

        },
        error: function(data) {}
    });
}




function get_total_tax() {

    let prefix = String($('.add_form').attr('id'));
    let total = 0;
    let discount_items = 0;
    let burdens = 0;
    let final_total = 0;
    let total_taxes = 0;
    let discount = parseFloat($(`#discount`).val());
    let taxes = parseFloat($(`#taxes`).val());
    let discounted_price_total = 0;
    $('.name_quantity').each(function() {
        let id_row = $(this).attr('id');

        id_row = id_row.split('-');

        let price = parseFloat($(`#id_${prefix}-${id_row[1]}-price`).val());
        $(`#id_${prefix}-${id_row[1]}-price`).val(price);
        let val = parseFloat($(this).val());
        let discount_pric = parseFloat($(`#id_${prefix}-${id_row[1]}-discount`).val());
        let discount_pre_item = parseFloat($(`#id_${prefix}-${id_row[1]}-discount_pre_item`).val());

        let qty = parseFloat($(`#id_${prefix}-${id_row[1]}-quantity`).val());
        let tax_rate = parseFloat($(`#id_${prefix}-${id_row[1]}-tax_rate`).val());

        if (isNaN(price)) { price = 0; }
        if (isNaN(val)) { val = 0; }
        if (isNaN(discount_pric)) { discount_pric = 0; }
        if (isNaN(qty)) { qty = 0; }
        if (isNaN(tax_rate)) { tax_rate = 0; }
        if (isNaN(discount_pre_item)) { discount_pre_item = 0; }
        let total_pric = val * price;
        let rate = tax_rate / 100 * (total_pric);
        let rate2 = tax_rate / 100 * total_pric;

        total = total + total_pric;
        total_taxes = total_taxes + rate;
        // alert(total)
        discount_items = discount_items + (discount_pric * qty);
        $(`#id_${prefix}-${id_row[1]}-total`).val(parseFloat(total_pric + rate));
        // $(`#id_${prefix}-${id_row[1]}-discounted_price`).val(discount_items);

        let tot = parseFloat(discount_pre_item) * parseFloat(total_pric + rate);
        $(`#id_${prefix}-${id_row[1]}-discounted_price`).val(parseFloat(tot / 100))
        discounted_price_total = discounted_price_total + parseFloat(tot / 100);
        // $(discount2323).val(tot/ 100);
    });


    // $(`#total`).val(total);
    // $(`#total_taxes`).val(total_taxes);
    // // $(`#discount`).val(discounted_price_total);
    // $(`#discount_items`).val(discounted_price_total);
    // if (isNaN(discount)) { discount = 0; }
    // if (isNaN(taxes)) { taxes = 0; }
    // get_total_Burdens();
    // burdens = parseFloat($(`input[name="total_burden"]`).val());
    // if (isNaN(burdens)) { burdens = 0; }


    // // $(".name_discount_pre_item").trigger("change");


    // // final_total = parseFloat(total) - (parseFloat(discount_items) + parseFloat(discount)) + parseFloat(taxes) + parseFloat(burdens)-parseFloat(discounted_price_total);
    // final_total = parseFloat(total) - (parseFloat(discount_items) + parseFloat(discount)) + parseFloat(taxes) + parseFloat(burdens)-parseFloat(discounted_price_total)+parseFloat(total_taxes);



    // $(`#final_total`).val(final_total);
}











// function change_class_buttons() { select2.js
//     $('#submit-button').toggleClass('hidden');
//     $('.add_form').toggleClass('hidden');
//     $('.add_form_burden').toggleClass('hidden');
//     $('.delete_form_burden').toggleClass('hidden');
//     $('.delete_form').toggleClass('hidden');
//     $('#add_new').toggleClass('hidden');
// }

// $(window).load(function () {
//     $body.removeClass("loading");
// }); $body.removeClass("loading");
// });






