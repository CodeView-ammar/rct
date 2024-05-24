
maxnumber =()=>{

    $.ajax({
        method: "post",
        url:url_max_number,
        data: {
          'csrfmiddlewaretoken': csrf,
            
         }, // data sent with the delete request
        
        success: function(data) {
          var count_number='';
          count_number=data.data.number__max;
          
          if(count_number){
              $("#id_number").val(parseInt(count_number));
          }else
          {
              $("#id_number").val("1");
          }
          },
        error: function(data) {
            alert('error in onchange');
        }
    });
  
  };
  // run method
  // maxnumber();
  $(document).ready(function(){
          
    let form_id_='#asset_form';
    $(document).on('submit',form_id_,function(e){
        // $('#submit-button').button('loading');
        e.preventDefault();
        $.ajax({
                url: $(this).attr('action'),
                data: $(this).serialize(),
                method: 'post',
                success: function (data) {
                    $('span[class="text-danger"]').remove();
                    if(data.status==1){
                        $(form_id_)[0].reset();
                        
                        alert_message(data.message.message,data.message.class,0);
                        $("#id_number").val(data.max_number);
                        
                        table.ajax.reload();
                        
                        $('#modalLRForm').modal('hide');
                        $('.modal-backdrop').remove(); 
                    }
                    else if(data.status==2){
                        
                        alert_message(data.message.message,data.message.class);
                        setTimeout(function() {
                            control_button(true);
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
                            control_button(true);
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

      var combobox = $("#id_depreciation_method");
  
    var depreciationRateField = $("#id_depreciation_rate");
    var id_period=$("#id_period")
    var id_AssetDeprecationInterval=$("#id_AssetDeprecationInterval")
    var id_depreciation_value=$("#id_depreciation_value")
    var id_end_date=$("#id_end_date")
    var purchasePriceField = $("#id_purchase_price");
    var productionAgeField = $("#id_production_age");
    var quantityField = $("#id_quantity");
    var scrapValueField = $("#id_scrap_value");
    var periodField = $("#id_period");
    var depreciationValueField = $("#id_depreciation_value");


function hide_element(){
    depreciationRateField.parent().parent().parent().parent().hide(300);
    id_period.parent().parent().parent().parent().hide(300);
    id_AssetDeprecationInterval.parent().parent().parent().parent().hide(300);
    id_depreciation_value.parent().parent().parent().parent().hide(300);
    id_end_date.parent().parent().parent().parent().hide(300);
    id_period.val(12);
}
hide_element();
combobox.change(function() {
    hide_element();        
    if (combobox.val() === "straight_line") {

        id_period.parent().parent().parent().parent().show(300);
        id_AssetDeprecationInterval.parent().parent().parent().parent().show(300);
        id_depreciation_value.parent().parent().parent().parent().show(300);
        id_end_date.parent().parent().parent().parent().show(300);
            depreciationRateField.val('0');   
            $("#id_total_period").show(300);
        }
        if(combobox.val() === "decreasing_balance") {
            id_period.parent().parent().parent().parent().show(300);
            id_AssetDeprecationInterval.parent().parent().parent().parent().show(300);
            depreciationRateField.parent().parent().parent().parent().show(300);
            id_end_date.parent().parent().parent().parent().show(300);
            $("#id_total_period").hide(300);
            
            depreciationValueField.val("0");
                $("#id_depreciation_rate").val(calculateResult($("#id_production_age").val()));
        }
      
    });
    
function get_currency_info_(id_){
            $.ajax({
          url: url_get_currency_info,
          method: "GET",
          data: { "id": ""+id_ },
          success: function(response) {
            
                 var currency_value= JSON.parse(response.data);
                 if(id_==0){
                     $("#id_Currency").val(currency_value[0]["pk"])             
                    }
                currency_value=currency_value[0]["fields"];
                if(currency_value['currency_type'] === "local"){
                    $("#id_exchange_rate").val(1)
                    $("#id_exchange_rate").attr("readonly", true);
                }else{
                    $("#id_exchange_rate").attr("readonly", false);
                    $("#id_exchange_rate").val(currency_value['exchange_rate']);
                    }
        },
          error: function(xhr, status, error) {
            console.log(error);
          }
      });  
    }
$("#id_Currency").change(function(){
    
        get_currency_info_($(this).val());
          
})
$("#btn_new").click(function(){
    setTimeout(function() {
        get_currency_info_(0);
    }, 2010);   
})

scrapValueField.attr("step",1).attr("min",0); 
periodField.attr("step",1).attr("min",1)
purchasePriceField.attr("step",1).attr("min",1);
productionAgeField.attr("step",1).attr("min",1)
quantityField.attr("step",1).attr("min",1)
depreciationRateField.attr("step",1).attr("min",0)

    $("#id_tax_account,#id_tax_account2").change(function(){// this becus use combobox
        calc_fixed_amount()
        calcd()  
    })
    
    $("#id_purchase_price,#id_scrap_value,#id_production_age,#id_period").keyup(function(){
        if($("#id_scrap_value").val()===""){
            $("#id_scrap_value").val("0");
        }
        if(combobox.val() === "decreasing_balance")
        {
            $("#id_depreciation_rate").val(calculateResult($("#id_production_age").val()));
        }
        calc_fixed_amount()
        calcd()  
    })
    
    function calc_fixed_amount() {
        let tax1_val = 0;
        let tax2_val = 0;

        
        // Calculate tax value for inclusive taxes only
        if ($("#id_tax_account").val()) {
            let tax1_rate = parseFloat($("#id_tax_account option:selected").data('tax_rate'));

            tax1_val = $("#id_purchase_price").val() - ($("#id_purchase_price").val() / (1 + (tax1_rate / 100)));
        }
        
        if ($("#id_tax_account2").val()) {
            let tax2_rate = parseFloat($("#id_tax_account option:selected").data('tax_rate'));
            tax2_val = $("#id_purchase_price").val() - ($("#id_purchase_price").val() / (1 + (tax2_rate / 100)));
        }
        
        let purchase_cost = parseFloat($("#id_purchase_price").val()) - tax1_val - tax2_val;
        let salvage_value = parseFloat($("#id_scrap_value").val());
        let useful_life = parseFloat($("#id_production_age").val());
        
        let fixed_amount_val = (purchase_cost - salvage_value) / useful_life;
        fixed_amount_val = fixed_amount_val.toFixed(2); 
        if (fixed_amount_val < 0) {
            fixed_amount_val = 0;
        }
        
        $("#id_depreciation_value").val(!isFinite(fixed_amount_val) || isNaN(fixed_amount_val) ? 0 : fixed_amount_val);
    }
    
    
  });

  function calcd() {
    var value1 = parseInt($("#id_period").val());
    var value2 = parseFloat($("#id_depreciation_value").val());
    var result = 0;

    if (!isNaN(value1) && !isNaN(value2) && value1 !== 0) {
        result = (value2 / value1).toFixed(2);
    }

    $("#id_total_period").val(result);
}

  $(document).ready(function() {
    function controll_model(id_row,id_body){
      $(id_row).click(function() {
        $(id_body).toggle(300);
      var expand_less = $(this).find(".expand_less");
      var expand_more = $(this).find(".expand_more");
      
      if (expand_more.hasClass("hidden")) {
        expand_more.removeClass("hidden");
      } else {
        expand_more.addClass("hidden");
      }  
      
      if (expand_less.hasClass("hidden")) {
        expand_less.removeClass("hidden");
      } else {
        expand_less.addClass("hidden");
      }
  
    });}
    controll_model("#detils_purch","#section-body-purchase");
    controll_model("#id_add_account","#section-body-account");
    $("#id_add_account").click(function() {
      if ($("#id_main_account").parent().parent().parent().hasClass("hidden")) {
        $("#id_main_account").parent().parent().parent().removeClass("hidden");
        $("#id_main_account").attr("required",true)
        $("#id_depreciation_expense_account,#id_main_account_asset,#id_accumulated_depreciation_account").attr("required",false)

        $("#id_depreciation_expense_account_manul").prop('required',false);
        $("#id_main_account_asset_manul").prop('required',false);
        $("#id_accumulated_depreciation_account_manul").prop('required',false);
        
        
      } else {
        $("#id_main_account").parent().parent().parent().addClass("hidden");
        $("#id_depreciation_expense_account,#id_main_account_asset,#id_accumulated_depreciation_account").attr("required",true)
        // $("#id_main_account").attr("required",false)
        $("#id_main_account").removeAttr('required');
  
  
        // $("#id_depreciation_expense_account_manul").attr("required",true);
        $("#id_depreciation_expense_account_manul").prop('required',true);
        $("#id_main_account_asset_manul").prop('required',true);
        $("#id_accumulated_depreciation_account_manul").prop('required',true);
        

      }  
      
  })
  });
  

  function calculateResult(useful_life) {
    var result=0;
    if(useful_life==="1")
        result = 100
    else
    {
        result = (1/useful_life * 100);
        result=result*2
    }
    return result;
  }
  // ---------------------------------
  //-------------------------

  

  