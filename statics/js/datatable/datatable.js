
$(document).ready(function() {
    let table = $('#datatable_list').DataTable( {
        "sAjaxSource": url,
      
        responsive: true
    } );
} );
// $(document).ready(function() {

    // let table = $('.datatable_list').DataTable({
    //     "aaSorting": [],
    //     // "pageLength": 5,
    //     "searching": false,
    //     // "bProcessing": true,
    //     // "bServerSide": true,
    //     "sAjaxSource": url,
    //     // "language": lang,
    //     // "pagingType": "full_numbers",
    //     "bPaginate": false,
    //     "bLengthChange": false,
    //     "bFilter": true,
    //     "bInfo": false,
    //     "bAutoWidth": false,

    //     destroy: true,
    //     rowReorder: {
    //         selector: 'td:nth-child(2)'
    //     },
    //     responsive: true
    // });
// });