function insertAfter(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}

function activaTab(elem) {
    if (elem === "home") {
        $('.nav-tabs a[href="#home"]').tab('show')
    }
    if (elem === "menu1") {
        $('.nav-tabs a[href="#menu1"]').tab('show')
    }
    if (elem === "menu2") {
        $('.nav-tabs a[href="#menu2"]').tab('show')
    }
    if (elem === "menu3") {
        $('.nav-tabs a[href="#menu3"]').tab('show')
    }
    if (elem === "menu4") {
        $('.nav-tabs a[href="#menu4"]').tab('show')
    }
    if (elem === "menu5") {

        $('.nav-tabs a[href="#menu5"]').tab('show')


    }

}

// check if all inputs in tabs are filled
function checkValidity(element, div) {

    let valid = true;
    $(`${element}`).attr('href', '');
    $('.nav-tabs li.active').next('li').find('a').attr('data-toggle', 'tab').tab('show');

    $(document).on('click', element, function(e) {


        $('h5.empty-filed').text('');
        $(`${div} select:required`).each(function(e) {
            if ($(this).val() === '') {
                let id = "id_" + $(this).prop("name");
                let newEl = document.createElement('div');
                newEl.innerHTML = `<h5 style="margin-top: 5px;" class="text-danger empty-filed">${message_empty} </h5>`;
                let ref = document.querySelector("#" + id);
                insertAfter(newEl, ref);
                valid = false;
            }
        });
        $(`${div} input:required`).each(function(e) {
            if ($(this).val() === '') {
                let id = "id_" + $(this).prop("name");
                let newEl = document.createElement('div');
                newEl.innerHTML = `<h5 style="margin-top: 5px;" class="text-danger empty-filed">${message_empty} </h5>`;
                let ref = document.querySelector("#" + id);
                insertAfter(newEl, ref);
                valid = false;
            }
        });
        // if (valid) {

        //     if (element === '#item_field_submit') {
        //         // $(`${element}`).attr('href','#menu1');
        //         $('.nav-item a[href="#menu11"]').tab('show');
        //         // $('.nav-tabs li.active').next('#men_id1').find('a').attr('data-toggle', '#menu1').tab('show');
        //         //   $('.nav-tabs a[href="#menu1"]').tab('show')
        //     }
        //     if (element === '#item_main_field_submit') {
        //         // $(`${element}`).attr('href','#menu2');
        //         $('.nav-item a[href="#menu2"]').tab('show');

        //         // $('.nav-tabs li.active').next('#men_id2').find('a').attr('data-toggle', '#menu2').tab('show');
        //     }
        //     if (element === '#item_unit_field_submit') {

        //         // $(`${element}`).attr('href','#menu5');
        //         // $('.nav-tabs li.active').next('#men_id5').find('a').attr('data-toggle','#menu5').tab('show');

        //         if (!checkIsPrimaryChecked()) {
        //             alert("Choose one primary unit first !");
        //         } else {
        //             // $('.nav-tabs li.active').next('#men_id5').find('a').attr('data-toggle', '#menu5').tab('show');
        //             $('.nav-item a[href="#menu5"]').tab('show');
        //         }

        //     }
        //     if (element === '#item_another_data_field_submit') {
        //         // $(`${element}`).attr('href','#menu3');

        //         // $('.nav-tabs li.active').next('#men_id3').find('a').attr('data-toggle', '#menu3').tab('show');
        //         $('.nav-item a[href="#menu3"]').tab('show');

        //         if(!checkIsPrimaryChecked()){
        //             alert("Choose one primary unit first !");
        //         }
        //     }
        //     if (element === '#item_supplier_field_submit') {
        //         // $(`${element}`).attr('href','#menu4');
        //         // $('.nav-tabs li.active').next('#men_id4').find('a').attr('data-toggle', '#menu4').tab('show');
        //         $('.nav-item a[href="#menu4"]').tab('show');

        //     }
        //     if(!checkIsPrimaryChecked()){
        //         alert("Choose one primary unit first !");
        //     }
        // }
    });
}


