function toggleProductsDiv(ge_da) {

    const clickedElement = $(ge_da);
    const productId = clickedElement.data('products');
    const quantity = 1; // Assuming constant quantity addition
    const price = clickedElement.find('.product-price').text();
    const existingItem = $(".orders-list").find("[data-item-id='" + productId + "']");
    if (existingItem.length) {
      // Update existing item quantity and price
      const currentQuantity = parseInt(existingItem.find('.qty-unit').text());
      const newQuantity = currentQuantity + quantity;
      existingItem.find('.qty-unit').text(newQuantity);
      getTotalItem(existingItem);
    } else {
      // Create new list item if product doesn't exist
      const productName = clickedElement.find('.product-name p').text();
      const currency_code = clickedElement.find('.product-currency_code').text();
      const currency_id = clickedElement.find('.product-currency_id').text();
      const unit_id = clickedElement.find('.product-unit_id').text();
      
      const unit = "الوحدة";
      const listItem = $(`
        <li class="order-item ng-star-inserted" onclick="get_Select_item(this)" data-item-id="${productId}">
          <div class="order-item_units">
          <input type="number" class="number-input-qty" min="0" style="width:0;height: 0;  border: none;" />
          <input type="text" class="number-input-price"  style="width:0;height: 0;  border: none;" />
            <em class="qty-unit">${quantity}</em>
            <em id="product-errorqty-${productId}"></em>
            <span class="unit">${unit}</span>
            <span class="item-unit-id hidden">${unit_id}</span>
            </div>
            <div class="order-item_meta">
            <div class="product-name">
              <h4 class="">${productName}</h4>
              <div class="product-name_price"> ${price} </div>
              <div class="item-currency_id hidden"> ${currency_id} </div>
            </div>
            <p class="unit_price"> السعر: <span><em class="price-item-row ">${price}</em><em class="currency_code-item-row">${currency_code}</em></span></p>
            </div>
            </li>
            `);
      clickedElement.find(".number-input-qty").val(quantity)
      clickedElement.find(".number-input-price").val(price)
      $(".orders-list").append(listItem);
    }
    $('.price-item-row').removeClass("blinking");
    $('.qty-unit').removeClass("blinking");
    

    count_item()

    get_Select_item($(".orders-list").find("[data-item-id='" + productId + "']"));

    getTotal()
}

