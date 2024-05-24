//#region function tools width js.

$("#id_number_search").addClass("form-control").css({ width: "20%", margin: "auto" }).css("text-align", "center");
updateElementFormset = (el, prefix, ndx) => {
    var id_regex = new RegExp("(" + prefix + "-\\d+-)");
    var replacement = prefix + "-" + ndx + "-";
    if ($(el).attr("for"))
        $(el).attr("for", $(el).attr("for").replace(id_regex, replacement));
    if (el.id) el.id = el.id.replace(id_regex, replacement);
    if (el.name) el.name = el.name.replace(id_regex, replacement);
}

change_class_buttons = () => {
}

$(document).on('click', `#btn_new`, function() {
    $("#load_div").load(load_url_return);
    
});


$("#load_div").load(load_url_return);



deleteFormset = (btn, prefix) => {
    var formCount = parseInt($("#id_" + prefix + "-TOTAL_FORMS").val());

    if (formCount > 1) {
        // Delete the item/form
        $(btn).parents(".item").remove();
        var forms = $(".item"); // Get all the forms
        // Update the total number of forms (1 less than before)
        $("#id_" + prefix + "-TOTAL_FORMS").val(forms.length);
        var i = 0;
        // Go through the forms and set their indices, names and IDs
        for (formCount = forms.length; i < formCount; i++) {
            $(forms.get(i))
                .find(".formset-field")
                .each(function() {
                    $(forms.get(i))
                        .find(".td_id")
                        .text(i + 1);
                    updateElementFormset(this, prefix, i);
                });
        }
    } // End if

    return false;
}
deleteburdenFormset = (btn, prefix) => {
    var formCount = parseInt($("#id_" + prefix + "-TOTAL_FORMS").val());
    if (formCount > 1) {
        // Delete the item/form
        $(btn).parents(".burden").remove();
        var forms = $(".burden"); // Get all the forms
        // Update the total number of forms (1 less than before)
        $("#id_" + prefix + "-TOTAL_FORMS").val(forms.length);
        var i = 0;
        // Go through the forms and set their indices, names and IDs
        for (formCount = forms.length; i < formCount; i++) {
            $(forms.get(i))
                .find(".formset-field")
                .each(function() {
                    $(forms.get(i))
                        .find(".td_id_burden")
                        .text(i + 1);
                    updateElementFormset(this, prefix, i);
                });
        }
        get_total();
    } // End if
    edit_form_burden();

    return false;
}

get_max_id = (type) => {
        $.ajax({
            url: max_url,
            data: { type: type },
            method: "GET",

            success: function(data) {
                $('input[name="number"]').val(data.message);
            },
            error: function() {},
        });
    }
    // get_discount_info=(item_id, unit_id, discount, discount_pre_item) =>{
    //   $.ajax({
    //     url: get_discount_url,
    //     data: {
    //       item_id: item_id,
    //       unit_id: unit_id,
    //     },
    //     method: "GET",

