$(document).on('click', '#btn_print', function(e) {
    e.preventDefault();
    if($("#id_invoice").val()){
        
        $("#ReportAfterSave").modal('show');
        create_profile_repo($("#id_invoice").val());
    
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
                        $("#name_report_Ar").html("امـــر صــــرف مخزني");
                        $("#name_report_En").html("WAREHOUSE RETURN SUPPLY ORDER");
                        $("#incoming_order_type").html("نوع الصرف : "+res['outgoing_order_type__name_ar']);
                        
                        
                    }else{
                        
                        $("#name_report_Ar").html("أمــر تــوريد مــخزني");
                        $("#name_report_En").html("WAREHOUSE SUPPLY ORDER");
                        $("#incoming_order_type").html("نوع التوريد : "+res['incoming_order_type__name_ar']);
                            
                            
                    }
                    $("#number_R").html(`رقم فاتورة:     ${res['code']}`);
                    $("#date_bill_R").html(`تاريخ فاتورة:     ${res['date']}`);
                    $("#reference_R").html(`المرجع:     ${res['reference_number']}`);
                    $("#customer_data_R").html(`${res['account__arabic_name']}`);
                    $("#branch_R").html(`الفرع :${res['branch__name_ar']}`);
                    
                    
                    // $("#burdens_taxes_R").html("القيمة المضافة: "+res['tax']);
                    
                    
                    
                    $("#discount_R").html(res['discount']);
                    
                    $("#discount_item_R").html(res['discount_item']);
                    
                    $("#statement_R").html(res['note']);
                    
                    $("#reference_R").html(res['reference_number']);
                    
                    
                    
                    
                    $("#Stor_R").html(`المخزن :${res['store__name']}`);
                    $("#total_price_R").html(header[0]['total_price']);
    
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
                    for (var i = 0; i < header.length; i++) {
                            row_2 = document.createElement('tr');
                            row_2_data_1 = document.createElement('td');
                            row_2_data_2 = document.createElement('td');
                            // row_2_data_3 = document.createElement('td');
                            row_2_data_4 = document.createElement('td');
                            row_2_data_5 = document.createElement('td');
                            row_2_data_6 = document.createElement('td');
                            row_2_data_7 = document.createElement('td');
    
                            row_2_data_1.innerHTML = header[i]['item__number'];
                            row_2_data_2.innerHTML = header[i]['item__name_ar'];
                            // row_2_data_3.innerHTML = header[i]['expire_date'];
                            row_2_data_4.innerHTML = header[i]['unit__name_ar'];
                            row_2_data_5.innerHTML = header[i]['qty'];
                            row_2_data_6.innerHTML = header[i]["price"];
                            row_2_data_7.innerHTML = header[i]['total_price'];
    
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
    
    
    
    