
$(document).on("change", "select[class*=name_item]", function () {

    let id_row = $(this).attr("id");
    clear_item(id_row);
    let store_id = $("#id_store");
    let status_store = false;
    if (store_id.length > 0) {
        if (store_id.val() > 0) {
            store_id = store_id.val();
            status_store = true;
        } else {
            alert(message_empty_stor);
            
            // $(this).children("option:selected").index(0);
            status_store = false;
            store_id = "";
        }
    } else {
        status_store = true;
        store_id = "";
    }

    if (status_store) {
        let id = $(this).val();
        let prefix = String($(".add_form").attr("id"));

        id_row = id_row.split("-");
        let unit = $(`#id_${prefix}-${id_row[1]}-unit`);
        let store = $(`#id_${prefix}-${id_row[1]}-store`);
        let price = $(`#id_${prefix}-${id_row[1]}-price`);
        unit.children("option").remove();
        store.children("option").remove();

        $.ajax({
            url: get_item_info,
            data: {
                id: id,
                store_id: store_id,
            },
            method: "GET",

            success: function (data) {
                $(this)
                    .parent()
                    .siblings("td")
                    .children(".name_currency")
                    .children("option")
                    .remove();
                
                let option_unit = `<option value="">.....</option>`;
                let data_unit = data.data_unit;
                $(this)
                    .parent()
                    .siblings("td")
                    .children(".name_currency")
                    .children("option")
                    .remove();
                $.each(data_unit, function (i, j) {
                    let selected = "";
                    if (j.ItemUnit__sales_unit) {
                        selected = "selected";
                    }
                    option_unit += `<option ${selected} data-package="${j.ItemUnit__package}" value="${j.id}">${j.name_ar}</option>`;
                });
                unit.append(option_unit);

                let data_price = data.data_price;
                if (data_price) {
                    var min_price =
                        parseFloat(data_price[0].min_price) *
                        parseFloat(data_price[0].currency__exchange_rate);
                    let max_price =
                        parseFloat(data_price[0].max_price) *
                        parseFloat(data_price[0].currency__exchange_rate);
                    data_price =
                        parseFloat(data_price[0].price) *
                        parseFloat(data_price[0].currency__exchange_rate);
                    let exchange_rate = parseFloat($("#id_exchange_rate").val());
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

                    let package = $(unit).children("option:selected").data("package");

                    if (!isNaN(package)) {
                        price_val = price_val * package;
                        min_price_val = min_price_val * package;
                        max_price_val = max_price_val * package;
                    } else {
                        price_val = price_val;
                        min_price_val = min_price_val;
                        max_price_val = max_price_val;
                    }
                    $(price).val(parseFloat(price_val).toFixed(2));
                    $(price).attr("min", parseFloat(min_price_val).toFixed(2));
                    $(price).attr("max", parseFloat(max_price_val).toFixed(2));
                }
                if (store_id == "") {
                    let data_store = JSON.parse(data.data_store);
                    let option_store = `<option value="">.....</option>`;
                    $.each(data_store, function (i, j) {
                        option_store += `<option value="${j.pk}">${j.fields.name}</option>`;
                    });
                    store.append(option_store);
                } else {
                    let qty = parseFloat(data.data_store.qty);
                    if (isNaN(qty)) {
                        $(`#id_${prefix}-${id_row[1]}-quantity`).attr(
                            "readonly",
                            "readonly"
                        );
                        $(`#id_${prefix}-${id_row[1]}-quantity`).val("");
                        $(`#id_${prefix}-${id_row[1]}-quantity`)
                            .parent()
                            .children("span")
                            .remove();
                        $(`#id_${prefix}-${id_row[1]}-quantity`)
                            .parent()
                            .append(`<span class="text-danger">-${quantity_error} </span>`);
                    } else {
                        let package = parseFloat(
                            $(`#id_${prefix}-${id_row[1]}-unit`)
                                .children("option:selected")
                                .data("package")
                        );
                        $(`#id_${prefix}-${id_row[1]}-quantity`).removeAttr("readonly");
                        $(`#id_${prefix}-${id_row[1]}-quantity`)
                            .parent()
                            .children("span")
                            .remove();
                        if (!isNaN(package)) {
                            $(`#id_${prefix}-${id_row[1]}-quantity_available`).val(
                                parseFloat(qty / package).toFixed(2)
                            );
                        } else {
                            $(`#id_${prefix}-${id_row[1]}-quantity_available`).val(qty);
                        }
                    }
                }
            },
            error: function () { },
        });
    }
});
