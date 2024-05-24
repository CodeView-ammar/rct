    function create_profile_repo(id_row, chois,bond_type="") {
        $.ajax({
            method: "get", // initialize an AJAX request
            dataType: "JSON",
            url: "/get_footer/",
            data: { "id": 1 },

            success: function(data) {
                let res = JSON.parse(data.data);

                $("#company_report").html(res[0].fields.name_ar);
                $("#phone_number").html(res[0].fields.phone);
                document.getElementById("logo_report").src = data.host + res[0].fields.image;
                let cho1 = '';
                let cho2 = '';
                if (chois == "id") {
                    cho1 = id_row;
                    cho2 = '';
                } else {
                    cho2 = id_row;
                    cho1 = '';
                }
                $.ajax({
                    url: urls_,

                    data: {
                        "id": cho1,
                        "bond_number": cho2,
                        "bond_type":bond_type,
                        method: "get"
                    },
                    success: function(data) {
                        let res = data.data;
                        let header = data.header[0];

                        if (header['bond_type'] == '2') {
                            $("#name_report_Ar").html("ســــــند قبــــــض");
                            $("#name_report_En").html("RECEOPT VOUCHER");
                            $("#name_recipient_report_id").html(`                     قبض من الأخ/الأخوة:     ${header['recipient']}`);


                        } else {
                            $("#name_report_Ar").html("ســــــند صــــــرف");
                            $("#name_report_En").html("PAYMENT VOUCHER");
                            $("#name_recipient_report_id").html(`                     أصرفو للأخ/الأخوة:${header['recipient']}`);

                        }
                        $("#number_report_id").html(`رقم السند:     ${header['bond_number']}`);
                        $("#date_report").html(`تاريخ السند:     ${header['date']}`);
                        $("#number_refra_report").html(`رقم المرجع:     ${header['reference_number']}`);
                        if (header['payment_method'] == "Cash") {
                            $("#number_fund_report_id").html(`رقم الصندوق:     ${header['fund']}`);
                            $("#name_fund_report_id").html(`اسم الصندوق:     ${header['fund__arabic_name']}`);
                            $("#type_py_report").html("نقداٌ");
                        } else {
                            $("#number_fund_report_id").html(`رقم البنك:     ${header['bank']}`);
                            $("#name_fund_report_id").html(`اسم البنك:     ${header['bank__arabic_name']}`);
                            $("#type_py_report").html("أجل");
                        }

                        Get_Text_prise(parseFloat(header['amount']).toFixed(0), header["daily_entry__detailsdailyentry__currency__name_ar"]);
                        $("#number_ammount_report").html(`${header['amount']} ${header['daily_entry__detailsdailyentry__currency__currency_code']}`);



                        let table = document.createElement('table');
                        let thead = document.createElement('thead');
                        let tbody = document.createElement('tbody');
                        let row_1 = document.createElement('tr');
                        let heading_1 = document.createElement('th');
                        let heading_2 = document.createElement('th');
                        let heading_4 = document.createElement('th');
                        let heading_5 = document.createElement('th');
                        let heading_6 = document.createElement('th');
                        let heading_7 = document.createElement('th');
                        let heading_8 = document.createElement('th');
                        table.id = "table_report_";
                        heading_1.innerHTML = "رقم الحساب";
                        heading_2.innerHTML = "العملة";
                        heading_4.innerHTML = "اسم الحساب";
                        heading_5.innerHTML = "البيان";
                        heading_6.innerHTML = "المبلغ";
                        heading_7.innerHTML = "رقم المركز";

                        row_1.appendChild(heading_1);
                        row_1.appendChild(heading_2);
                        row_1.appendChild(heading_4);
                        row_1.appendChild(heading_5);
                        row_1.appendChild(heading_6);
                        if(res[0]['cost_center__name_ar'])
                            row_1.appendChild(heading_7);
                        
                            thead.appendChild(row_1);


                        // Creating and adding data to second row of the table
                        let row_2, row_2_data_1, row_2_data_2, row_2_data_3, row_2_data_4, row_2_data_5, row_2_data_6, row_2_data_7;
                        if (header['bond_type'] == '2') {

                            add_rows_table_report("credit");
                        }
                        if (header['bond_type'] == '1') {
                            add_rows_table_report("debit");

                        }

                        // Creating and adding data to third row of the table


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
                        
                        
                        function add_rows_table_report(type = 'credit') {
                            for (var i = 0; i < res.length; i++) {

                                if (parseFloat(res[i][type]) > 0) {
                                    row_2 = document.createElement('tr');
                                    row_2_data_1 = document.createElement('td');
                                    row_2_data_2 = document.createElement('td');
                                    row_2_data_4 = document.createElement('td');
                                    row_2_data_5 = document.createElement('td');
                                    row_2_data_6 = document.createElement('td');
                                    row_2_data_1.innerHTML = res[i]['account__number'];
                                    row_2_data_2.innerHTML = res[i]['currency__name_ar'];
                                    row_2_data_4.innerHTML = res[i]['account__arabic_name'];
                                    row_2_data_5.innerHTML = header['note'];
                                    if(res[i]['currency__currency_type']=="foreign")
                                    row_2_data_6.innerHTML = res[i]['currency__currency_code']+" "+parseFloat(res[i][type])/parseFloat(res[i]["exchange_rate"]);
                                    else
                                    row_2_data_6.innerHTML =res[i]['currency__currency_code']+" "+res[i][type];
                                    
                                    row_2.appendChild(row_2_data_1);
                                    row_2.appendChild(row_2_data_2);
                                    row_2.appendChild(row_2_data_4);
                                    row_2.appendChild(row_2_data_5);
                                    row_2.appendChild(row_2_data_6);
                                    if(res[i]['cost_center__name_ar'])
                                    {
                                        row_2_data_7 = document.createElement('td');
                                        row_2_data_7.innerHTML = res[i]['cost_center__name_ar'];
                                        row_2.appendChild(row_2_data_7);
                                    }
                                    tbody.appendChild(row_2);
                                }
                            }
                        }
                    }
                });
            },
            error: function(data) {
                alert(data.status);

            }
        })

    }




    // =============================================

    function create_Entry_report(id_row) {
        $.ajax({
            method: "get", // initialize an AJAX request
            dataType: "JSON",
            url: "/get_footer/",
            data: { "id": 1 },

            success: function(data) {
                let res = JSON.parse(data.data);

                $("#company_report").html(res[0].fields.name_ar);
                $("#phone_number").html(res[0].fields.phone);
                document.getElementById("logo_report").src = data.host + res[0].fields.image;



                $.ajax({
                    url: urls_,

                    data: {
                        "id": id_row,
                        method: "get"
                    },
                    success: function(data) {
                        let res = data.data;
                        let header = data.header[0];
                        $("#name_report_Ar").html("قيد يومي");
                        $("#name_report_En").html("DALIY ENTRY");

                        $("#number_report_id").html(`رقم السند:     ${header['number']}`);
                        $("#date_report").html(`تاريخ السند:     ${header['operation_date']}`);
                        $("#number_fund_report_id").html(`رقم الفرع:     ${header['branch__id']}`);
                        $("#name_fund_report_id").html(`اسم الفرع:     ${header['branch__name_ar']}`);
                        $("#number_ammount_report").html(`${header['name_daily_ar']}`);



                        let table = document.createElement('table');
                        let thead = document.createElement('thead');
                        let tbody = document.createElement('tbody');
                        let row_1 = document.createElement('tr');
                        let heading_1 = document.createElement('th');
                        let heading_2 = document.createElement('th');
                        let heading_3 = document.createElement('th');
                        let heading_4 = document.createElement('th');
                        let heading_5 = document.createElement('th');
                        let heading_6 = document.createElement('th');
                        table.id = "table_report_";
                        heading_1.innerHTML = "رقم الحساب";
                        heading_2.innerHTML = "اسم الحساب";
                        heading_3.innerHTML = "العملة";
                        heading_4.innerHTML = "البيان";
                        heading_5.innerHTML = "مدين";
                        heading_6.innerHTML = "دائن";

                        row_1.appendChild(heading_1);
                        row_1.appendChild(heading_2);
                        row_1.appendChild(heading_3);
                        row_1.appendChild(heading_4);
                        row_1.appendChild(heading_5);
                        row_1.appendChild(heading_6);
                        thead.appendChild(row_1);


                        // Creating and adding data to second row of the table
                        let row_2, row_2_data_1, row_2_data_2, row_2_data_3, row_2_data_4, row_2_data_5, row_2_data_6;
                        let amount_total=0
                        for (var i = 0; i < res.length; i++) {

                            row_2 = document.createElement('tr');
                            row_2_data_1 = document.createElement('td');
                            row_2_data_2 = document.createElement('td');
                            row_2_data_3 = document.createElement('td');
                            row_2_data_4 = document.createElement('td');
                            row_2_data_5 = document.createElement('td');
                            row_2_data_6 = document.createElement('td');

                            row_2_data_1.innerHTML = res[i]['account__number'];
                            row_2_data_2.innerHTML = res[i]['account__arabic_name'];
                            row_2_data_3.innerHTML = res[i]['currency__name_ar'];
                            row_2_data_4.innerHTML = res[i]['note'];
                            if(res[i]['currency__currency_type']=="foreign"){
                                if(parseFloat(res[i]["debit"])>0)
                                    row_2_data_5.innerHTML = res[i]['currency__currency_code']+" "+parseFloat(res[i]["debit"])/parseFloat(res[i]["exchange_rate"]);
                                else
                                    row_2_data_5.innerHTML = res[i]['currency__currency_code']+" 0";
                                if(parseFloat(res[i]["credit"])>0)
                                    row_2_data_6.innerHTML = res[i]['currency__currency_code']+" "+parseFloat(res[i]["credit"])/parseFloat(res[i]["exchange_rate"]);
                                else
                                    row_2_data_6.innerHTML = res[i]['currency__currency_code']+" 0";
                            }
                            else
                            {
                                if(parseFloat(res[i]["debit"])>0)
                                    row_2_data_5.innerHTML = res[i]['currency__currency_code']+" "+res[i]['debit'];
                                else
                                    row_2_data_5.innerHTML = res[i]['currency__currency_code']+" 0";  

                                if(parseFloat(res[i]["credit"])>0)
                                    row_2_data_6.innerHTML = res[i]['currency__currency_code']+" "+res[i]["credit"];
                                else
                                    row_2_data_6.innerHTML = res[i]['currency__currency_code']+" 0";
                            }
                            amount_total+=parseFloat(res[i]['debit'])

                            row_2.appendChild(row_2_data_1);
                            row_2.appendChild(row_2_data_2);
                            row_2.appendChild(row_2_data_3);
                            row_2.appendChild(row_2_data_4);
                            row_2.appendChild(row_2_data_5);
                            row_2.appendChild(row_2_data_6);
                            tbody.appendChild(row_2);
                        }
                        // Get_Text_prise(parseFloat(amount_total).toFixed(2),header["daily_entry__detailsdailyentry__currency__name_ar"]);
                        

                        // Creating and adding data to third row of the table


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
            },
            error: function(data) {
                alert(data.status);

            }
        })

    }





    // $(document).on('click', '#btn_print', function(e) {
    //     e.preventDefault();
    //     if ($("#id_id").val()) {
    //         create_profile_repo(String($("#id_bond_number").val()), "bond_number");
    //         $("#ReportAfterSave").modal('show');

    //     } else {
    //         alert("يجب إختيار السند المراد طباعتة");

    //     }
    // });



