$(document).on('click', '#btn_print', function(e) {
    e.preventDefault();
    if($("#id_invoice1").val()){
        
        $("#ReportAfterSave").modal('show');
        create_profile_repo($("#id_invoice1").val());
    
    }else if($("#id_invoice_r").val()){
        $("#ReportAfterSave").modal('show');
        create_profile_repo($("#id_invoice_r").val());

    }
    else{
        alert("يجب إختيار فاتورة المراد طباعتة");

    }
});

function create_profile_repo(id_row){

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
              url: get_master_report,
              
              data: {
                "id":id_row,
                method: "get"
                },
                success: function (data) {
                    let res = JSON.parse(data.data);
                    let ide=data.ide;
                    let header = data.header;
                    res = res[0];
                    if(ide=="return"){
                        $("#name_report_Ar").html("فــاتورة مردود مشتريات");
                        $("#name_report_En").html("PURCHASES BILL RETURN");
                        
                    }else{
                        $("#name_report_Ar").html("فــاتورة مشتريات");
                        $("#name_report_En").html("PURCHASES BILL");
                            
                    }

                    $("#number_R").html(`رقم فاتورة:     ${res['code']}`);
                    $("#date_bill_R").html(`تاريخ فاتورة:     ${res['date']}`);
                    $("#reference_R").html(`المرجع:     ${res['reference_number']}`);
                    $("#customer_data_R").html(`${res['supplir__arabic_name']}`);
                    $("#branch_R").html(`الفرع :${res['branch__name_ar']}`);
                    
                    $("#total_R").html(res['total_amount']);
                    
                    $("#burdens_taxes_R").html(res['tax']);
                    
                    $("#final_total_R").html(res['total_amount']-res['tax']);
                    
                    $("#discount_presentg_R").html(res['discount_rate']);
                    
                    $("#discount_R").html(res['discount']);
                    
                    $("#discount_item_R").html(res['discount_item']);
                    
                    $("#statement_R").html(res['statement']);
                    
                    $("#reference_R").html(res['reference_number']);
                    
                    
                    
                    
                    $("#Stor_R").html(`المخزن :${header[0]['store__name']}`);
                    console.log(res['payment_method']);
                    if(res['payment_method']=="1"){
                        $("#number_fund_report_id").html(`رقم الصندوق:     ${res['fund__number']}`);
                        $("#name_fund_report_id").html(`اسم الصندوق:     ${res['fund__arabic_name']}`);
                        $("#type_py_report").html("نقداٌ");
                    }else if(res['payment_method']=="2" || res['payment_method']=="Check"){
                        $("#number_fund_report_id").html(`رقم البنك:     ${res['bank__number']}`);
                        $("#name_fund_report_id").html(`اسم البنك:     ${res['bank__arabic_name']}`);
                        $("#type_py_report").html("أجل");
                    }else if(res['payment_method']=="3"){
                        $("#number_fund_report_id").html(`رقم العميل:     ${res['customer_data__number']}`);
                        $("#name_fund_report_id").html(`اسم العميل:     ${res['customer_data__name_ar']}`);
                        $("#type_py_report").html("دين");
                    }
                    else if(res['payment_method']=="4"){
                        $("#number_fund_report_id").html(`رقم الصندوق:     ${res['fund__number']}`);
                        $("#name_fund_report_id").html(`اسم الصندوق:     ${res['fund__arabic_name']}`);
                        $("#number_fund_report_id").html(`رقم البنك:     ${res['bank__number']}`);
                        $("#name_fund_report_id").html(`اسم البنك:     ${res['bank__arabic_name']}`);
                        
                    }
    
                 
    
                      let table = document.createElement('table');let thead = document.createElement('thead');
                      let tbody = document.createElement('tbody');let row_1 = document.createElement('tr');
                      let heading_2 = document.createElement('th');let heading_3 = document.createElement('th');let heading_4 = document.createElement('th');let heading_5 = document.createElement('th');let heading_6 = document.createElement('th');let heading_7 = document.createElement('th');let heading_8 = document.createElement('th');
                      table.id="table_report_";
                      heading_2.innerHTML = "الصنف";
                      heading_4.innerHTML = "الوحدة";
                      heading_5.innerHTML = "الكمية";
                      heading_6.innerHTML = "المجموع";
                      heading_7.innerHTML = "التخفيض";
                    row_1.appendChild(heading_2);
                    row_1.appendChild(heading_4);
                    row_1.appendChild(heading_5);
                    row_1.appendChild(heading_6);
                    row_1.appendChild(heading_7);
                    thead.appendChild(row_1);
    
    
                    // Creating and adding data to second row of the table
                    let row_2,row_2_data_1,row_2_data_2,row_2_data_3,row_2_data_4,row_2_data_5,row_2_data_6,row_2_data_7;
                    for (var i = 0; i < header.length; i++) {
                            row_2 = document.createElement('tr');
                            row_2_data_2 = document.createElement('td');
                            row_2_data_4 = document.createElement('td');
                            row_2_data_5 = document.createElement('td');
                            row_2_data_6 = document.createElement('td');
                            row_2_data_7 = document.createElement('td');
    
                            row_2_data_2.innerHTML = header[i]['item__name_ar'];
                            row_2_data_4.innerHTML = header[i]['unit__name_ar'];
                            row_2_data_5.innerHTML = header[i]['qty'];
                            row_2_data_6.innerHTML = header[i]["price"]*header[i]['qty'];
                            row_2_data_7.innerHTML = header[i]['discount'];
    
                            row_2.appendChild(row_2_data_2);
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
    
    
    
    