function checkValidityPrev(element, div) {
    let valid = true;
    $(`${element}`).attr('href', '');

    $('.nav-tabs li.active').next('li').find('a').attr('data-toggle', 'tab').tab('show');
    $(document).on('click', element, function(e) {
        $('h5.empty-filed').text('');



        $(`${div} input:required `).each(function(e) {
            if ($(this).val() === '') {
                let id = "id_" + $(this).prop("name");
                let newEl = document.createElement('div');
                newEl.innerHTML = `<h5 style="margin-top: 5px;" class="text-danger empty-filed">${message_empty} </h5>`
                let ref = document.querySelector("#" + id);
                insertAfter(newEl, ref);
                valid = false;
            }
        });
        if (valid) {
            if (element === '#item_main_field_submit1') {
                // $(`${element}`).attr('href','#menu2');
                // $('.nav-tabs li.active').prev('#men_home').find('a').attr('data-toggle', '#home').tab('show');
                $('.nav-item a[href="#home"]').tab('show');

            }
            if (element === '#item_unit_field_submit1') {
                $('.nav-item a[href="#menu1"]').tab('show');

                // $(`${element}`).attr('href','#menu5');
                // $('.nav-tabs li.active').prev('#men_id1').find('a').attr('data-toggle', '#menu1').tab('show');


            }
            if (element === '#item_another_data_field_submit1') {
                // $(`${element}`).attr('href','#menu3');
                // $('.nav-tabs li.active').prev('#men_id2').find('a').attr('data-toggle', '#menu2').tab('show');
                $('.nav-item a[href="#menu2"]').tab('show');

                // if(!checkIsPrimaryChecked()){
                //     alert("Choose one primary unit first !");
                // }
            }
            if (element === '#item_supplier_field_submit1') {
                // $(`${element}`).attr('href','#menu4');
                // $('.nav-tabs li.active').prev('#men_id5').find('a').attr('data-toggle', '#menu5').tab('show');
                $('.nav-item a[href="#menu5"]').tab('show');

            }
            if (element === '#item_store_field_submit') {
                // $(`${element}`).attr('href','#menu4');
                // $('.nav-tabs li.active').prev('#men_id3').find('a').attr('data-toggle', '#menu3').tab('show');
                $('.nav-item a[href="#menu3"]').tab('show');

            }

            if(!checkIsPrimaryChecked()){
                alert("Choose one primary unit first !");
            }
        }
    });
}

function RepeatInUnit(id) {
    let data = id.name;

    $('select[id$="-unit"]').each(function() {
        
        if (this.name != data) {
            if (this.value == id.value) {
                
                $(id).prop("selectedIndex", 0);
                return false;
            }
        }
    });
    return true;
}

function checkIsPrimary(element) {
    checkUsedUnit(element);
    let row_id = element.name.split('-')[1];
    // isChecked = $(`input[name"*-is_primary"`).prop('checked');
    let targetField = $(`#id_ItemUnit-${row_id}-is_primary`);
    let targetField1=$(`input[name="ItemUnit-${row_id}-package"][type="number"]`)
    $('input[id$="-is_primary"]').each(function() {
    let isChecked = $(this).prop('checked');
    
    $('input[id$="-package"]').each(function() {
                $(this).val('').attr('readonly', false);
                
            });
    if (isChecked && this !== targetField[0]) {
                $(this).prop('checked', false);
                
                targetField1.val(1).attr('readonly', 'readonly');
            targetField.prop('checked', true);
        }
    });
    
    let unit_rows = parseInt($('#id_' + 'ItemUnit' + '-TOTAL_FORMS').val());

    if (unit_rows > 1 || unit_rows === 1) {
        if (element.checked) {
            for (let i = 0; i < unit_rows; i++) {
                if (element.id === `id_ItemUnit-${i}-is_primary`) {
                    $(`input[name="ItemUnit-${row_id}-package"][type="number"]`).val(1).attr('readonly', 'readonly');
                    continue;
                } else {
                    // $(`input[name="ItemUnit-${i}-is_primary"][type="checkbox"]`).attr('readonly', true);
                }
            }
        } else if (!element.checked) {

            for (let i = 0; i < unit_rows; i++) {
                if (element.id === `id_ItemUnit-${i}-is_primary`) {
                    $(`input[name="ItemUnit-${row_id}-package"][type="number"]`).val('').attr('readonly', false);
                    continue;
                } else {
                    // $(`input[name="ItemUnit-${i}-is_primary"][type="checkbox"]`).attr('disabled', false);
                }
            }
        }
    }
}

