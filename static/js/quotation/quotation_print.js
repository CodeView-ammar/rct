let host_;
function create_profile_repo(id_row) {
    $.ajax({
        method: "get", // initialize an AJAX request
        dataType: "JSON",
        url: "/get_footer/",
        data: { "id": 1 },

        success: function(data) {
            let res = JSON.parse(data.data);
            host_=data.host;
            
            var rootUrl = window.location.protocol + "//" + window.location.host;
            $("#commercial_register").html(`<lable style='font-weight: bold;'>السجل التجاري:</lable> ${res[0].fields.company_register}`);

            document.getElementById("logo_report").src = data.host + res[0].fields.image;
        
        },
        error: function(data) {
            alert(data.status);

        }
    })
    $.ajax({
        url: get_master_report,

        data: {
            "id": id_row,
            method: "get"
        },
        success: function(data) {
            let res = JSON.parse(data.data);
            let ide = data.ide;
            let header = data.header;
            res = res[0];

            if (ide == "return") {
                $("#name_report_Ar").html("فــاتورة مردود بــيع");
                $("#name_report_En").html("SALES RETURN BILL");

            } else {
                $("#name_report_Ar").html("<lable style='font-weight: bold;'>نوع الفاتورة</lable> عرض سعر");
                $("#name_report_En").html("SALES BILL");
            }
              
// رائس التقرير
$("#user_input").html(`<lable style='font-weight: bold;'>اسم المستخدم</lable> ${res['created_by_id__emplayee_id__EmployeeName']}`);
$("#branch__company__name_ar").html(`${res['branch__company__name_ar']}`)
$("#branch__name_ar").html(`${res['branch__name_ar']}`)
            if(res['branch__address'])
            $("#branch__address").html(`${res['branch__address']}`)
        if(res['branch__phone'])
        $("#branch__phone_ar").html(`${res['branch__phone']}`);
    
    $("#branch__company__name_en").html(`${res['branch__company__name_en']}`);
    if(res['branch__name_en'])
    $("#branch__name_en").html(`${res['branch__name_en']}`);
        if(res['branch__address_en'])
        $("#branch__address_en").html(`${res['branch__address_en']}`);
        if(res['branch__phone'])
            $("#branch__phone_en").html(`${res['branch__phone']}`);
            
        $("#branch__company__tax_number").html(`<lable style='font-weight: bold;'>الرقم الضريبي</lable> ${res['branch__company__tax_number']}`)
        // نهاية رائس التقرير
          
        // بيانات العميل
            $("#customer_data__name_ar").html(`<lable style='font-weight: bold;'>اسم العميل</lable> ${res['customer_data__name_ar']}`);
            if(res['customer_data__address'])
            $("#customer_data__address").html(`<lable style='font-weight: bold;'>عنوان موقع العميل</lable> ${res['customer_data__address']}`);
            if(res['customer_data__vat_number'])
            $("#customer_data__vat_number").html(`<lable style='font-weight: bold;'>الرقم الضريبي للعميل</lable> ${res['customer_data__vat_number']}`);
        
        $("#date_bill_R").html(`<lable style='font-weight: bold;'>تاريخ الفاتور</lable> ${res['transaction_date']}`);

        $("#number_R").html(`<lable style='font-weight: bold;'>رقم الفاتورة </lable> ${res['number']}`);
        
        $("#date_of_supply").html(`<lable style='font-weight: bold;'>صالح حتى</lable> ${res['valid_till']}`);

            



            $("#Stor_R").html(`<lable style='font-weight: bold;'>المخزن</lable> ${res['quotationdetail'+ide+'__store__name']}`);
            


            let table = document.createElement('table');
            let tbody = document.createElement('tbody');

            table.id = "table_report_";
            let headertd;
        

            
            headertd = [ "كمية","اسم المنتج","الوحدة","<p>سعر</p><p>(غير شامل الضريبة)</p>","<p>الإجمالي</p><p>(غير شامل الضريبة)</p>", "<p>إجمالي</p><p>(شامل الضريبة)</p>"];
            if(header[0]['expiry_date']){
                // Set table header
                headertd += [ "تاريخ الانتهاء"];
            }

            const thead = document.createElement("thead");
            const tr = document.createElement("tr");
            for (const h of headertd) {
            const th = document.createElement("th");
            th.innerHTML = h;
            tr.appendChild(th);
        }
            thead.appendChild(tr);
            
            
            
            // Creating and adding data to second row of the table
            let row_2, row_2_data_1, row_2_data_2, row_2_data_3, row_2_data_5, row_2_data_6,row_2_data_7;
            let total_Tax=0
            let tax__tax_rate="";
            for (var i = 0; i < header.length; i++) {
                row_2 = document.createElement('tr');
                row_2_data_1 = document.createElement('td');
                row_2_data_2 = document.createElement('td');
                row_2_data_3 = document.createElement('td');
                row_2_data_5 = document.createElement('td');
                row_2_data_6 = document.createElement('td');
                row_2_data_7 = document.createElement('td');
                var sub_title=parseFloat(header[i]["quantity"])*parseFloat(header[i]["price"]);
                total_Tax+=(parseFloat(header[i]['total'])-sub_title)
                row_2_data_1.innerHTML = header[i]['quantity']
                row_2_data_6.innerHTML =header[i]['unit__name_ar'];
                row_2_data_2.innerHTML = header[i]['item__name_ar'];
                row_2_data_3.innerHTML = header[i]['price']+" "+res['currency__currency_code'];
                row_2_data_5.innerHTML =sub_title +" "+res['currency__currency_code'];
                row_2_data_7.innerHTML = header[i]['total']+" "+res['currency__currency_code'];
                tax__tax_rate=header[i]['tax__tax_rate']+"%";
                row_2.appendChild(row_2_data_1);
                row_2.appendChild(row_2_data_2);
                row_2.appendChild(row_2_data_6);
                
                row_2.appendChild(row_2_data_3);
                row_2.appendChild(row_2_data_5);
                row_2.appendChild(row_2_data_7);
                tbody.appendChild(row_2);
            }
            // Creating and adding data to third row of the table
            
            $("#reference_R").html(`المرجع:     ${res['reference']}`);
            
            $("#total_R").html(res['total']+" "+res['currency__currency_code']);

            $("#burdens_taxes_R").html(total_Tax+" "+res['currency__currency_code']);

            $(".final_total_R").html(res['final_total']+" "+res['currency__currency_code']);

            $("#discount_presentg_R").html(tax__tax_rate);

            $("#discount_R").html(res['discount']);

            $("#discount_item_R").html(res['discount_item']);

            $("#statement_R").html(res['statement']);



            table.appendChild(thead);
            table.appendChild(tbody);

            $("#table_report").html(table);

            //   $("#note_repo").html(res[cou]['notes'])



            function Get_Text_prise(number_prise, currency__name_ar) {
                $.ajax({
                    url: get_text_price_url,
                    data: {
                        'price': number_prise,
                        method: "get"
                    },
                    success: function(data) {
                        if (data.status == '1') {
                            $("#text_number_ammount_report").html(data.data + "  " + currency__name_ar);

                        } else
                            $("#text_number_ammount_report").html(number_prise + "  " + currency__name_ar);

                    }
                });
            }

        }
    });
}

