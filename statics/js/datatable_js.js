
    table = $('.datatable_list').DataTable({
        "aaSorting": [],
        "pageLength": 10,
        "searching": true,
        "bProcessing": true,
        "bServerSide": true,
        "sAjaxSource": url,
        "language": lang,
        "pagingType": "full_numbers",
        rowReorder: {
            selector: 'td:nth-child(2)'
        },
        responsive: true,
      'columnDefs': [{
         'targets': 0,
         'searchable': false,
         'orderable': false,
        //  'className': 'dt-body-center',
        //  'render': function (data, type, full, meta){
        //     //  return '<input type="checkbox" name="id[]" value="' + $('<div/>').text(data).html() + '">';
        //  }
      }],
    });

 // Handle click on "Select all" control
 $('#example-select-all').on('click', function(){
    
    // Get all rows with search applied
    var rows = table.rows({ 'search': 'applied' }).nodes();
    // Check/uncheck checkboxes for all rows in the table
    $('input[type="checkbox"]', rows).prop('checked', this.checked);
 });

 // Handle click on checkbox to set state of "Select all" control
 $('#example tbody').on('change', 'input[type="checkbox"]', function(){
    // If checkbox is not checked
    if(!this.checked){
       var el = $('#example-select-all').get(0);
       // If "Select all" control is checked and has 'indeterminate' property
       if(el && el.checked && ('indeterminate' in el)){
          // Set visual state of "Select all" control
          // as 'indeterminate'
          el.indeterminate = true;
       }
    }
 });
function dataTable_report(urlandid,data={},url){
 $('#'+urlandid).DataTable({

    
        "aaSorting": [],
        bInfo: false,
        paging: false,
        "pageLength": 100,
        order: [[1, 'desc']],
        "searching": true,
        "bProcessing": true,
        "bServerSide": true,
        "ajax": {
            "url": url,
            "data": data,
        },
        "pagingType": "full_numbers",
        rowReorder: {
            selector: 'td:nth-child(2)'
        },
        responsive: true,
    });

} 


function reload_action() {
    // var originalState = $(".datatable_list1").clone();
    // $(".datatable_list1").replaceWith(originalState);
    table.ajax.reload();
}