function checkIsPrimaryChecked() {
    let unit_rows = parseInt($('#id_' + 'ItemUnit' + '-TOTAL_FORMS').val());
    let valid = false;
    for (let i = 0; i < unit_rows; i++) {
        if (($(`#id_ItemUnit-${i}-is_primary`).is(":checked"))) {
            valid = true;
            break;
        }
    }
    return valid;
}
function getSubgroup(main_grout_id) {
    $.ajax({
        url: urls_,
        data: {
            'id_main_group': main_grout_id.value,
        },
        method: 'get',
        beforeSend: function(xhr) {
            xhr.setRequestHeader("X-CSRFToken", csrf);
        },
        success: function(data) {
            let element = document.getElementById("id_item_sub_group");
            element.classList.remove("disabled");
            let option = '<option value="" selected="">---------</option>';
            $.each(data, function(index, sub_group) {
                option += '<option value="' + index + '">' + sub_group + '</option>';
            });
            $('#id_item_sub_group').html("").append(option);
        },
        error: function(data) {}
    });
}

function getPriceOfUnit(element) {
    let unit_rows = parseInt($('#id_' + 'ItemUnit' + '-TOTAL_FORMS').val());
    let primary_row;
    for (let i = 0; i < unit_rows; i++) {
        if (($(`#id_ItemUnit-${i}-is_primary`).is(":checked"))) {
            primary_row = i;
            break;
        }
    }
    
    let element_index = element.name.split('-')[1];
    let primary_price = parseFloat($(`#id_ItemUnit-${primary_row}-price`).val());
    let unit_price = parseFloat($(`#id_ItemUnit-${element_index}-package`).val());

    $(`#id_ItemUnit-${element_index}-price`).val(parseFloat(unit_price * primary_price));
}

function checkUsedUnit(element){
    
    let unit_rows = parseInt($('#id_' + 'ItemUnit' + '-TOTAL_FORMS').val());
    let element_index = element.name.split('-')[1];
    let e = document.getElementById(element.id);
    for (let i = 0; i < unit_rows; i++){
        // console.log( element_index);
       var checked = $("#"+element.id).is(':checked'); // Get Checkbox state
    //    if (checked) //If true then checked all checkboxes
    //         alert(i);
   }
    
        
    // $("#"+element.id).prop('checked', true);
    // $(".checkinput_").prop('checked', false); //or uncheck all textboxes 

}

function enableStoppedDate(element) {
    if (element.checked) {
        $(`#div_id_stopped_date`).removeClass('hidden');
        $(`#div_id_stopped_reason`).removeClass('hidden');
        $(`input[name="stopped_date"][type="date"]`).attr('readonly',false).attr('required',true);
    }
    if (!element.checked) {
        $(`#div_id_stopped_date`).addClass('hidden');
        $(`#div_id_stopped_reason`).addClass('hidden');

        $(`input[name="stopped_date"][type="date"]`).val('').attr('readonly',true).attr('required',false);
    }
}