//     success: function (data) {
//       if (data.data[0]) {
//         if (data.data[0].the_value) {
//           let exchange_rate = parseFloat($("#id_exchange_rate").val());
//           let val = parseFloat(
//             data.data[0].the_value * data.data[0].currency__exchange_rate
//           );
//           // let total=discount_pre_item.parent().s
//           if (!isNaN(exchange_rate)) {
//             val = val / exchange_rate;
//           }
//           discount.val(val);
//           // discount_pre_item.val(parseInt((100*val)/total));
//         }
//         if (data.data[0].ratio_amount) {
//           let val = parseInt(data.data[0].ratio_amount);
//           discount_pre_item.val(val);
//         }
//       }
//     },
//     error: function () { },
//   });
// }
get_advanced_option_sales = () => {
    $.ajax({
        url: advanced_option_url,
        method: "GET",
        success: function(data) {
            if (data.status == 1) {
                if (data.data.statment) {
                    $('textarea[name="statement"]').attr("required", "required");
                }

                if (data.data.reference) {
                    $('input[name="reference"]').attr("required", "required");
                }
                if (data.data.mult_stor) {
                    if ($("#id_store").length > 0 || !($(".name_store").length > 0)) {
                        if ($("#id_store").length > 0) {
                            $("#id_store").parent().parent().remove();
                        } else {
                            //    window.location.reload();
                        }
                    }
                }
                if (data.data.center_type == "multiple") {
                    if (
                        $("#id_cost_center").length > 0 ||
                        !($(".name_cost_center").length > 0)
                    ) {
                        if ($("#id_cost_center").length > 0) {
                            $("#id_cost_center").parent().parent().remove();
                        } else {
                            // window.location.reload();
                        }
                    }
                } else if (data.data.center_type == "single") {
                    if (!($("#id_cost_center").length > 0)) {
                        // window.location.reload();
                    }
                } else {
                    $("#id_cost_center").parent().parent().remove();
                }
                if (data.data.discount) {
                    if (data.data.discount == "all") {
                        if (!($(".name_discount_pre_item").length > 0) ||
                            !($(".name_discount").length > 0)
                        ) {
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
        error: function() {},
    });
}
get_total_Burdens = () => {
    let burdens = 0;
    let prefix_Burdens = String($(".add_form_burden").attr("id"));
    let total = parseFloat($("#total").val());
    $(".Burdens_name_value").each(function(k, v) {
        let input = $(this).attr("readonly");
        if (input == "readonly") {
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
            let r = parseFloat((value * 100) / total).toFixed(2);
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
get_total = () => {

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
check_item_fund = () => {
    let status = [],
        fu = [],
        prefix = String($(".add_form").attr("id")),
        sta = true,
        store_id = $("#id_store");

    $(".name_item").each(function(i, j) {
        let id_row = $(this).attr("id");
        if (id_row != undefined) {
            id_row = id_row.split("-");
            let row = {
                data: "",
                id: id_row[1],
            };
            let item = $(`#id_${prefix}-${id_row[1]}-item`).val();
            let store = $(`#id_${prefix}-${id_row[1]}-store`).val();
            var quantity = $(`#id_${prefix}-${id_row[1]}-quantity`).val();
            var quantity_available = $(`#id_${prefix}-${id_row[1]}-quantity_available`).val();
            if (parseInt(quantity) > parseInt(quantity_available)) {
                fu.push(id_row[1])
            }
            if (store_id.length > 0) {
                store = store_id.val();
            }
            let data = [item, store];

            if (status.length > 0) {
                $.each(status, (i, j) => {
                    if (data[0] == j.data[0] && data[1] == j.data[1]) {
                        fu.push(id_row[1]);
                        fu.push(j.id);
                    } else {
                        row["data"] = data;
                        status.push(row);
                    }
                });
            } else {
                row["data"] = data;
                status.push(row);
            }
        }
    });

    if (fu.length > 0) {
        sta = false;
        $(".item").removeAttr("style");
        $.each(fu, function(index, value) {
            $(`#id_${prefix}-${value}-item`)
                .parents(".item")
                .attr("style", "outline:red auto;");
        });
    } else {
        $(".item").removeAttr("style");
    }
    return sta;
}
check_burden_fund = () => {
    let status = [];
    let fu = [];
    let prefix = String($(".add_form_burden").attr("id"));
    let sta = true;

    $(".Burdens_name_burden_type_sales").each(function(i, j) {
        let id_row = $(this).attr("id");
        if (id_row != undefined) {
            id_row = id_row.split("-");
            let row = {
                data: "",
                id: id_row[1],
            };
            let item = $(`#id_${prefix}-${id_row[1]}-burden_type_sales`).val();

            let data = [item];

            if (status.length > 0) {
                $.each(status, function(i, j) {
                    if (data[0] == j.data[0]) {
                        fu.push(id_row[1]);
                        fu.push(j.id);
                    } else {
                        row["data"] = data;
                        status.push(row);
                    }
                });
            } else {
                row["data"] = data;
                status.push(row);
            }
        }
    });

    if (fu.length > 0) {
        sta = false;
        $(".burden").removeAttr("style");
        $.each(fu, function(index, value) {
            $(`#id_${prefix}-${value}-burden_type_sales`)
                .parents(".burden")
                .attr("style", "outline:red auto;");
        });
    } else {
        $(".burden").removeAttr("style");
    }
    return sta;
}

change_currency = (exchange_rate) => {
    let prefix = String($(".add_form").attr("id"));
    if (isNaN(exchange_rate)) {
        exchange_rate = 1;
    }
    $(".name_price").each(function(i, j) {
        let id_row = $(this).attr("id");

        id_row = id_row.split("-");

        let price = parseFloat($(`#id_${prefix}-${id_row[1]}-price`).val());
        let max = parseFloat($(`#id_${prefix}-${id_row[1]}-price`).attr("max"));
        let min = parseFloat($(`#id_${prefix}-${id_row[1]}-price`).attr("min"));

        if (!isNaN(price)) {
            $(`#id_${prefix}-${id_row[1]}-price`).val(
                parseFloat(price / exchange_rate).toFixed(2)
            );
            parseFloat($(`#id_${prefix}-${id_row[1]}-price`).attr("min", min));
            parseFloat($(`#id_${prefix}-${id_row[1]}-price`).attr("max", max));
        }
    });
}

edit_form_burden = () => {
    let prefix = String($(".add_form_burden").attr("id"));
    var formCount = parseInt($("#id_" + prefix + "-TOTAL_FORMS").val());
    if (formCount == 1) {
        var row = $(".burden:first");
        row.find(".formset-field").each(() => {
            $(this).removeAttr("required");
        });
    } else if (formCount == 2) {
        var row = $(".burden:first");
        row.find(".formset-field").each(() => {
            $(this).removeAttr("required");
            $(this).attr("required", "required");
        });
    }
}
clear_item = (id_row) => {
    let prefix = String($(".add_form").attr("id"));
    id_row = id_row.split("-");
    let unit = $(`#id_${prefix}-${id_row[1]}-unit`);
    let price = $(`#id_${prefix}-${id_row[1]}-price`);
    let discount_pre_item = $(`#id_${prefix}-${id_row[1]}-discount_pre_item`);
    let discount = $(`#id_${prefix}-${id_row[1]}-discount`);
    let total = $(`#id_${prefix}-${id_row[1]}-total`);
    let quantity = $(`#id_${prefix}-${id_row[1]}-quantity`);
    let quantity_available = $(`#id_${prefix}-${id_row[1]}-quantity_available`);
    unit.parents("tr").find('span[class="text-danger"]').remove();
    unit.parents("tr").find("input,select").removeAttr("style");
    price.attr("min", "0");
    price.attr("max", "0");
    price.val(0);
    discount_pre_item.val(0);
    total.val(0);
    discount.val(0);
    quantity.val(0);
    quantity_available.val(0);
}

clear_item_store = (id_row) => {
    let prefix = String($(".add_form").attr("id"));
    id_row = id_row.split("-");
    let unit = $(`#id_${prefix}-${id_row[1]}-unit`);
    let total = $(`#id_${prefix}-${id_row[1]}-total`);
    let quantity = $(`#id_${prefix}-${id_row[1]}-quantity`);
    let quantity_available = $(`#id_${prefix}-${id_row[1]}-quantity_available`);
    unit.parents("tr").find('span[class="text-danger"]').remove();
    unit.parents("tr").find("input,select").removeAttr("style");

    total.val(0);
    quantity.val(0);
    quantity_available.val(0);
}

rest_all_formset = () => {
    $(".item").each(function() {
        $(this)
            .find(".formset-field")
            .each(function() {
                if ($(this).attr("style") == "border:1px red solid;") {
                    $(this).removeAttr("style");
                }
                if ($(this).attr("type") == "number") {
                    $(this).val(0);
                } else {
                    $(this).val("");
                }
                $(this).children("option").remove();
                $(this).parent().children('span[class="text-danger"]').remove();
            });
    });
}

change_mathhod = () => {
    let val = $("#id_payment_method").val();
    $("#id_customer_data").removeAttr("required");
    if (val == "Check") {
        $('select[name="fund"],input[name="check_amount"]')
            .parents(".parent_hidden")
            .addClass("hidden");
        $('select[name="fund"]').removeClass("hidden");
        $('select[name="bank"],input[name="check_number"],input[name="due_date"]')
            .parents(".parent_hidden")
            .removeClass("hidden");
        $(
            'select[name="bank"],input[name="check_number"],input[name="due_date"]'
        ).attr("required", "required");
        $('input[name="check_amount"]').removeAttr("required");
        $("#id_customer_data").removeAttr("required");
    } else if (val == "Cash") {
        $("#id_customer_data").removeAttr("required");

        $('select[name="fund"]').parents(".parent_hidden").removeClass("hidden");
        $('select[name="fund"]').attr("required", "required");
        $(
                'select[name="bank"],input[name="check_number"],input[name="due_date"],input[name="check_amount"]'
            )
            .parents(".parent_hidden")
            .addClass("hidden");
        $(
            'select[name="bank"],input[name="check_number"],input[name="due_date"],input[name="check_amount"]'
        ).removeAttr("required");
    } else if (val == "Cash_Check") {
        $("#id_customer_data").removeAttr("required");

        $(
                'select[name="fund"],select[name="bank"],input[name="check_number"],input[name="due_date"],input[name="check_amount"]'
            )
            .parents(".parent_hidden")
            .removeClass("hidden");
        $(
            'select[name="fund"],select[name="bank"],input[name="check_number"],input[name="due_date"],input[name="check_amount"]'
        ).attr("required", "required");
    } else if (val == "Debt") {
        $(
                'select[name="fund"],select[name="bank"],input[name="check_number"],input[name="due_date"],input[name="check_amount"]'
            )
            .parents(".parent_hidden")
            .addClass("hidden");
        $(
            'select[name="fund"],select[name="bank"],input[name="check_number"],input[name="due_date"],input[name="check_amount"]'
        ).removeAttr("required");
        $('select[name="customer_data"]').attr("required", "required");
    }
};


clearAllpage = () => {
    // Collect all the ellipses on the page
    createOptions("id_customer_data", '', '', '', '');
    createOptions("id_fund", '', '', '', '');

    $("#id_currency").val($("#id_currency option:first").val());
    $("#id_store").val($("#id_store option:first").val());
    $("#id_cost_center").val($("#id_cost_center option:first").val());
    $("#id_date_bill").val("");
    rest_all_formset();
    $('#sales_bill_form')[0].reset();
    $("#submit_button_delete").hide();
    $("#tableDetils>tbody").empty();

    get_total();

}


//use function input data in select => options 
createOptions = (sendId, id, number, name_ar, name_en) => {
    'use structs';

    if (!number) {
        number =
            sem = "";
    } else {
        sem = "-"
    }
    if (!name_en) {
        name_en =
            slash = "";
    } else {
        slash = "/"
    }
    let coustomer_Show = (`<option selected value="${id}">${number} ${sem} ${name_ar} ${slash}  ${name_en}</option>`)
    $("#" + sendId).append(coustomer_Show);

}

//#endregion

$(document).ready(function() {

    $("#load_div").load(load_url_return);
    get_max_id($("#id_payment_method").val());

    setTimeout(function() {
        get_advanced_option_sales();
        edit_form_burden();
    }, 1000);
    $(document).on("click", `.delete_form`, function() {

        deleteFormset($(this), String($(this).attr("id")));
        get_total();
    });

    $(document).on("click", `.delete_form_burden`, function() {
        deleteburdenFormset($(this), String($(this).attr("id")));
    });

    // $(document).on("click", ".add_form_burden",  function()   {
    //   let prefix = String($(this).attr("id"));
    //   var formCount = parseInt($("#id_" + prefix + "-TOTAL_FORMS").val());
    //   var row = $(".burden:last").clone(false).get(0);
    //   let tr = `<select name="${prefix}-${formCount}-burden_type_sales" data-row="class_row" class="formset-field form-control Burdens_name_burden_type_sales select2-hidden-accessible" id="id_${prefix}-${formCount}-burden_type_sales" data-autocomplete-light-language="en" data-autocomplete-light-url="${burden_url}" data-autocomplete-light-function="select2" data-select2-id="id_${prefix}-${
    //     formCount + 1
    //     }-burden_type_sales" tabindex="-1" aria-hidden="true">
    //          </select>`;
    //   $(row).find(".td_two_burden").html(tr);
    //   $(row).find(".td_two").attr("data-select2-id", formCount);
    //   $(`#id_${prefix}-${formCount}-burden_type_sales`).css("outline", "");
    //   $(row)
    //     .find(".td_id_burden")
    //     .text(formCount + 1);
    //   $("span[cass='text-danger']", row).remove();
    //   $(row).children().removeClass("error");
    //   $(row)
    //     .find(".formset-field")
    //     .each( () => {
    //       updateElementFormset(this, prefix, formCount);
    //       $(this).val("");
    //       $(this).removeAttr("value");
    //       $(this).attr("required", "required");
    //     });
    //   $(row)
    //     .find(".td_first_burden")
    //     .children("input")
    //     .attr("readonly", "readonly");
    //   $(row)
    //     .find(".delete_form_burden")
    //     .click(function () {
    //       return deleteburdenFormset(this, prefix);
    //     });
    //   $(".tbody_tb_burden").append(row);
    //   $("#id_" + prefix + "-TOTAL_FORMS").val(formCount + 1);
    //   edit_form_burden();
    // });

    $(document).on("click", ".add_form", function() {
        let prefix = String($(this).attr("id"));
        var formCount = parseInt($("#id_" + prefix + "-TOTAL_FORMS").val());
        var row = $(".item:last").clone(false).get(0);
        let tr = `<select name="${prefix}-${formCount}-item" data-row="class_row" class="formset-field form-control name_item select2-hidden-accessible" id="id_${prefix}-${formCount}-item" data-autocomplete-light-language="en" data-autocomplete-light-url="${item_url}" data-autocomplete-light-function="select2" data-select2-id="id_${prefix}-${formCount}-item" tabindex="-1" aria-hidden="true">
           </select><span class="select2 select2-container select2-container--default select2-container--below select2-container--focus" dir="ltr" data-select2-id="${formCount}" style="width: 183px;"></span>`;
        $(row).find(".td_two").html(tr);
        $(row).find(".td_two").attr("data-select2-id", formCount);
        $(`#id_${prefix}-${formCount}-item`).css("outline", "");
        $(row)
            .find(".td_id")
            .text(formCount + 1);
        $("span[cass='text-danger']", row).remove();
        $(row).children().removeClass("error");
        $(row)
            .find(".formset-field")
            .each(function() {
                updateElementFormset(this, prefix, formCount);
                $(this).val("");
                $(this).removeAttr("value");
                $(this).removeAttr("disabled");
            });
        $(row).find(".td_first").children("input").attr("readonly", "readonly");
        $(".tbody_tb").append(row);
        $(row)
            .find(".delete_form")
            .click(function() {
                return deleteFormset(this, prefix);
            });
        $("#id_" + prefix + "-TOTAL_FORMS").val(formCount + 1);
    });

    $("#id_payment_method").on('change', function() {
        let val = $("#id_payment_method").val();
        get_max_id(val);
        change_mathhod();

    });

    $(document).on("change", "select[class*=name_store]", function() {
        let id = $(this).val();
        let prefix = String($(".add_form").attr("id"));
        let id_row = $(this).attr("id");
        clear_item_store(id_row);
        id_row = id_row.split("-");
        let item = $(`#id_${prefix}-${id_row[1]}-item`).val();
        if (id && item) {
            $.ajax({
                url: get_storeqty_info,
                data: {
                    id: id,
                    item_id: item,
                },
                method: "GET",
                success: function(data) {
                    let qty = parseFloat(data.data.qty);
                    let package = parseFloat(
                        $(`#id_${prefix}-${id_row[1]}-unit`)
                        .children("option:selected")
                        .data("package")
                    );
                    if (!isNaN(package)) {
                        $(`#id_${prefix}-${id_row[1]}-quantity_available`).val(
                            parseFloat(qty / package).toFixed(2)
                        );
                    } else {
                        $(`#id_${prefix}-${id_row[1]}-quantity_available`).val(qty);
                    }
                },
                error: function() {},
            });
        }
    });

    $(document).on("change", "input[class*=Burdens_name_value]", function() {
        let val = $(this).val();
        let prefix = String($(".add_form_burden").attr("id"));
        let id_row = $(this).attr("id");
        id_row = id_row.split("-");
        let total_burden = $(`#id_${prefix}-${id_row[1]}-total`);
        if (isNaN(val)) {
            val = 0;
        }
        let total = parseFloat($("#total").val());
        if (isNaN(total)) {
            total = 0;
        }
        let final_total = (val * 100) / total;
        $(`#id_${prefix}-${id_row[1]}-ratio`).val(final_total);
        $(total_burden).val(val);
        get_total();
    });

    $(document).on("change", "input[class*=Burdens_name_ratio]", function() {
        let val = $(this).val();
        let prefix = String($(".add_form_burden").attr("id"));
        let id_row = $(this).attr("id");
        id_row = id_row.split("-");
        let value = $(`#id_${prefix}-${id_row[1]}-value`);
        let total_burden = $(`#id_${prefix}-${id_row[1]}-total`);
        if (isNaN(val)) {
            val = 0;
        }
        let total = parseFloat($("#total").val());
        if (isNaN(total)) {
            total = 0;
        }
        let final_total = (val * total) / 100;
        $(value).val(final_total);
        $(total_burden).val(final_total);
        get_total();
    });

    $(document).on("change", "select[class*=name_unit]", function() {
        let id = $(this).val();
        let prefix = String($(".add_form").attr("id"));
        let id_row = $(this).attr("id");
        id_row = id_row.split("-");

        let price = $(`#id_${prefix}-${id_row[1]}-price`);
        let item = $(`#id_${prefix}-${id_row[1]}-item`).val();
        let store_id = $("#id_store");
        let store = "";
        if (store_id.length > 0) {
            if (store_id.val() > 0) {
                store = store_id.val();
            } else {
                // alert(select_stor_msg);
                $(this).children("option:selected").remove();
            }
        } else {
            store = $(`#id_${prefix}-${id_row[1]}-store`).val();
        }
        if (id && item && store) {
            $.ajax({
                url: get_item_details,
                data: {
                    id: store,
                    item_id: item,
                },
                method: "GET",
                success: function(data) {
                    let qty = parseFloat(data.data.qty);
                    let package = parseFloat(
                        $(`#id_${prefix}-${id_row[1]}-unit`)
                        .children("option:selected")
                        .data("package")
                    );
                    if (!isNaN(package)) {
                        $(`#id_${prefix}-${id_row[1]}-quantity_available`).val(
                            parseFloat(qty / package).toFixed(2)
                        );
                    } else {
                        $(`#id_${prefix}-${id_row[1]}-quantity_available`).val(qty);
                    }

                    let data_price = data.data_price;
                    let min_price = 0;
                    let max_price = 0;
                    if (data_price[0]) {
                        min_price =
                            parseFloat(data_price[0].min_price) *
                            parseFloat(data_price[0].currency__exchange_rate);
                        max_price = max_price =
                            parseFloat(data_price[0].max_price) *
                            parseFloat(data_price[0].currency__exchange_rate);
                        data_price =
                            parseFloat(data_price[0].price) *
                            parseFloat(data_price[0].currency__exchange_rate);
                    } else {
                        data_price = 0;
                    }
                    let exchange_rate = parseFloat($("#id_exchange_rate").val());

                    if (!isNaN(exchange_rate)) {
                        price_val = data_price / exchange_rate;
                        min_price_val = min_price / exchange_rate;
                        max_price_val = max_price / exchange_rate;
                    } else {
                        price_val = data_price;
                        min_price_val = min_price;
                        max_price_val = max_price;
                    }

                    if (!isNaN(package)) {
                        price_val = price_val * package;
                        min_price_val = min_price_val * package;
                        max_price_val = max_price_val * package;
                    } else {
                        price_val = price_val;
                        min_price_val = min_price_val;
                        max_price_val = max_price_val;
                    }
                    $(price).val(price_val);
                    $(price).attr("min", min_price_val);
                    $(price).attr("max", max_price_val);
                    let discount = $(`#id_${prefix}-${id_row[1]}-discount`);
                    let discount_pre_item = $(
                        `#id_${prefix}-${id_row[1]}-discount_pre_item`
                    );
                    // get_discount_info(item, id, discount, discount_pre_item);
                },
                error: function() {},
            });
            get_total();
        }
        setTimeout(() => {
            $(`#id_${prefix}-${id_row[1]}-quantity`).trigger("click");
        }, 100);
    });

    $(document).on("change", ".name_discount", function() {
        let id = parseFloat($(this).val());
        let prefix = String($(".add_form").attr("id"));
        let id_row = $(this).attr("id");
        id_row = id_row.split("-");
        let discount_pre_item = $(`#id_${prefix}-${id_row[1]}-discount_pre_item`);
        let total = $(`#id_${prefix}-${id_row[1]}-total`).val();
        discount_pre_item.parent().children(`span`).remove();
        discount_pre_item.removeAttr("style");
        if (id > parseFloat(total)) {
            $(this)
                .parent()
                .append(`<span class="text-danger">-${discount_enter} </span>`);
            $(this).attr("style", "border:1px red solid;");
        } else {
            $(this).parent().children(`span`).remove();
            $(this).removeAttr("style");
            $(discount_pre_item).val(parseInt((100 * id) / total));
        }
    });

    $(document).on("change", "input[class*=name_discount_pre_item]", () => {
        let id = $(this).val();
        let prefix = String($(".add_form").attr("id"));
        let id_row = $(this).attr("id");
        id_row = id_row.split("-");
        let discount = $(`#id_${prefix}-${id_row[1]}-discount`);
        let total = $(`#id_${prefix}-${id_row[1]}-total`).val();
        discount.parent().children(`span`).remove();
        discount.removeAttr("style");
        if (id > 100) {
            $(this)
                .parent()
                .append(`<span class="text-danger">-${discount_enter} </span>`);
            $(this).attr("style", "border:1px red solid;");
        } else {
            $(this).parent().children(`span`).remove();
            $(this).removeAttr("style");
            $(discount).val(parseFloat((id * total) / 100));
        }
    });

    $(document).on("change click", ".name_quantity", function() {
        let id = $(this).val();

        let prefix = String($(".add_form").attr("id"));
        let id_row = $(this).attr("id");

        id_row = id_row.split("-");
        let quantity_available = parseFloat(
            $(`#id_${prefix}-${id_row[1]}-quantity_available`).val()
        );

        if (!isNaN(parseFloat(id))) {
            if (parseFloat(id) > quantity_available) {
                $(this)
                    .parent()
                    .append(`<span class="text-danger">-${quantity_enter} </span>`);
                $(this).attr("style", "border:1px red solid;");
            } else {
                $(this).parent().children(`span`).remove();
                $(this).removeAttr("style");
            }
        }



    });

    $(document).on("change", ".name_price", function() {
        let id = $(this).val();
        let prefix = String($(".add_form").attr("id"));
        let id_row = $(this).attr("id");
        id_row = id_row.split("-");
        let min_price = parseFloat($(this).attr("min"));
        let max_price = parseFloat($(this).attr("max"));
        if (!isNaN(parseFloat(id))) {
            if (parseFloat(id) > max_price || parseFloat(id) < min_price) {
                $(this)
                    .parent()
                    .append(
                        `<span class="text-danger">-${price_enter}  ${min_price} - ${max_price}</span>`
                    );
                $(this).attr("style", "border:1px red solid;");
            } else {
                $(this).parent().children(`span`).remove();
                $(this).removeAttr("style");
            }
        }
    });

    $(document).on("change", "#id_currency", function() {
        $("#id_exchange_rate").val("");
        let currency_id = $(this).val();

        if (currency_id) {
            $.ajax({
                url: currency_info,
                method: "get",
                data: {
                    id: currency_id,
                },
                success: function(data) {
                    if (data.data) {
                        let res = JSON.parse(data.data);
                        let exchange_rate = $(`#id_exchange_rate`);
                        exchange_rate.val(res[0].fields.exchange_rate);
                        exchange_rate.attr("max", res[0].fields.highest_conversion_rate);
                        exchange_rate.attr("min", res[0].fields.lowest_conversion_rates);
                        exchange_rate.removeAttr("readonly");
                        if (res[0].fields.currency_type == "foreign") {
                            exchange_rate.removeAttr("readonly");
                        }
                        if (res[0].fields.currency_type == "local") {
                            exchange_rate.attr("readonly", "readonly");
                        }
                        change_currency(res[0].fields.exchange_rate);
                    }
                },
                error: function(data) {},
            });

            get_total();
        }
    });
    $(document).on("change", "#id_exchange_rate", function(evt) {
        let amount = parseFloat($(this).val());
        let _max = parseFloat($(this).attr("max"));
        let _min = parseFloat($(this).attr("min"));
        if (amount > _max || amount < _min || isNaN(amount)) {
            $(this)
                .parent()
                .append(
                    `<span class="text-danger">-${price_enter}  ${_min} - ${_max}</span>`
                );
            $(this).attr("style", "border:1px red solid;");
        } else {
            $(this).parent().children(`span`).remove();
            $(this).removeAttr("style");
        }

        get_total();
    });

    $(document).on("change", "#discount", function() {
        let val = parseFloat($(this).val());

        let discount_item = parseFloat($(`#discount_item`).val());
        let total = parseFloat($(`#total`).val());
        let taxes = parseFloat($(`#taxes`).val());
        if (isNaN(taxes)) {
            taxes = 0;
        }
        let to = total + taxes - discount_item;
        if (val > to) {
            $(this)
                .parent()
                .append(`<span class="text-danger">-${discount_enter} </span>`);
            $(this).attr("style", "border:1px red solid;");
        } else {
            $(this).parent().children(`span`).remove();
            $(this).removeAttr("style");
            // $("#discount_presentg").val(parseInt((100 * val) / total));
        }
    });

    $(document).on("change", "#discount_presentg", function() {
        let val = parseFloat($(this).val());

        let discount_item = parseFloat($(`#discount_item`).val());
        let total = parseFloat($(`#total`).val());
        let taxes = parseFloat($(`#taxes`).val());
        if (isNaN(taxes)) {
            taxes = 0;
        }
        let to = total + taxes - discount_item;
        if (val > 100) {
            $(this)
                .parent()
                .parent()
                .append(`<span class="text-danger">-${discount_enter} </span>`);
            $(this).attr("style", "border:1px red solid;");
        } else {
            $(this).parent().parent().children(`span`).remove();
            $(this).removeAttr("style");
            $("#discount").val(parseFloat((val * total) / 100));
        }
    });
    //#endregion
    function check_item_qty() {
        let prefix = String($('.add_form').attr('id'));
        let sta = false;
    
    
        $('.name_item').each(function(i, j) {
    
            let id_row = $(this).attr('id');
            if (id_row != undefined) {
                id_row = id_row.split('-');
                let qty = $(`#id_${prefix}-${id_row[1]}-quantity`).val();
                if(qty>0)
                    sta=true;
                
            }
        });
        return sta;
    
    }
    //#region change price table.
    $(document).on(
        "change",
        `input[class*=name_price],
        input[class*=name_discount],
        input[class*=name_discount_pre_item],
        #id_exchange_rate,
        #id_currency,
        #taxes,
     
        #discount,
        input[class*=name_quantity]`,
        function() {
            get_total();
        }
    );


    //#endregion
  // #discount_presentg,
    let form_id = "#sales_bill_form";
    $('select[name="bank"]').prop("required", false);
    $('select[name="cost_center"]').prop("required", false);
    $('input[name="burdens_sales_bill_Return-0-type_"]').prop("required", false);

    //#region submit form sales bill return.
    $(document).on("submit", form_id, function(e) {
        e.preventDefault();
        check_item_fund();
        check_burden_fund();
        check_item_qty();
        if(!check_item_qty()){
            alert("لا يوجد اي صنف يحتوي على كميات");
            return false;
        }
        if (check_item_fund()) {
            $('span[class="text-danger"]').remove();

            let forms = new FormData(this);
            $.ajax({
                url: $(this).attr("action"),
                data: forms,
                method: "POST",
                contentType: false,
                processData: false,
                success: function(data) {

                    $('span[class="text-danger"]').remove();
                    if (data.status == 1) {
                        
                        $('span[class="text-danger"]').remove();
                        $(form_id)[0].reset();
                        $(`textarea`).text("");
                        get_max_id($("#id_payment_method").val());
                        get_advanced_option_sales();
                        clearAllpage();
                        
                        
                        $("#load_div").load(load_url_return);
                        alert_message(data.message.message, data.message.class);
                        $('#DataTables_Table_0').DataTable().ajax.reload();
                    } else 
                    if (data.status == 0) {


                        let row_id = data.error.form_id;


                        if (row_id == "base") {

                            let error = data.error.error.error;
                            alert_message(error, 'alert alert-danger');
                            $.each(error, function(i, value) {
                                let div = '<span class="text-danger">';
                                $.each(value, function(j, message) {
                                    div += `- ${message.message}<br>`;
                                });
                                $(`#id_${i}`).parent().append(div);
                            });


                        }
                        if (row_id == "qly") {
                            quantity_enter = data.error.data;
                            $("td[name=" + quantity_enter + "]")
                                .parent()
                                .append(`<span class="text-danger">-${quantity_enter} </span>`);
                            $(this).attr("style", "border:1px red solid;");
                            return;
                        } else {

                            let error = data.error.error;



                            alert_message(error, 'alert alert-danger');

                        }
                    } 
                    if (data.status == 2) {
                        $.each(data.error, function() {
                            let form = $(this)[0].form_id_;
                            $(`#id_${form}-item`).parents('.item').css('outline', 'red auto');
                            alert_message($(this)[0].message, 'alert alert-danger');
                        });
                    }
                    $('#DataTables_Table_0').DataTable().ajax.reload();


                },
                error: function(jqXHR, textStatus, errorThrown) {
                    
                    $('#result').html('<p>status code: ' + jqXHR.status + '</p><p>errorThrown: ' + errorThrown + '</p><p>jqXHR.responseText:</p><div>' + jqXHR.responseText + '</div>');
                    alert('An error occurred... Look at the console (F12 or Ctrl+Shift+I, Console tab) for more information!');
                },
            });
        }
    });
    //#endregion

    //#region start function messageBox.

    var success = false;
    var message;

    connect = () => {
        // $('#button_download').addClass('loading');
        $('#button_download').off('click', connect);
        setTimeout(misteryMessage, 500);
    }

    misteryMessage = () => {


        message = (success) ? 'success' : 'error';
        $('.message-' + message).addClass('active');
        setTimeout(function() {
            // $('#button_download').removeClass('loading');
        }, 500);
        success = !success;
    }



    //#region get data in search use number bill.
    // $(document).on("click", "#button_download", function() {
    //     // alert('button_downloaderer')
    //     //get text box input number selas bill.

    //     let id = $("#id_number_search").val();

    //     // alert(id)
    //     //sheck is not null.
    //     if (!isNaN(id)) {
    //         //use get formset in table and append data in table befor search.
    //         $("#load_div").load(load_url + `?id=${id}`);
    //       //  $("#load_div").load(load_url_return + `?id=${id}`);
    //         getDataForSalesBillReturn(id, 0);

    //     }
    //     // alert('e')

    // });
    //#endregion

    //#region dblclick dataTable view if update sales bill.
    let number;
    $(document).on('dblclick', '.show_Operation>tr', function() {
        let id = $(this).children('td:nth(0)').children('.row_span_id').data('id');
        number = $(this).children('td:nth(1)').children('.row_span_number').data('id');

        if (id != undefined) {


            $("#load_div").load(load_url_return + `?id=${id}`);

            getDataForSalesBillReturn(id, 1);
            $('#Previous_Operations').modal('hide');

        }

    });

    //#endregion

    //#region get data for sales bill datatable or search text input.
    getDataForSalesBillReturn = (id, type) => {
            //get data in search use number bill.
            //get text box input number selas bill.
            //sheck is not null.
            //use get formset in table and append data in table befor search. 
            //call function ajax 
            let urlChose
                // type ==>[0]=get url data sales bill and find number.
                // type ==>[1]=get data sales bill return and find number.
            if (type === 0) {
                urlChose = get_recover_invoice_header_form
            } else {
                //get master sales bill return data 
                urlChose = get_master_sale_bill_return

            }
            $.ajax({
                //set url function views in ajax
                url: urlChose,
                method: 'get',
                data: {
                    'number_search': id
                },
                //get data if success.
                success: function(data) {


                    // check is found data.
                    if (data.data) {
                        // request Data and convert to json

                        let res = JSON.parse(data.data),
                            payment_method_Data = JSON.parse(data.payment_method),
                            Store_and_cost,
                            coustomer;

                        if (data.coustomer) {
                            coustomer = JSON.parse(data.coustomer)
                            coustomer = coustomer[0];
                            // createOptions("id_customer_data", coustomer.customer_id, coustomer.customer_number, coustomer.customer_name_ar, coustomer.customer_name_en);
                            $('#id_customer_data').val(coustomer.customer_id);

                        }
                        if (data.Store_and_cost) {
                           
                            Store_and_cost = JSON.parse(data.Store_and_cost);
                            Store_and_cost = Store_and_cost[0];
                        }
                        
                        res = res[0];

                        payment_method_Data = payment_method_Data[0];
                        


                        if (type === 1) {

                            $("#id_sales_bill").val(res.id);


                        } else {

                            
                        }
                        $("#id_check_amount").val(payment_method_Data.check_amount)

                        $("#id_check_number").val(payment_method_Data.check_number)
                        $("#id_due_date").val(payment_method_Data.due_date)

                        $('#id_branch').val(res.branch_id);
                        $('#taxes').val(res.burdens_taxes);
                        $('#id_currency').val(res.currency_id);

                        $('#id_date_bill').val(res.date_bill);
                        $('#discount').val(res.discount);
                        $('#discount_item').val(res.discount_items);
                        // $('#discount_presentg').val(res.discount_presentg);
                        $('#id_exchange_rate').val(res.exchange_rate);
                        $('#id_export_without_tax').prop('checked', Boolean(res.export_without_tax));
                        $('#final_total').val(res.final_total);
                        $('#total_taxes').val(res.total_taxes);

                        $('#id_payment_method').val(res.payment_method);
                        $('#reference').val(res.reference);
                        $('#statement').val(res.statement);
                        $('#total').val(res.total);
                        if (payment_method_Data.fund__id) {
                            // createOptions("id_fund", payment_method_Data.fund__id, payment_method_Data.fund__number, payment_method_Data.fund__arabic_name, payment_method_Data.fund__english_name);
                            // createOptions("id_fund", payment_method_Data.fund__id, payment_method_Data.fund__number, payment_method_Data.fund__arabic_name, payment_method_Data.fund__english_name);
                            $('#id_fund').val(payment_method_Data.fund__id);
                        } else {
                            createOptions("id_fund", "", "", "", "");

                        }
                        if (payment_method_Data.bank__id) {
                            // createOptions("id_bank", payment_method_Data.bank__id, payment_method_Data.bank__number, payment_method_Data.bank__arabic_name, payment_method_Data.bank__english_name);
                            $('#id_bank').val(payment_method_Data.bank__id);

                        }


                        $('#delete_this').attr('data-id', res.daily_entry_id);
                        $('#delete_this').removeAttr('style');
                        change_mathhod();
                        $('#DataTables_Table_0').DataTable().ajax.reload();

                        if (type === 1) {
                           
                            $("#id_number").val(number);
                            if (Store_and_cost) {
                                // createOptions("id_store", Store_and_cost.store__id, "", Store_and_cost.store__name, "");

                                // createOptions("id_cost_center", Store_and_cost.cost_center__id, "", Store_and_cost.cost_center__name_ar, Store_and_cost.cost_center__name_en);
                                $('#id_store').val(Store_and_cost.store__id);
                                $('#id_cost_center').val(Store_and_cost.cost_center__id);
                            } else {
                                createOptions("id_cost_center", "", "", "", "");
                                createOptions("id_store", "", "", "", "");

                            }
                        } else {
                            get_max_id($("#id_payment_method").val());
                            if (Store_and_cost) {
                                $('#id_store').val(Store_and_cost.store__id);
                                $('#id_cost_center').val(Store_and_cost.cost_center__id);
                                // createOptions("id_store", Store_and_cost.store__id, "", Store_and_cost.store__name, "");

                                // createOptions("id_cost_center", Store_and_cost.cost_center__id, "", Store_and_cost.cost_center__name_ar, Store_and_cost.cost_center__name_en);
                            } else {
                                createOptions("id_cost_center", "", "", "", "");
                                createOptions("id_store", "", "", "", "");

                            }
                        }
                        $('#DataTables_Table_0').DataTable().ajax.reload();
                    } else {


                        if (id) {
                            clearAllpage();


                            alert("Error", "لا يوجد الرقم في الفواتير " + id)
                        }
                        if (!id) {
                            clearAllpage();


                            alert(BoxEmpty1)
                            return;

                        }

                        $("#submit-button").text(Update);

                        createOptions("id_customer_data", '', '', '', '');
                        createOptions("id_fund", '', '', '', '');
                        createOptions("id_bank", '', '', '', '');
                        document.getElementById("sales_bill_form").reset();
                    }

                },
                error: function(jqXHR, textStatus, errorThrown) {
                    
                    $('#result').html('<p>status code: ' + jqXHR.status + '</p><p>errorThrown: ' + errorThrown + '</p><p>jqXHR.responseText:</p><div>' + jqXHR.responseText + '</div>');
                    alert('An error occurred... Look at the console (F12 or Ctrl+Shift+I, Console tab) for more information!');
                },

            });

            setTimeout(function() {
                change_class_buttons();
// alert('E')
                // get_total();
            }, 1000);

        }
        //#endregion

    //#region click button delete sales bill return.  
    $("#submit_button_delete").on("click", function(e) {

        e.preventDefault();
        if (confirm_delete()) {

            let id_sales_b_r = $("#id_sales_bill").val();

            if (id_sales_b_r) {
                $.ajax({
                    url: deleted_sales_bill_r,
                    method: "get",
                    data: {
                        'id_sales_b_r': id_sales_b_r
                    },
                    success: function(data) {
                        if (data.data) {
                            clearAllpage();
                            alert_message(data.data, 'alert alert-success');
                            $('#DataTables_Table_0').DataTable().ajax.reload();
                            $("#submit-button").text("save");
                        } else {
                            $("#submit-button").text("update");

                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        $('#result').html('<p>status code: ' + jqXHR.status + '</p><p>errorThrown: ' + errorThrown + '</p><p>jqXHR.responseText:</p><div>' + jqXHR.responseText + '</div>');
                        alert('An error occurred... Look at the console (F12 or Ctrl+Shift+I, Console tab) for more information!');
                    },

                });
            } else {
                alert("Error");
            }



        }



    });

    //#endregion


    requier_payment_method = () => {
        $.ajax({
            url: Urequier_payment_method,
            method: "post",
            data: {
                'val_payment': $("#payment_method").val(),
            },
            success: function(data) {},
            error: function(data) {}

        })
    }

});