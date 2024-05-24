function printFunc(id_div) {
    /* 
    [params] => id_div  this pointer id div work get all text and html inside div
    [params] => context_header this pointer get header in print use html
    [params] => context_footer this pointer get footer in print use html

    */
    let qty =0;
   if($("#id_qty").val()==="undefined")
        qty = $("#id_qty").val();
    var divToPrint = document.getElementById(id_div);
    var htmlToPrint = `
        <style > 
            .barcode1 { 
            margin-left: 38%;
            }
        </style>`;


   htmlToPrint += divToPrint.outerHTML;

    newWin = window.open(document.URL, '_blank', 'location=yes,height=770,width=720,scrollbars=no,status=yes');

    newWin.document.write(htmlToPrint);
    setTimeout(function () {
        newWin.print();
    }, 1000);
    
    $("#report_header_html").addClass("hidden");
    $("#report_footer_html").addClass("hidden");
}


function print_datatable(id_div, total_price = "", tital_report = "") {
    /* 
    [params] => id_div  this pointer id div work get all text and html inside div
    [params] => context_header this pointer get header in print use html
    [params] => context_footer this pointer get footer in print use html


    */



    var mythead_table = document.getElementById(id_div);
    var htmlToPrint = "";

    htmlToPrint += "<link rel='stylesheet' href='static/css/bootstrap.min.css'>";
    htmlToPrint += "<link rel='stylesheet' href='static/css/bootstrap.rtl.min.css'>";
    
    htmlToPrint += mythead_table.outerHTML + "<br/>";


    newWin = window.open(document.URL, '_blank', '', 'scrollbars=1');
    $("#tital_report_r").append($("#tital_report").text());
    newWin.document.write(" " + $("#report_header_html").removeClass("hidden").html());
    htmlToPrint += `<script> 
                        const element = document.getElementById('ReportBookingReportJson_filter');
                        element.remove();
                    </script>`;
    newWin.document.write(htmlToPrint);
    if (typeof total_price !== 'undefined') {
    if (total_price != "") {
        newWin.document.write(document.getElementById(total_price).outerHTML);

    }}
    newWin.document.write($("#report_footer_html").removeClass("hidden").html());

    setTimeout(function () {
        newWin.print();
    }, 1000);
    

    $("#report_header_html").addClass("hidden");
    $("#report_footer_html").addClass("hidden");
}

function print_booking(id_div, tital_report = "",add_html_header = "") {
    

    var mythead_table = document.getElementById(id_div);
    var htmlToPrint ="";
    var url = window.location.host;

    htmlToPrint += "<link rel='stylesheet' href='/static/css/bootstrap-rtl.min.css'>";
    htmlToPrint += "<link rel='stylesheet' href='/static/css/bootstrap.min.css'>";
    htmlToPrint +=add_html_header+ mythead_table.outerHTML + `<br/>    <style>
    @media print
  {
    .row {
        display: -ms-flexbox;
        display: flex;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        margin-left: -15px;
        margin-right: -15px;
    }
    .col-md-4 {
        width: 33.33333333%;
    }
  }
  </style>`;

    newWin =window.open(href = document.URL + '?noSide=true','', '');
    $("#tital_report_r").append($("#tital_report").text());
    if($("#report_header_html").removeClass("hidden").html()==="undefined")
    newWin.document.write(" " + $("#report_header_html").removeClass("hidden").html());
    
    newWin.document.write(htmlToPrint);
    if (typeof total_price !== 'undefined') {
    if (total_price != "") {
        newWin.document.write(document.getElementById(total_price).outerHTML);

    }
}
    if($("#report_footer_html").removeClass("hidden").html()==="undefined") 
        newWin.document.write($("#report_footer_html").removeClass("hidden").html());
    
        setTimeout(function () {
            newWin.print();
        }, 1000);
        
    

    $("#report_header_html").addClass("hidden");
    $("#report_footer_html").addClass("hidden");
}

function printcasher(divId) {
    var content = document.getElementById(divId).innerHTML;
    var mywindow = window.open('', 'Print', 'height=600,width=800');
    mywindow.document.write('<html><head><title>Print</title>');
    mywindow.document.write('</head><body>');
    mywindow.document.write(content);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // يجب إغلاق النافذة قبل الطباعة
    mywindow.print();
    mywindow.close();

    return true;
}
