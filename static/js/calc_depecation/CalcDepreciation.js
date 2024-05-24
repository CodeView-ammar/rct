function get_max_number_depreciation(asset_id){
    $.ajax({
        method: "GET",
        url:url_get_max_number_depreciation,
        data: {
            "asset_id":asset_id
         }, // data sent with the delete request
         beforeSend: function(xhr) {
            xhr.setRequestHeader('X-CSRFToken', csrf); // إضافة رمز CSRF إلى رأس الطلب
          },
        success: function(data) {
          if(data.status==1){
              
                  $("#id_number").val(data.max_number);
                  $("#id_month").val(data.max_number);
            
        }
          },
        error: function(data) {
            alert('error in onchange');
        }
    });
  
  };
  function get_data_asset(asset_id) {

      
    $.ajax({
      url: url_get_data_asset,
      type: 'GET',
      data: {
        asset_id: asset_id,
        csrfmiddlewaretoken: csrf // إضافة رمز CSRF كمعرّف للطلب
      },
      success: function(response) {
          if (response.status === 1) {
          var data = response.data;
            console.log(data);
          // تعبئة الحقول بالبيانات المستلمة
          if (data.depreciation_method == 'straight_line') 
            $('#AssetDeprecationMethod').prop('selectedIndex', 1);
           else 
            $('#AssetDeprecationMethod').prop('selectedIndex', 2);
            
        $('#AssetDeprecationMethod').trigger('change');

        $('#id_period').val(data.period).attr("readonly",true);
        $("#id_scrap_value").val(data.scrap_value)
        $("#AssetDeprecationPercentage").val(parseInt(data.depreciation_rate));
        $("#id_purchase_price").val(data.purchase_price).attr("readonly", true);
        $("#total_depreciation").val(data.total_depreciation).attr("readonly", true);
        $('#id_accumulated_depreciation_account').val(data.accumulated_depreciation_account);
        $('#id_depreciation_expenses_account').val(data.depreciation_expenses_account);
        $('#id_end_date').val(data.end_date);
        $("#id_production_age").val(data.production_age);
        createTableDepreciation(asset_id);
        if(data.depreciation_status==1)
            $("#id_depreciation_status").css('background-color','green').css("color","white");
        if(data.depreciation_status==2)
            $("#id_depreciation_status").css('background-color','red').css("color","white");
        if(data.depreciation_status==3)
            $("#id_depreciation_status").css('background-color','blue').css("color","white");
        $("#id_depreciation_status").val(data.depreciation_status).css("height","auto");
        
        var purchasePrice = parseFloat(data.purchase_price);
        var totalDepreciation = parseFloat(data.total_depreciation);
            if(totalDepreciation>0){
                purchasePrice-=totalDepreciation;
            }
    var depreciationValue = parseFloat(data.scrap_value);
    if(depreciationValue>0){
        purchasePrice-=depreciationValue;
      }
      var accumulatedDepreciation = purchasePrice;
        if($('#AssetDeprecationMethod').val()==1){
          $("#total_accumulated_depreciation").val( accumulatedDepreciation).attr("readonly", true);
          calc_fixed_amount();
          
        }else
          calculate_percent();
        } else {
        }
      },
      error: function(xhr, status, error) {
        // معالجة الخطأ هنا
      }
    });

    
  }
  
  
  function getAsset(element) {
    get_max_number_depreciation(element.value)
    get_data_asset(element.value);
}
  


  // run method
  $(document).ready(function(){
          
    let form_id_='#asset_form';
    $(document).on('submit',form_id_,function(e){
        // $('#submit-button').button('loading');
        e.preventDefault();
        
        
     
        if($("#total_depreciation").val()=="0" && $("#total_accumulated_depreciation").val()=="0")
            {
                alert_message("هذا الاصل مهلك","alert alert-danger",0);
                setTimeout(function() {
                    func_btn_new("1");
                    func_btn_save("1");
                }, 2010);
                return false;}
        $.ajax({
                url: $(this).attr('action'),
                data: $(this).serialize(),
                method: 'post',
                success: function (data) {
                    $('span[class="text-danger"]').remove();
                    if(data.status==1){
                        $(form_id_)[0].reset();
                        
                        alert_message(data.message.message,data.message.class,0);
                        
                        
                        table.ajax.reload();
                        if($('#AssetDeprecationMethod').val()==1)
                          calc_fixed_amount();
                          else
                          calculate_percent();
                        setTimeout(function() {
                            func_btn_new("1");
                            func_btn_save("1");
                        }, 2010); 
                        $('.modal-backdrop').remove(); 
                    }
                    else if(data.status==2){
                        if(isNaN(data.depreciation_status))
                            $("#id_depreciation_status").css('background-color','red').css("color","white").val(2);
                        alert_message(data.message.message,data.message.class);
                        setTimeout(function() {
                            func_btn_new("1");
                            func_btn_save("1");
                        }, 2010);
                    }
                    else if(data.status==0){
                        let error=JSON.parse(data.error);
                        $.each(error,function(i,value){
                            let message_account="";
                            let div='<span class="text-danger">';
                            $.each(value,function(j,message){
                                div+=`- ${message.message}<br>`;
                                if(i=="arabic_name")
                                message_account=message.message;
                            });
                            if(i=="arabic_name"){
                            $(`#div_id_name`).append(`<span class="text-danger"> - ${message_account}<br>`);
                            }
                            $(`#div_id_${i}`).append(div);
                        });
                        setTimeout(function() {
                            func_btn_new("1");
                            func_btn_save("1");
                        }, 2010);
                    }
                },
                error:function(data){

                }
            });
       
    });

      $(document).on('click','.edit_row',function(){
          
          let id_row=$(this).data('id');
          $.ajax({
              url: $(this).data('url'),
              data: {'id':id_row,},
              method: 'get',
              success: function (data) {
                  if(data.status==1){
      
                      let resp=JSON.parse(data.data);
                       $(`input[name="id"]`).val(resp[0].pk);
                       $.each(resp[0].fields,function(i,value){
                           $(`input[name="${i}"]`).val(value);
                           $(`input[name=${i}]`).prop('checked',value);
                           $(`textarea[name=${i}]`).text(value);
                          
                           $(`select[name="${i}"] option`).each(function() {
                              if($(this).val() == value) {
                                  $(this).prop("selected", true);
                              }
                          });
                         
                      });
                      $('#modalLRForm').modal('hide');
                    }
              },
              error:function(data){
              }
          });
      });
      
      $(document).on('click','.delete_row',function(){
         
          if(confirm_delete()){
          let id_row=$(this).data('id');
          $.ajax({
              url: $(this).data('url'),
              data: {
                  'id':id_row,
              },
              method: 'DELETE',
              beforeSend: function (xhr) {
                      xhr.setRequestHeader("X-CSRFToken",csrf);
                  },
              success: function (data) {
                 
                  if(data.status==1){
                      alert_message(data.message.message,data.message.class);
                      table.ajax.reload();
      
                      maxnumber();
      
                  }
               
              },
              error:function(data){
              }
          });
      }
      });

    }); 

    function createTableDepreciation(asset_id) {
        
        $.ajax({
          url: url_get_all_depreciation, 
          data: { 
                "asset_id": asset_id 
            },
          dataType: 'json',
          success: function(response) {
            if (response.status === 1) {
              var table = $('<table>').addClass('my-table');
              var data = response.data;
              var headerRow = $('<tr>');
              for (var key in data[0]) {
                headerRow.append($('<th>').text(key));
              }
              table.append(headerRow);
      
              for (var i = 0; i < data.length; i++) {
                var rowData = data[i];
                var row = $('<tr>');
                for (var key in rowData) {
                  row.append($('<td>').text(rowData[key]));
                }
                table.append(row);
              }
      
              $('#tablecontent').empty().append(table);
            } else {
              console.log(response.message);
            }
          },
          error: function(xhr, status, error) {
            console.log(error);
          }
        });
      }
      
    
  