function edit_row(selector, tempFunction = function() {}) {
    
    $('#form-id-item').trigger("reset");
    let id_row = selector.data('id');
    $.ajax({
        url: selector.data('url'),
        data: { 'id': id_row, },
        method: 'get',
        success: function(data) {

            $(`input[type="checkbox"]`).prop('checked', false);
            $(`input[type="checkbox"]`).removeAttr('disabled');
            
            
            
            let item_data = JSON.parse(data.item_data);
            let main_data = JSON.parse(data.item_main_data);
            let item_unit_data = JSON.parse(data.item_unit_data)
            let item_price = JSON.parse(data.item_price);
                if (item_price.length !== 0) {
                    $.each(item_price[0].fields, function(i, value) {

                        try {
                            $(`input[name="${i}"]`).val(value);
                            $(`select[name="${i}"] option[value="${value}"]`).attr('selected', 'selected');
                        } catch (error) {

                        }

                    });

                }
                // let item_supplier_data = JSON.parse(data.item_supplier_data)
                // let item_store_data = JSON.parse(data.item_store_data)

            let unit_rows = parseInt($('#id_' + 'ItemUnit' + '-TOTAL_FORMS').val());
            // let supplier_rows = parseInt($('#id_' + 'SuppliersItems' + '-TOTAL_FORMS').val());
            // let store_rows = parseInt($('#id_' + 'ItemStore' + '-TOTAL_FORMS').val());

            if (data.status === 1) {
                if (main_data.length !== 0) {
                    $.each(main_data[0].fields, function(i, value) {
                        if (!$('#id_' + i).is(":checkbox")) {
                            $(`input[name="${i}"]`).val(value);
                        }
                        if ($('#id_' + i).is(":checkbox")) {
                            if (value === true) {
                                $(`input[name="${i}"][type="checkbox"]`).prop('checked', 'checked');
                            } else {
                                $(`input[name="${i}"][type="checkbox"]`).prop('checked', false);
                            }
                        }
                        // $(`select[name="${i}"] option[value="${value}"]`).attr('selected','selected');
                        $(`select[name="${i}"]`).val(value);
                        // $('#modalLRForm').modal('show');
                        
                    });
                    if ($("#id_is_stopped").prop("checked")) 
                    enableStoppedDate(this);
                else
                enableStoppedDate(this);
                    
                }


                if (item_unit_data.length !== 0) {
                    if (unit_rows > 1) {
                        for (i = 0; i < unit_rows; i++) {
                            deleteForm($('#ItemUnit-0'), String($('.add-form-row').attr('id')));
                        }
                    }
                    let unitrowcounter = 0;
                    $.each(item_unit_data, function(n, v) {
                        if (unitrowcounter !== 0) {

                            addForm($('.add-form-row'), String($('.add-form-row').attr('id')));
                        }
                        $.each(v.fields, function(i, value) {
                            if (!$('#id_ItemUnit-' + unitrowcounter + '-' + i).is(":checkbox")) {
                                $(`input[name="ItemUnit-${unitrowcounter}-${i}"]`).val(value);
                            }
                            if ($('#id_ItemUnit-' + unitrowcounter + '-' + i).is(":checkbox")) {
                                if (value === true) {
                                    $(`input[name="ItemUnit-${unitrowcounter}-${i}"][type="checkbox"]`).prop('checked', 'checked');
                                    $(`input[name="ItemUnit-${unitrowcounter}-package"][type="number"]`).attr('readonly', 'readonly');
                                    $(`input[name="ItemUnit-${unitrowcounter + 1}-is_primary"][type="checkbox"]`).attr('disabled', 'disabled');

                                    if (value === false) {
                                        $(`input[name="ItemUnit-${unitrowcounter}-${i}"][type="checkbox"]`).attr('disabled', 'disabled');
                                    }
                                } else {
                                    $(`input[name="${i}"][type="checkbox"]`).attr('checked', false);
                                }
                            }
                            // $(`select[name="ItemUnit-${unitrowcounter}-${i}"] option[value="${value}"]`).attr('selected','selected');
                            $(`select[name="ItemUnit-${unitrowcounter}-${i}"]`).val(value);

                            // $('#modalLRForm').modal('show');
                        });
                        unitrowcounter += 1;
                    });
                }



                if (item_data.length !== 0) {
                    let main_group_item = data.data1.main_group_item;
                    let main_group_item_optoin = `<option selected value="${main_group_item.id}">${main_group_item.name}</option>`;
                    $("#id_item_main_group").append(main_group_item_optoin);
                    $(`input[name="id"]`).val(item_data[0].pk);
                    $.each(item_data[0].fields, function(i, value) {

                        try {
                            $(`input[name="${i}"]`).val(value);
                            $(`select[name="${i}"] option[value="${value}"]`).attr('selected', 'selected');

                            $('.nav-item a[href="#tab-eg7-0"]').tab('show')
                            $('.nav-item a[href="#home"]').tab('show')
                                // $('#modalLRForm').modal('show');
                        } catch (error) {

                        }

                    });
                }
                
            }
            tempFunction();
        },
        error: function(data) {}
    });

}
function checknumber(element){
    
    $("#number_copy").val(element.value);
}
function delete_row(selector, tempFunction = function() {}) {
    if (confirm_delete()) {
        let id_row = selector.data('id');
        $.ajax({
            url: selector.data('url'),
            data: {
                'id': id_row,
            },
            method: 'DELETE',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("X-CSRFToken", csrf);
            },
            success: function(data) {

                if (data.status === 0) {
                    alert_message(data.message.message, data.message.class);
                }
                if (data.status === 1) {
                    alert_message(data.message.message, data.message.class);
                    tempFunction();
                    table.ajax.reload();
                    // reloadTreeData();
                }
            },
            error: function(data) {}
        });
    }
}

$(document).ready(function() {
    $(`#div_id_stopped_date`).addClass('hidden');
    $(`#div_id_stopped_reason`).addClass('hidden');
    $('#modalLRForm').on('hidden.bs.modal', function(e) {
        $('#form-id-item')[0].reset();

        $('select option:selected').removeAttr('selected');
        $(`textarea`).text('');
        if (!$('#men_home').hasClass('active')) {

            $('.nav-tabs a[href="#home"]').tab('show')

        }
    });


    $('[data-tooltip="tooltip"]').tooltip();

  

});