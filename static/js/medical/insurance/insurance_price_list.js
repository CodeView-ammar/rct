$(document).ready(function() {
    // Function to create and append a table row with form elements
    function createTableRow() {
        // نسخ العنصر الأول
        
        // تغيير الكلاسات والـ IDs
        // const saveButtonId = 'saveButton-' + ($('form').length-1 + 1);
        // const newFormClass = 'form-' + ($('form').length-1 + 1);
        // clonedRow.find('form')
        //          .attr('id', newFormId)
        //          .attr('class', newFormClass)
        
        // clonedRow.find("button").attr("id",saveButtonId);
        
        // إضافة العنصر المكرر إلى الجدول
        const firstRow = $('#body_insurance tr:first');
        const clonedRow = firstRow.clone();
        $('#body_insurance').append(clonedRow);
    }
    
    // Create initial table rows (optional)
    createTableRow(); // Add more calls to createTableRow() for additional rows
    createTableRow(); // Add more calls to createTableRow() for additional rows
    $(document).on('click', '.save-Button', function(event) {
        event.preventDefault(); // Prevent default form submission
    
        // Access form elements within the current row (assuming closest 'tr' ancestor)
        var $row = $(this).closest('tr');
        var cashCode = $row.find('.cashCode').val();
        var cashName = $row.find('.cashName').val();
        // ... Access other form elements similarly ...
    
        var formData = {
          cash_code: cashCode,
          cash_name: cashName,
          // ... Add other form data properties ...
        };
    
        // Perform your data processing or submission logic here
        console.log("Form data:", formData);
      });
    
    // Attach click event handler to all dynamically generated save buttons
});

function get_insurance_company(data){
    $.ajax({
        url:url_get_insurance_company,
        data:{"company_id":$(data).val()},
        method: "GET",
        success: function(data){
            let resp = JSON.parse(data.service);
            const firstRow = $('#body_insurance tr:first');
            let clonedRow=firstRow
            $('#body_insurance').html("");
            for(var i = 0; i < data.service_count; i++) {
                 
                clonedRow = firstRow.clone();
                clonedRow.find('.company_id').val(data.company_id);
                clonedRow.find('.cashCode').val(resp[i].fields['number']);
                clonedRow.find('.cashName').val(resp[i].fields['name_a']);
                clonedRow.find('.insuranceCode').val(resp[i].fields['name_a']);
                clonedRow.find('.insuranceName').val(resp[i].fields['name_a']);
                clonedRow.find('.price').val(resp[i].fields['price1']);
                clonedRow.find('.discount').val("0");
                
                clonedRow.find('.selectAll').prop('checked', 1);
                
            $('#body_insurance').append(clonedRow);
        }
        }
    })    
  }
  