function create_report_casher(id_row,after_print=false) {
    $.ajax({
        method: "get", // initialize an AJAX request
        dataType: "JSON",
        url: "/get_footer/",
        data: { "id": 1
    
    },

        success: function(data) {
            let res = JSON.parse(data.data);
            // alert(data.company__name_ar);
            $("#company_report2").html(data.company__name_ar);
            $("#branch_report1").html(res[0].fields.name_ar);
            $("#phone_invo").html(res[0].fields.phone);
            $("#address_invo").html("عنوان :"+res[0].fields.address);
            var d = new Date();
            $("#item_invo").html(d.getHours()+":"+d.getMinutes()+":"+d.getSeconds());
            document.getElementById("logo_report_casher").src = data.host + res[0].fields.image;

            $.ajax({
                url: get_master_report,

                data:{
                    "id":id_row
                },
                method: "get",
                success: function(data) {
                    let res = JSON.parse(data.data);
                    let ide = data.ide;
                    let header = data.header;
                    res = res[0];
                    if (ide == "return") {
                        $("#name_report_Ar_casher_ar").html("فــاتورة مردود بــيع");

                    } else {
                        $("#name_report_Ar_casher_ar").html("فــاتورة بــيع");

                    }
                    
                    $("#number_invo").html(`${res['number']}`);
                    $("#date_invo").html(`${res['date_bill']}`);
                    $("#branch_R_cacher").html(`${res['branch__name_ar']}`);
                    $("#user_input").html(`<lable style='font-weight: bold;'>اسم المستخدم</lable> ${res['created_by_id__emplayee_id__EmployeeName']}`);
                    var disc;
                    disc=res['total']
                    if (!disc)
                    disc="0"
                    $("#total_R_casher").html(disc+" "+res["currency__currency_code"]);
                    disc=res['burdens_taxes']
                    if (!disc)
                    disc="0"
                    $("#burdens_taxes_R_casher").html(disc+" "+res["currency__currency_code"]);
                    disc=res['final_total']
                    if (!disc)
                    disc="0"
                    $(".final_total_R_casher").html(disc+" "+res["currency__currency_code"]);
                    disc=res['discount_presentg']
                    if (!disc)
                    disc="0"
                    $("#discount_presentg_R_chaser").html(disc+" "+res["currency__currency_code"]);




                    let tbody_cash=$("#tbody_cash")
                    tbody_cash.html("");
                    // Creating and adding data to second row of the table
                    let row_2,row_2_data_2, row_2_data_5, row_2_data_6;
                    for (var i = 0; i < header.length; i++) {
                        row_2 = document.createElement('tr');
                        row_2_data_2 = document.createElement('td');
                        row_2_data_5 = document.createElement('td');
                        row_2_data_6 = document.createElement('td');

                        row_2_data_2.innerHTML = header[i]['item__name_ar'];
                        row_2_data_5.innerHTML = header[i]['quantity'];
                        row_2_data_6.innerHTML = header[i]["total"]+" "+res["currency__currency_code"];
                        row_2_data_6.classList="price";
                        row_2.appendChild(row_2_data_2);
                        row_2.appendChild(row_2_data_5);
                        row_2.appendChild(row_2_data_6);
                        tbody_cash.append(row_2);
                    }
                    if(after_print){
                        
                        var inv=$("#invoice_POS").html();
                        $('').printThis({
                            debug: false,
                            header: inv,
                        });
                    }
                }
            });
        },
        error: function(data) {
            alert(data.status);

        }
    })

}
$("#btn_print_chasher").on('click', function(e){
    e.preventDefault();
    if ($("#id_id").val()) {
        
        $("#print_hort").modal('show');
        create_report_casher($("#id_id").val());
        
    } else if ($("#id_sales_bill").val()) {
        $("#ReportAfterSave").modal('show');
        create_report_casher($("#id_sales_bill").val());

    } else {
        alert("يجب إختيار فاتورة المراد طباعتة");

    }

    
})


// $(document).on('click', '#btn_print', function(e) {
//     // $("#id_sales_bill").val(80)

//     e.preventDefault();
//     if ($("#id_id").val()) {

//         $("#ReportAfterSave").modal('show');
//         create_profile_repo($("#id_id").val());

//     } else if ($("#id_sales_bill").val()) {
//         $("#ReportAfterSave").modal('show');
//         create_profile_repo($("#id_sales_bill").val());

//     } else {
//         alert("يجب إختيار فاتورة المراد طباعتة");

//     }
// });