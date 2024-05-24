form_id = '#myform';
function reset_form_all(form_id) {
    // $(form_id).filter(':input').each(function(){
    //     //your code here
    // });

    $('select[name="group_id"]').children('option').remove();
    $('select[name="stocked_account"]').children('option').remove();
    $('#id_sales_account').children('option').remove();
    $('#id_sales_cost_account').children('option').remove();
    $('#id_sales_return_account').children('option').remove();
    $('#id_sales_cost_return_account').children('option').remove();
    $('#id_allowable_discount_account').children('option').remove();
    $('#id_revenue_frm_prev_yrs_sales_account').children('option').remove();
    $('#id_cost_effctv_sales_of_prev_yr_account').children('option').remove();
    $('#id_acquired_discount_account').children('option').remove();
    $('#id_cost_of_free_qty_sales_account').children('option').remove();
    $('#id_cost_effctv_free_qty_sales_cost_account').children('option').remove();
    $('#id_cost_of_free_qty_purchases_account').children('option').remove();

}
$(document).on('submit', form_id, function (e) {
    e.preventDefault();
    $.ajax({
        url: $(this).attr('action'),
        data: new FormData(this),
        method: 'POST',
        contentType: false,
        processData: false,
        success: function (data) {
            $('span[class="text-danger"]').remove();
            if (data.status == 1) {
                $(form_id)[0].reset();
                alert_message(data.message.message, data.message.class);
                
                $(this).children(`option`).removeAttr('selected');
                reset_form_all();
            } else if (data.status == 2) {
                $.each(data.error, function () {
                    let form = $(this)[0].form_id;
                    $(`#id_${form}-item`).parents('.item').css('outline', 'red auto');
                    alert_message($(this)[0].message, 'alert alert-danger');
                });
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
            }


        },
        error: function (data) {
            alert('check input values');

        }
    });
});
$(document).on('click', '.edit_row', function () {

    let id_row = $(this).data('id');
  
    $.ajax({
        url: $(this).data('url'),
        data: { 'id': id_row, },
        method: 'get',
        success: function (data) {
            if (data.status == 1) {
                $(`input[name="id"]`).val(id_row);
                let group_id = data.data.group_id;

                // let group_id_option = `<option selected value="${group_id.id}">${group_id.name}</option>`;
                // $('#id_group_id').append(group_id_option);

                let stocked_account = data.data.stocked_account;
                let stocked_account_optoin = `<option selected value="${stocked_account.id}">${stocked_account.name}</option>`;
                $('#id_stocked_account').append(stocked_account_optoin);

                let sales_account = data.data.sales_account;
                if (sales_account) {

                    let sales_account_optoin = `<option selected value="${sales_account.id}">${sales_account.name}</option>`;
                    $('#id_sales_account').append(sales_account_optoin);
                }

                let sales_cost_account = data.data.sales_cost_account;
                if (sales_cost_account) {
                    let sales_cost_account_optoin = `<option selected value="${sales_cost_account.id}">${sales_cost_account.name}</option>`;
                    $('#id_sales_cost_account').append(sales_cost_account_optoin);
                }
                let sales_return_account = data.data.sales_return_account;
                if (sales_return_account) {
                    let sales_return_account_optoin = `<option selected value="${sales_return_account.id}">${sales_return_account.name}</option>`;
                    $('#id_sales_return_account').append(sales_return_account_optoin);
                }

                let sales_cost_return_account = data.data.sales_cost_return_account;
                if (sales_cost_return_account) {
                    let sales_cost_return_account_optoin = `<option selected value="${sales_cost_return_account.id}">${sales_cost_return_account.name}</option>`;
                    $('#id_sales_cost_return_account').append(sales_cost_return_account_optoin);
                }

                let allowable_discount_account = data.data.allowable_discount_account;
                if (allowable_discount_account) {
                    let allowable_discount_account_optoin = `<option selected value="${allowable_discount_account.id}">${allowable_discount_account.name}</option>`;
                    $('#id_allowable_discount_account').append(allowable_discount_account_optoin);
                }

                let revenue_frm_prev_yrs_sales_account = data.data.revenue_frm_prev_yrs_sales_account;
                if (revenue_frm_prev_yrs_sales_account) {

                    let revenue_frm_prev_yrs_sales_account_optoin = `<option selected value="${revenue_frm_prev_yrs_sales_account.id}">${revenue_frm_prev_yrs_sales_account.name}</option>`;
                    $('#id_revenue_frm_prev_yrs_sales_account').append(revenue_frm_prev_yrs_sales_account_optoin);
                }

                let cost_effctv_sales_of_prev_yr_account = data.data.cost_effctv_sales_of_prev_yr_account;
                if (cost_effctv_sales_of_prev_yr_account) {

                    let cost_effctv_sales_of_prev_yr_account_optoin = `<option selected value="${cost_effctv_sales_of_prev_yr_account.id}">${cost_effctv_sales_of_prev_yr_account.name}</option>`;
                    $('#id_cost_effctv_sales_of_prev_yr_account').append(cost_effctv_sales_of_prev_yr_account_optoin);
                }

                let acquired_discount_account = data.data.acquired_discount_account;
                if (acquired_discount_account) {

                    let acquired_discount_account_optoin = `<option selected value="${acquired_discount_account.id}">${acquired_discount_account.name}</option>`;
                    $('#id_acquired_discount_account').append(acquired_discount_account_optoin);
                }

                let cost_of_free_qty_sales_account = data.data.cost_of_free_qty_sales_account;
                if (cost_of_free_qty_sales_account) {

                    let cost_of_free_qty_sales_account_optoin = `<option selected value="${cost_of_free_qty_sales_account.id}">${cost_of_free_qty_sales_account.name}</option>`;
                    $('#id_cost_of_free_qty_sales_account').append(cost_of_free_qty_sales_account_optoin);
                }

                let cost_effctv_free_qty_sales_cost_account = data.data.cost_effctv_free_qty_sales_cost_account;
                if (cost_effctv_free_qty_sales_cost_account) {

                    let cost_effctv_free_qty_sales_cost_account_optoin = `<option selected value="${cost_effctv_free_qty_sales_cost_account.id}">${cost_effctv_free_qty_sales_cost_account.name}</option>`;
                    $('#id_cost_effctv_free_qty_sales_cost_account').append(cost_effctv_free_qty_sales_cost_account_optoin);
                }


                let cost_of_free_qty_purchases_account = data.data.cost_of_free_qty_purchases_account;
                if (cost_of_free_qty_purchases_account) {

                    let cost_of_free_qty_purchases_account_optoin = `<option selected value="${cost_of_free_qty_purchases_account.id}">${cost_of_free_qty_purchases_account.name}</option>`;
                    $('#id_cost_of_free_qty_purchases_account').append(cost_of_free_qty_purchases_account_optoin);
                }





                $("#Previous_Operations_close").click()
            }
        },
        error: function (data) {
            alert('fail');
        }
    });
});

$(document).on('click', '.delete_row', function () {
    if (confirm_delete()) {
        let id_row = $(this).data('id');
        $.ajax({
            url: $(this).data('url'),
            data: {
                'id': id_row,
            },
            method: 'DELETE',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("X-CSRFToken", csrf);
            },
            success: function (data) {
                if (data.status == 1) {
                    alert_message(data.message.message, data.message.class);
                    table.ajax.reload();
                }
                else if (data.status == 2) {
                    $.each(data.error, function () {
                        let form = $(this)[0].form_id;
                        $(`#id_${form}-item`).parents('.item').css('outline', 'red auto');
                        alert_message($(this)[0].message, 'alert alert-danger');
                    });
                }
            },
            error: function (data) {
                alert('fail');
            }
        });
    }
});
$('#clear').on("click", function () {
    // $('#myform')[0].reset();
    // reset_form_all();
});