$(document).ready(function() {
    // Assuming you have a button or event to trigger invoice details submission:
    $('#submit-invoice-details-btn').click(function(e) {
        e.preventDefault();
      const invoiceData = []; // Array to store invoice items
      // Iterate over all invoice items
      let currency_id=0
      $('.order-item').each(function() {
        const productId = $(this).data('item-id');
        const unit = parseInt($(this).find('.item-unit-id').text());
        const quantity = parseInt($('.qty-unit', this).text(), 10);
        const price = parseFloat($('.price-item-row', this).text());
        const total = parseFloat($('.product-name_price', this).text());
        currency_id = parseFloat($('.item-currency_id', this).text());
        customer_id = $('#customer_data_main_id').val();
        invoiceData.push({
          item:productId,
          unit:unit,
            quantity:quantity,
            price:price,
            discount_pre_item:0,
            quantity_available:0,
            tax:1,
            tax_rate:15,
            total:total,
            discounted_price:0,
            currency: currency_id,
            customer_id:customer_id,
            
          });
        });
        const final_total = parseFloat($('#total_item').text().match(/(\d+.\d+)/)[0]);
        let id_section=$("#id_section").val();
        $("[id^='product-errorqty-']").html("").css("color", "red");
        $(".orders-list").find("[data-item-id]").css("border", "0px solid");        
      $.ajax({
        url: url_, // Replace with your actual URL
        type: 'POST',
        dataType: 'json',
        data:JSON.stringify(invoiceData),
        data:{"data":JSON.stringify(invoiceData),
        "final_total":final_total,
        "currency_id":currency_id,  
        "id_section":id_section,
      },
        beforeSend: function(xhr) {
          xhr.setRequestHeader("X-CSRFToken", csrf);
      },
        success: function(data) {

          if (data.status==1) {
            // Handle successful submission (e.g., display confirmation message, redirect to payment page)
            alert_message(data.message.message,"","info");
            create_report_casher(data.id);
            $("#print_last_sales").trigger("click");
            remove_all();
          } 
          if(data.status==2) {

            get_Select_item($(".orders-list").find("[data-item-id='" + data.message.item_id + "']"));
            $(".orders-list").find("[data-item-id='" + data.message.item_id + "']").css("border","2px solid red")
            $("#product-errorqty-"+data.message.item_id).html("الكمية المتاحة:"+data.message.storeQty).css("color","red");
            alert_message(data.message.message,"","info");
            // if(data.load!='')
            //   location.href=data.load
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          // Handle general AJAX errors
          console.error('AJAX error:', textStatus, errorThrown);
        }
      });
    
    });
  });
    
getTotal();
$("#count-item").text(0)

function getTotal() {
let total = 0;

$('.orders-list .product-name_price').each(function() {
    const price = parseFloat($(this).text());
    total += price;
});
$("#total_item").html($('.product-currency_code').first().text()+"&nbsp;"+total.toFixed(2));

}
$("#print_last_sales").on('click', function(e){
      var iframe = document.getElementById('invoice-preview');
      iframe.src = url_get_Report_sales_bill;
      iframe.onload = function() {
          var iframeContent = iframe.contentDocument || iframe.contentWindow.document;
          var targetElement = $("#booking").html();
          iframeContent.body.id="body-print";
          iframeContent.body.style.direction = "rtl";
          iframeContent.body.innerHTML =  targetElement;
  }});


function getTotalItem(obj_product="") {
    let $products = "" // تحديد جميع العناصر ذات الفئة "product-item"
    if(obj_product!="")    
        $products = obj_product; // تحديد جميع العناصر ذات الفئة "product-item"
    else
        $products = $('.order-item');
    // حساب الإجمالي لكل صنف
    $products.each(function() {
        const existingItem = $(this);
        const currentQuantity = parseInt(existingItem.find('.qty-unit').text());
        const price = parseFloat(existingItem.find('.price-item-row').text());
        let newPrice=0;
        newPrice = (currentQuantity * parseFloat(price)).toFixed(2);
        existingItem.find('.product-name_price').text(newPrice);
    });
    
}


function get_Select_item(ge_da) {
  $(ge_da).addClass('selected'); // إضافة فئة "selected" عند التحديد
  $(ge_da).siblings().removeClass('selected'); // إزالة فئة "selected" من العناصر الأخرى
  $(ge_da).css('background-color', '#f0f8ff');
  $(ge_da).siblings().css('background-color', '#ffffff');
  
  if ($("#price-select").hasClass("selected-mode")) {
    $(ge_da).find('.price-item-row').addClass("blinking");
    $(ge_da).find('.qty-unit').removeClass("blinking");

    $(ge_da).find(".number-input-price").focus();
    $(".number-char").on('click', function(){
      $(ge_da).find(".number-input-price").val($(ge_da).find(".number-input-price").val()+$(this).text())
      
      $(ge_da).find(".number-input-price").focus();
      var value = $(ge_da).find(".number-input-price").val();
      var pattern = /^\d+(\.\d{1,2})?$/; // تعبير الاستعلام للتحقق من القيم المالية
      if (!pattern.test(value)) {
          $(ge_da).find(".number-input-price").val(""); // إعادة الحقل إلى القيمة الفارغة إذا كانت القيمة غير صالحة
      }
      const number = parseInt($(ge_da).find(".number-input-price").val());
      if (number > 0)
          $(ge_da).find(".price-item-row").text(number);
      else
      $(ge_da).find(".price-item-row").text(0);
        getTotalItem();
        getTotal();
      });
    $(ge_da).find(".number-input-price").on('keyup input change', function() {
          var value = $(this).val();
          var pattern = /^\d+(\.\d{1,2})?$/; // تعبير الاستعلام للتحقق من القيم المالية
          if (!pattern.test(value)) {
              $(this).val(""); // إعادة الحقل إلى القيمة الفارغة إذا كانت القيمة غير صالحة
          }
          const number = parseInt($(this).val());
          if (number > 0)
              $(ge_da).find(".price-item-row").text(number);
          else
          $(ge_da).find(".price-item-row").text(0);
            getTotalItem();
            getTotal();
          });
        } else {
          $(ge_da).find('.price-item-row').removeClass("blinking");
          $(ge_da).find('.qty-unit').addClass("blinking");

      $(ge_da).find(".number-input-qty").focus();
      $(ge_da).find(".number-input-qty").on('keyup', function() {
          const number = parseInt($(this).val());
          if (number > 0)
              $(ge_da).find(".qty-unit").text(number);
          
          getTotalItem();
          getTotal();
      });
  }
}
function get_Select_button(ge_da){
    $(ge_da).addClass('selected-mode'); 
    $(ge_da).siblings().removeClass('selected-mode');
}
function remove_all(){
  $(".orders-list").find(".order-item").remove();
  getTotalItem();
  getTotal();
  count_item();
}

$("#remove_item").on('click', function() {
    $(".orders-list").find(".selected").remove();
    getTotalItem();
    getTotal();
    count_item();
})

function count_item() {
    $("#count-item").text("0");
    $('.order-item').each(function() {
        $("#count-item").text(parseInt($("#count-item").text())+1);  
    })
}
$("#qty-btn").on("click", function() {
  enter_number();
  const productIds = $('.order-item').filter(function() {
    return $(this).hasClass('selected'); // Filter based on selected class (optional)
  }).map(function() {
    return $(this).data('itemId'); // Extract IDs from selected elements
  })
  get_Select_item($(".orders-list").find("[data-item-id='" + productIds[0] + "']"));
});
$("#price-select").on("click", function() {
    if ($(".order-item").hasClass('selected')) {
        // الكود هنا يُنفذ إذا كان العنصر يحتوي على الفئة "active"
        $("#control-price").removeClass('hidden').addClass("d-flex");  
        $(".main-items-table").addClass("hidden");
        get_Select_button(this);
        const productIds = $('.order-item').filter(function() {
          return $(this).hasClass('selected'); // Filter based on selected class (optional)
        }).map(function() {
          return $(this).data('itemId'); // Extract IDs from selected elements
        })
        get_Select_item($(".orders-list").find("[data-item-id='" + productIds[0] + "']"));
    
        
    }
});

function enter_number(){
    $("#control-price").removeClass('d-flex').addClass("hidden");  
    $(".main-items-table").removeClass("hidden");  
    getTotalItem();
    getTotal();
    get_Select_button($("#qty-btn"));

    
}

$(document).ready(function() {
    $('#number-input').on('keyup', function() {
      const number = parseInt($(this).val(), 10);
      $('#count-item').text(number);
    });
});
function togglemenu(this_){
  if($(this_).hasClass("clearfix")){
    if($(this_).parent().hasClass("open"))
    $(this_).parent().removeClass("open")
else
    $(this_).parent().addClass("open")
    
    return false
  }
  if($(".dropdown.dropdown-filter.input-group-addon").hasClass("open"))
      $(".dropdown.dropdown-filter.input-group-addon").removeClass("open")
  else
      $(".dropdown.dropdown-filter.input-group-addon").addClass("open")
}
$(document).ready(function() {
  $(".dropdown-toggle").click(function() {
    togglemenu(this);
  });

  $(".dropdown-toggle").click(function(event) {
    event.stopPropagation();
    

  });
});

$(".set-customer").on('click', function(){
  if($("#customer_list").hasClass("hidden")){
    $("#customer_list").removeClass("hidden");
    $("#item_list").addClass("hidden");
  }
  $("#search_input").attr("placeholder", "بحث عن عميل");
  $("#search_input").focus();
  $("#search_input").val("");

  $(".dropdown.dropdown-filter.input-group-addon").removeClass("open")
})
$(".search-item").on('click', function(){
  if($("#item_list").hasClass("hidden")){
    $("#customer_list").addClass("hidden");
    $("#item_list").removeClass("hidden");
  }
  $("#search_input").attr("placeholder", "بحث عن منتج");
  $("#search_input").focus();
  $("#search_input").val("");
  $(".dropdown.dropdown-filter.input-group-addon").removeClass("open")
})


  $("#load-more-button").click(function() {
    if(!$("#customer_list").hasClass("hidden")) {
    $.ajax({
      url: url_load_more_customer,
      method: "GET",
      data: {
         "page_number": $("#page_number_customer").text(),
         "search_input": $("#search_input").val().trim(),
        },
      success: function(data) {
        if (data.status === 1) {
          if($("#search_input").val().trim()!=''){
            $("#customer_list").children(":not(.btn-customer)").remove();
  
          }
          const newData = JSON.parse(data.data); // Parse data once

          for (var i = 0; i < newData.length; i++) {
            const newCustomer = `
              <div _ngcontent-c8="" class="col-sm-12 col-md-6 col-lg-4 customer-item-col ng-star-inserted">
                <div _ngcontent-c8="" class="customer-item customer-button">
                  <div _ngcontent-c8="" onclick="customer_item_body(this)" class="customer-item-body">
                    <h5 _ngcontent-c8="" data-id="${newData[i].pk}" id="customer_${newData[i].pk}" title="${newData[i].fields["name_ar"]}">${newData[i].fields["name_ar"]}</h5>
                    <p id="${newData[i].pk}">${newData[i].pk}</p>
                  </div>
                </div>
              </div>
            `;

            $("#customer_list").append(newCustomer);
          }

          $("#page_number_customer").text(parseInt($("#page_number_customer").text()) + 1);
        }
      }
    });
  }else{
    $.ajax({
      url: url_load_more_item,
      method: "GET",
      data: { "page_number": $("#page_number_item").text(),"search_input": $("#search_input").val().trim() },
      success: function(data) {
        if (data.status === 1) {
          if($("#search_input").val().trim()!=''){
            $("#item_list").empty();
  
          }
        const newData = JSON.parse(data.data); // Parse data once
        const Item_Unit = JSON.parse(data.Item_Unit); // Parse data once
        const itempricing = JSON.parse(data.itempricing); // Parse data once
        const currency_code = data.currency_code // Parse data once
        
        
        for (var i = 0; i < newData.length; i++) {
          let itemunit_set_unit_id='';
          let itemunit_set_package='';
          let itempricing_set_pricing='';
          let itempricingset_currency='';
          for(var j = 0; j < Item_Unit.length; j++) {
            if(Item_Unit[j].fields['item']==newData[i].pk)
            {if(Item_Unit[j].fields['is_primary']) {

               
              itemunit_set_unit_id= Item_Unit[j].fields['unit'];
              itemunit_set_package= Item_Unit[j].fields['package'];
              for(var j = 0; j < itempricing.length; j++) {
                if(itempricing[j].fields['item']==newData[i].pk)
                {
    
                   
                  itempricing_set_pricing= itempricing[j].fields['price'];
                  itempricingset_currency= itempricing[j].fields['currency'];
                  
                }
              }
            }
          }
          }
          const newItem = `
            <span _ngcontent-c14="" class="product ng-star-inserted" onclick="toggleProductsDiv(this)" tabindex="0" data-products="${newData[i].pk}">
                                        <div _ngcontent-c14="" _nghost-c13="">
                                            <div _ngcontent-c13="" class="Product-img ng-star-inserted">
                                                <img _ngcontent-c13="" loading="lazy" src="/media/${newData[i].fields['image']}" alt="${newData[i].fields['name_ar']}">
                                            </div>
                                            <div _ngcontent-c13="" class="product-name">
                                                <p _ngcontent-c13="" class="ng-star-inserted">${newData[i].fields['name_ar']}</p>
                                            </div>
                                            <div _ngcontent-c13="" class="product-unit hidden">
                                            
                                                <p _ngcontent-c13="" class="ng-star-inserted">${itemunit_set_package}</p>
                                            </div>
                                            <div _ngcontent-c13="" class="product-unit_id hidden">
                                                ${itemunit_set_unit_id}
                                            </div>

                                            <div _ngcontent-c13="" class="Product-meta">

                                                 
                                                <span _ngcontent-c13="" class="price-tag ng-star-inserted">
                                                    <p class="product-currency_id hidden">{{ pricing.currency.id}}</p>
                                                    <label class="product-currency_code" unit-id="${itemunit_set_unit_id}">${currency_code}
                                                        
                                                    </label>&nbsp;
                                                    <label class="product-price">${itempricing_set_pricing}</label></span>
                                                <span _ngcontent-c13="" class="info-tag">
                                                    <mat-icon _ngcontent-c13="" class="mat-icon" matlisticon="" role="img" svgicon="information-variant" aria-hidden="true">
                                                        <svg viewBox="0 0 24 24" fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" focusable="false">
                                                            <path
                                                                d="M13.5,4A1.5,1.5 0 0,0 12,5.5A1.5,1.5 0 0,0 13.5,7A1.5,1.5 0 0,0 15,5.5A1.5,1.5 0 0,0 13.5,4M13.14,8.77C11.95,8.87 8.7,11.46 8.7,11.46C8.5,11.61 8.56,11.6 8.72,11.88C8.88,12.15 8.86,12.17 9.05,12.04C9.25,11.91 9.58,11.7 10.13,11.36C12.25,10 10.47,13.14 9.56,18.43C9.2,21.05 11.56,19.7 12.17,19.3C12.77,18.91 14.38,17.8 14.54,17.69C14.76,17.54 14.6,17.42 14.43,17.17C14.31,17 14.19,17.12 14.19,17.12C13.54,17.55 12.35,18.45 12.19,17.88C12,17.31 13.22,13.4 13.89,10.71C14,10.07 14.3,8.67 13.14,8.77Z">
                                                            </path>
                                                        </svg>
                                                    </mat-icon>
                                                </span>
                                            </div>
                                        </div>
                                    </span>
            `;

            $("#item_list").append(newItem);
          }

          $("#page_number_item").text(parseInt($("#page_number_item").text()) + 1);
        }
      }
    });
  }
  });


  $("#search_input").keyup(function(event) {
    if (event.keyCode === 33||event.keyCode === 34||event.keyCode === 16|| event.keyCode >= 37 && event.keyCode <= 40) {
      return false;
    }
    let searchText=$("#search_input").val();
    $("#page_number_item").text("1")
    if($("#customer_list").hasClass("hidden")) {
    $.ajax({
      url: url_load_more_item,
      method: "GET",
      data: { "page_number": $("#page_number_item").text(),"search_input": searchText },
      success: function(data) {
        if (data.status === 1) {
        const newData = JSON.parse(data.data); // Parse data once
        const Item_Unit = JSON.parse(data.Item_Unit); // Parse data once
        const itempricing = JSON.parse(data.itempricing); // Parse data once
        const currency_code = data.currency_code // Parse data once
        
        $("#item_list").empty();
        for (var i = 0; i < newData.length; i++) {
          let itemunit_set_unit_id='';
          let itemunit_set_package='';
          let itempricing_set_pricing='';
          let itempricingset_currency='';
          for(var j = 0; j < Item_Unit.length; j++) {
            if(Item_Unit[j].fields['item']==newData[i].pk)
            {if(Item_Unit[j].fields['is_primary']) {

               
              itemunit_set_unit_id= Item_Unit[j].fields['unit'];
              itemunit_set_package= Item_Unit[j].fields['package'];
              for(var j = 0; j < itempricing.length; j++) {
                if(itempricing[j].fields['item']==newData[i].pk)
                {
    
                   
                  itempricing_set_pricing= itempricing[j].fields['price'];
                  itempricingset_currency= itempricing[j].fields['currency'];
                  
                }
              }
            }
          }
          }
          const newItem = `
            <span _ngcontent-c14="" class="product ng-star-inserted" onclick="toggleProductsDiv(this)" tabindex="0" data-products="${newData[i].pk}">
                                        <div _ngcontent-c14="" _nghost-c13="">
                                            <div _ngcontent-c13="" class="Product-img ng-star-inserted">
                                                <img _ngcontent-c13="" loading="lazy" src="/media/${newData[i].fields['image']}" alt="${newData[i].fields['name_ar']}">
                                            </div>
                                            <div _ngcontent-c13="" class="product-name">
                                                <p _ngcontent-c13="" class="ng-star-inserted">${newData[i].fields['name_ar']}</p>
                                            </div>
                                            <div _ngcontent-c13="" class="product-unit hidden">
                                            
                                                <p _ngcontent-c13="" class="ng-star-inserted">${itemunit_set_package}</p>
                                            </div>
                                            <div _ngcontent-c13="" class="product-unit_id hidden">
                                                ${itemunit_set_unit_id}
                                            </div>

                                            <div _ngcontent-c13="" class="Product-meta">

                                                 
                                                <span _ngcontent-c13="" class="price-tag ng-star-inserted">
                                                    <p class="product-currency_id hidden">{{ pricing.currency.id}}</p>
                                                    <label class="product-currency_code" unit-id="${itemunit_set_unit_id}">${currency_code}
                                                        
                                                    </label>&nbsp;
                                                    <label class="product-price">${itempricing_set_pricing}</label></span>
                                                <span _ngcontent-c13="" class="info-tag">
                                                    <mat-icon _ngcontent-c13="" class="mat-icon" matlisticon="" role="img" svgicon="information-variant" aria-hidden="true">
                                                        <svg viewBox="0 0 24 24" fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" focusable="false">
                                                            <path
                                                                d="M13.5,4A1.5,1.5 0 0,0 12,5.5A1.5,1.5 0 0,0 13.5,7A1.5,1.5 0 0,0 15,5.5A1.5,1.5 0 0,0 13.5,4M13.14,8.77C11.95,8.87 8.7,11.46 8.7,11.46C8.5,11.61 8.56,11.6 8.72,11.88C8.88,12.15 8.86,12.17 9.05,12.04C9.25,11.91 9.58,11.7 10.13,11.36C12.25,10 10.47,13.14 9.56,18.43C9.2,21.05 11.56,19.7 12.17,19.3C12.77,18.91 14.38,17.8 14.54,17.69C14.76,17.54 14.6,17.42 14.43,17.17C14.31,17 14.19,17.12 14.19,17.12C13.54,17.55 12.35,18.45 12.19,17.88C12,17.31 13.22,13.4 13.89,10.71C14,10.07 14.3,8.67 13.14,8.77Z">
                                                            </path>
                                                        </svg>
                                                    </mat-icon>
                                                </span>
                                            </div>
                                        </div>
                                    </span>
            `;

            $("#item_list").append(newItem);
          }

          $("#page_number_item").text(parseInt($("#page_number_item").text()) + 1);
        }else{
      
          $("#item_list").empty();
      }
    }
    });
    }else{
      $.ajax({
        url: url_load_more_customer,
        method: "GET",
        data: { "page_number": $("#page_number_customer").text(),
      "search_input":searchText,
      },
        success: function(data) {
          if (data.status === 1) {
            const newData = JSON.parse(data.data); // Parse data once
            $("#customer_list").children(":not(.btn-customer)").remove();
  
            for (var i = 0; i < newData.length; i++) {
              const newCustomer = `
                <div _ngcontent-c8="" class="col-sm-12 col-md-6 col-lg-4 customer-item-col ng-star-inserted">
                  <div _ngcontent-c8="" class="customer-item customer-button">
                    <div _ngcontent-c8="" onclick="customer_item_body(this)" class="customer-item-body">
                      <h5 _ngcontent-c8="" data-id="${newData[i].pk}" id="customer_${newData[i].pk}" title="${newData[i].fields["name_ar"]}">${newData[i].fields["name_ar"]}</h5>
                      <p id="${newData[i].pk}">${newData[i].pk}</p>
                    </div>
                  </div>
                </div>
              `;
  
              $("#customer_list").append(newCustomer);
            }
  
            $("#page_number_customer").text(parseInt($("#page_number_customer").text()) + 1);
          }else{
          $("#customer_list").children(":not(.btn-customer)").remove();
        }
      }
      });
    }
  });

$(".customer-item-add").on("click", function(e){
  e.preventDefault();
  setTimeout(function() {
    var iframe = document.getElementById('clientAdvancedIframe');
    iframe.src = url_CustomerDataView;

    iframe.onload = function() {
        var iframeContent = iframe.contentDocument || iframe.contentWindow.document;
        iframe.style.height = '470px';

        // Fetch and insert only the form
        const form = iframeContent.querySelector('form');
        iframe.contentDocument.body.innerHTML = ''; // Clear existing content
        iframe.contentDocument.body.appendChild(form);  // Add only the form

        $('#clientAdvancedIframeLoadingPlaceholder').hide();
    };
}, 3100);

$("#ReportAfterSave_").model("show");
});
function customer_item_body(body){
  $(".customer-name").attr("id",$(body).children().data("id"))
  $("#customer_data_main_id").val($(body).children().data("id"))
  $(".customer-name").attr("title",$("#customer_"+$(body).children().data("id")).text())
  $("#customer_data_main_name_ar").text($("#customer_"+$(body).children().data("id")).text());
  $(".search-item").trigger("click");
}