$("#AssetDeprecationMethod").change(function () {
    if (!$(this).val()) {
        $(`
        #production_age_settings,
        #total_accumulated_depreciation_settings,
        #end_date_settings,
        #total_depreciation_settings,
        #accumulated_depreciation_settings,
        #deprecation_fixed_unit_settings, 
        #deprecation_percentage_settings, 
        #deprecation_amount_settings, 
        #month_deprecation_amount_settings, 
        #deprecation_end_date_div`).hide(200);
        
        $("#id_period, #AssetDeprecationPercentage, #id_scrap_value").attr('required', false);
      } else if ($(this).val() == 1) {
        $(`
        #production_age_settings,
        #total_accumulated_depreciation_settings,
        #end_date_settings,
        #total_depreciation_settings,
        #accumulated_depreciation_settings,
        #deprecation_fixed_unit_settings, 
        #deprecation_percentage_settings, 
        #deprecation_amount_settings, 
        #month_deprecation_amount_settings, 
        #deprecation_end_date_div`).show(200);
        $("#deprecation_percentage_settings").hide(200);
        $("#id_period, #deprecation_percentage_settings").attr('required', false);
      } else {

        $(`
        #production_age_settings,
        #total_accumulated_depreciation_settings,
        #end_date_settings,
        #total_depreciation_settings,
        #accumulated_depreciation_settings,
        #deprecation_fixed_unit_settings, 
        #deprecation_percentage_settings, 
        #AssetDeprecationPercentage, 
        #deprecation_amount_settings,
        #month_deprecation_amount_settings, 
        #deprecation_end_date_div`).show(200);
        
      }
})


// $("#id_purchase_price,#id_scrap_value,#id_production_age").keyup(function(){
   
//   calc_fixed_amount()
// })

function calc_fixed_amount(){
    let tax1_val = 0
    let tax2_val = 0
   
    let purchase_cost = parseFloat($("#id_purchase_price").val()) - tax1_val - tax2_val
    
    let salvage_value = parseFloat($("#id_scrap_value").val())
    let total_depreciation = parseFloat($("#total_depreciation").val())
    let useful_life = parseFloat($("#id_production_age").val())
    let fixed_amount_val = (purchase_cost)/useful_life
    fixed_amount_val=fixed_amount_val-total_depreciation-salvage_value;
    if(fixed_amount_val < 0)
        fixed_amount_val = 0
    
    $("#total_accumulated_depreciation").val(!isFinite(fixed_amount_val) || isNaN(fixed_amount_val)?0:fixed_amount_val)
}

function calculate_percent(){
  let tax1_val = 0
  let tax2_val = 0
   

    
  let total_asset =parseFloat($("#id_purchase_price").val())-parseFloat($("#total_depreciation").val());
  let total_amount= parseInt($("#AssetDeprecationPercentage").val())/100;
  let total=(total_amount*total_asset).toFixed(0);
  
  $("#id_scrap_value").val(!isFinite(total) || isNaN(total)?0:total)
 
  let purchase_cost = parseFloat($("#id_purchase_price").val()) - tax1_val - tax2_val
  let total_depreciation = parseFloat($("#total_depreciation").val())
  
  let fixed_amount_val = purchase_cost-total_depreciation;
  
  $("#total_accumulated_depreciation").val(!isFinite(fixed_amount_val) || isNaN(fixed_amount_val)?0:fixed_amount_val)
}
