var timer;
var is_function_loaded=true;
function ClearFromLocalStorage(){
    
    localStorage.removeItem('myinvoice');
    $('#local_invoice_div').hide();
    
}

function autoRound(num)
{
	num5=num.toFixed(6);
	num11=num.toFixed(11);
	frac=Math.abs(num11-num5);
	
	if(frac*100000000<10)
	{
		num=num.toFixed(6)/1;
	}
	return num;
}

function round( num, precision ) {
    return ((+(Math.round(+(num + 'e' + precision)) + 'e' + -precision)).toFixed(precision))/1;
}

function in_format(x)
{
	x=x.toString();
	var afterPoint = '';
	if(x.indexOf('.') > 0)
	   afterPoint = x.substring(x.indexOf('.'),x.length);
	x = Math.floor(x);
	x=x.toString();
	var lastThree = x.substring(x.length-3);
	var otherNumbers = x.substring(0,x.length-3);
	if(otherNumbers != '')
		lastThree = ',' + lastThree;
	var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
	return res;
}


function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function empty(value){
	return typeof value === 'undefined' || value === null || value === '' || value === ' ' || Number.isNaN(value);
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}


function format_price(price,code){
	price = parseFloat(price);
	$org_price=price;
	
	if ( typeof(price) == "undefined" || price === null || price === '0.00' || price == 'NaN') price=0;
	
	if(code){
		format=currencies[code];
		if (code!='INR'&& (typeof(number_formats) == "undefined" || number_formats === null || typeof(number_formats[code]) == "undefined" || number_formats[code] === null))
		{
			number_formats[code]=[2,".",","];
			if (currencies[code] == undefined) {
				currencies[code] = '';
			} else {
				currencies[code]=replaceAll(currencies[code],'%0.2f','%s');
			}
		}
		if ( typeof(number_formats) != "undefined" && number_formats !== null && typeof(number_formats[code]) != "undefined" && number_formats[code] !== null) {
			if( typeof(number_formats[code+'-'+country_code]) != "undefined" && number_formats[code+'-'+country_code] !== null )
			{
				code= code+'-'+country_code;
				format=currencies[code];
			}
			
			// if(number_formats[code][0]==0&&Math.abs(Math.floor($org_price*10)-$org_price*10)>=0.05) number_formats[code][0]=2;
			// if(number_formats[code][0]==0&&Math.abs(Math.floor($org_price)-$org_price)>=0.005) number_formats[code][0]=1;
			
			format=currencies[code];
			price = round(price,number_formats[code][0]);
            price = price.toFixed(number_formats[code][0]);
			price = numberWithSeprator(price);
			if (format != undefined) {
				price = sprintf(format, price);
			}
			price=price.replace(/(\d)\./g, '$1***');
			price=price.replace(/(\d),/g, '$1'+number_formats[code][2]);
			price=price.replace(/\*\*\*/g, number_formats[code][1]);
			price = replaceAll(price,' ','\xa0');
			

			return price;
        }
		if(code=='INR')
		{
			price=in_format(price);
		}
		return sprintf(format, price).replace(' ','\xa0');
	}
	
	return price.toFixed(2);
}

/**
 * format_price_super_simple - Returns the Formatted Price by Currency + Country Code + Might return The symbol if preferred
 * @param price - The price you want to format
 * @param currency_code - The Currency Code (USD,EGP ..etc) (Required)
 * @param country_code - The country_code in ISO Format (Optional)
 * @param symbol - boolean whether to format with the Symbol or Not
 * Example : format_price_super_simple(5912.251, 'EUR', 'DE', true);
 * @returns {string|*}
 */
function format_price_super_simple(price) {
	var currency_code = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : currency_code;
	var country_code = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : (typeof COUNTRY_CODE !== 'undefined' ? COUNTRY_CODE : country_code);
	var symbol = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
	// currently forced to arabic numbers (1234567890) Not Hindi Numbers at all.
	var locale = {};
	// Set Country Code if it exists
	if (country_code) {
		locale = 'en-' + country_code;
	}
	try {
		// Without Symbol
		if (!symbol) {
			return new Intl.NumberFormat(locale, {
				style: 'decimal',
				currency_code: currency_code
			}).format(price);
		} // With Symbol
		return new Intl.NumberFormat(locale, {
			style: 'currency',
			currency: currency_code
		}).format(price);
	} catch (error) {
		console.log('format_price_simple Error: ' + error + '\n defaulting to old format_price');
		return format_price(price, currency_code);
	}
}

function numberWithSeprator(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function render(fn){
	timer = setInterval(function() {
		if (typeof fn === 'undefined') {
			fn = null;
		}
		renderIt(fn);
	}, 40);
}

function sprintf () {
	var regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuidfegEG])/g;
	var a = arguments,
	i = 0,
	format = a[i++];

	//pad()
	var pad = function (str, len, chr, leftJustify) {
		if (!chr) {
			chr = ' ';
		}
		var padding = (str.length >= len) ? '' : Array(1 + len - str.length >>> 0).join(chr);
		return leftJustify ? str + padding : padding + str;
	};

	// justify()
	var justify = function (value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
		var diff = minWidth - value.length;
		if (diff > 0) {
			if (leftJustify || !zeroPad) {
				value = pad(value, minWidth, customPadChar, leftJustify);
			} else {
				value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
			}
		}
		return value;
	};
	// formatBaseX()
	var formatBaseX = function (value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
		// Note: casts negative numbers to positive ones
		var number = value >>> 0;
		prefix = prefix && number && {
			'2': '0b',
			'8': '0',
			'16': '0x'
		}
		[base] || '';
		value = prefix + pad(number.toString(base), precision || 0, '0', false);
		return justify(value, prefix, leftJustify, minWidth, zeroPad);
	};

	// formatString()
	var formatString = function (value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
		if (precision != null) {
			value = value.slice(0, precision);
		}
		return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
	};

	// doFormat()
	var doFormat = function (substring, valueIndex, flags, minWidth, _, precision, type) {
		var number;
		var prefix;
		var method;
		var textTransform;
		var value;
		if (substring == '%%') {
			return '%';
		}

		// parse flags
		var leftJustify = false,
		positivePrefix = '',
		zeroPad = false,
		prefixBaseX = false,
		customPadChar = ' ';
		var flagsl = flags.length;
		for (var j = 0; flags && j < flagsl; j++) {
			switch (flags.charAt(j)) {
				case ' ':
					positivePrefix = ' ';
					break;
				case '+':
					positivePrefix = '+';
					break;
				case '-':
					leftJustify = true;
					break;
				case "'":
					customPadChar = flags.charAt(j + 1);
					break;
				case '0':
					zeroPad = true;
					break;
				case '#':
					prefixBaseX = true;
					break;
			}
		}

		// parameters may be null, undefined, empty-string or real valued        // we want to ignore null, undefined and empty-string values
		if (!minWidth) {
			minWidth = 0;
		} else if (minWidth == '*') {
			minWidth = +a[i++];
		} else if (minWidth.charAt(0) == '*') {
			minWidth = +a[minWidth.slice(1, -1)];
		} else {
			minWidth = +minWidth;
		}
		// Note: undocumented perl feature:
		if (minWidth < 0) {
			minWidth = -minWidth;
			leftJustify = true;
		}

		if (!isFinite(minWidth)) {
			throw new Error('sprintf: (minimum-)width must be finite');
		}
		if (!precision) {
			precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type == 'd') ? 0 : undefined;
		} else if (precision == '*') {
			precision = +a[i++];
		} else if (precision.charAt(0) == '*') {
			precision = +a[precision.slice(1, -1)];
		} else {
			precision = +precision;
		}
		// grab value using valueIndex if required?
		value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];

		switch (type) {
			case 's':
				return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
			case 'c':
				return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
			case 'b':
				return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
			case 'o':
				return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
			case 'x':
				return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
			case 'X':
				return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();
			case 'u':
				return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
			case 'i':        case 'd':
				number = (+value) | 0;
				prefix = number < 0 ? '-' : positivePrefix;
				value = prefix + pad(String(Math.abs(number)), precision, '0', false);
				return justify(value, prefix, leftJustify, minWidth, zeroPad);
			case 'e':
			case 'E':
			case 'f':
			case 'F':
			case 'g':        case 'G':
				number = +value;
				prefix = number < 0 ? '-' : positivePrefix;
				method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
				textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
				value = prefix + Math.abs(number)[method](precision);
				return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
			default:
				return substring;
		}
	};

return format.replace(regex, doFormat);
}

function renderIt(fn){
	if (1) {
		clearInterval(timer);
		if (typeof fn === 'function') {
			fn();
		}
		return;
	}
}

function __(text) {
	if(typeof translate_languages == 'undefined' || translate_languages[text]==undefined || translate_languages[text]==''){
          
		return text;
	}else{
             
		return translate_languages[text];
	}
	return false;
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function isVisible(selector){
	return $(selector).is(':visible');
}

function string2number(value){
	return isNaN(parseFloat(value))? 0 : value * 1;
}

function isNumeric(value){
	return !notEmpty(value) || !isNaN(parseFloat(value));
}

function notEmpty(value){
	if (typeof value == "object") {
		value = value.value;
	}
    if(value != undefined) {
		return value.toString() != '';
	} else {
		return false;
	}
}

function isNotMinus(value){
	return string2number(value) >= 0;
}
function Email(value){
	return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
}
function lessThan(compareValue){
	return this < compareValue;
}

function lessThanOrEqual(compareValue){
	return this <= compareValue;
}

function betweenPercentage(value){
	return (value >= 0 && value <= 100);
}

function maxLength(length){
	return this.length <= length;
}



function validate(rules, validationMessages){

	var errors = {};
	for (var selector in rules){

		var functions = [], pass = 'value', empty = false;
		if (rules[selector] instanceof Array){
			functions = rules[selector];
		} else {
			functions = rules[selector].rules;
			if (typeof rules[selector].pass != 'undefined'){
				pass = rules[selector].pass;
			}

			if (typeof rules[selector].empty != 'undefined'){
				empty = rules[selector].empty;
			}
		}
		$.each(functions, function(i, func){
			var fields = $(selector);

			fields.removeClass('form-error');
			fields.each(function(idx){
				if (typeof errors[selector +':nth(' + idx + ')'] == 'undefined'){
					var value = this.value;
					if (pass == 'selector'){
						value = this;
					}

					var result = false, rule = '';

					if (typeof func == 'object'){
						if (!(func.value instanceof Array)){
							func.value = [func.value];
						}

						result = (empty && !notEmpty(this.value)) || window[func.rule].apply(value, func.value);
						rule = func.rule;
					} else {
						result = (empty && !notEmpty(this.value)) || window[func](value);
						rule = func;
					}

					if (!result){

						var message = validationMessages[rule];
						if (typeof func == 'object' && func.value){
							message = message.replace(':value', func.value);
						}

						errors[selector +':nth(' + idx + ')'] = message;
					}
				}
			});
		});
	}

	$('.error-message').remove();
	$('.error:input').removeClass('error');

	$.each(errors, function(selector, message){
		$(selector).addClass('form-error')
		.parent()
		.append($('<div>', {
			'class': 'error-message error_'+$(selector).attr('id')
		}).text(message));
		$('.error-message').show();

	//		$(selector).change(function(){
	//			validate(rules, validationMessages);
	//		});
	});

	var firstError = $('.form-error:input:first');
	var errorParent = firstError.parents('.tabs-box');
	if (errorParent.length){
		activateTab('#' + errorParent.attr('id'));
	}
	firstError.focus();

	return $.isEmptyObject(errors);
}

function sideMenuClick(elem, event) {
    event.preventDefault();
    const thisMenu = $('div.sub-menu-cont', elem);
    const visible = thisMenu.is(':visible');
    const _this = elem;
    $('div.sub-menu-cont').slideUp(function () {
        if (ps != null) ps.update();
    });
    $("li.super-menu", '#main-nav').removeClass('open-submenu');
    if (!visible) {
    	if (isLocalStorageSupported()) {localStorage.setItem('openedMenuItem', $(elem).data('menu-item-id'));}
        thisMenu.slideDown(function () {
            if (ps != null) ps.update();
        });
        $(_this).addClass('open-submenu');
    } else {
		if (isLocalStorageSupported()) {localStorage.removeItem('openedMenuItem');}
	}
}

$(document).ready(function () {
	// Open latest items to top
	if ( $(window).height() < 1100) {
		var $lis = $('.main-nav ul li .sub-menu-cont');
		// check if there are more than 5 elements
		if ($lis.length > 8) {
			// if so get the last 4 elements and add the class
			$lis.slice(-7).addClass("opens-top");
		}
	}
});

function subSideMenuClick(evt) {
    evt.stopPropagation();
    return true;
}


 function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}

function setCookie(cname, cvalue) {
    var d = new Date();
    d.setTime(d.getTime() + 2592000000);
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + encodeURIComponent(cvalue) + ";" + expires + ";path=/";
}

function getAttributesText(attributes)
{
    attributesText = '';
    attributesKeys = Object.keys(attributes);
    for (j = 0 ; j< attributesKeys.length; j++)
    {
        key = attributesKeys[j];
        value = attributes[key];
		attributesText += key + '=' + '"' + value + '"';
    }
    return attributesText;
}

/**
 *
 * @param breadCrumbs [{link:"",title:"",liAttr: {}, aAttr}]
 */
function createBreadCrumbs(breadCrumbs)
{
	console.log(breadCrumbs);
	$breadCrumbsElement = $("#breadcrumb");
	breadText = '';
	for(i=0;i < breadCrumbs.length; i++)
	{
		liAttributesText = '';
		aAttributesText = '';
		breadCrumb = breadCrumbs[i];
		if(typeof breadCrumb.liAttr != 'undefined' )
		{
            liAttributesText = getAttributesText(breadCrumb.liAttr);
		}
		if(typeof breadCrumb.aAttr != 'undefined' )
		{
            aAttributesText = getAttributesText(breadCrumb.aAttr);
		}
		console.log(liAttributesText);
		console.log(aAttributesText);
		linkText = '';
		if(breadCrumb['link'] != '')
		{
			linkText = " href=\"".concat(breadCrumb['link'], "\" ");
		}
		if(i == breadCrumbs.length - 1)
		{
			breadText += "<li ".concat(liAttributesText, " class='breadcrumb-item active'><span>").concat(breadCrumb['title'], "</span></li>");
		}else{
			breadText += "<li ".concat(liAttributesText, " class='breadcrumb-item' ><a ").concat(aAttributesText, " ").concat(linkText, " >").concat(breadCrumb['title'], "</a></li>");
		}
	}
    $breadCrumbsElement.html(breadText);
    $breadCrumbsElement.show();



	if(IS_RTL) {
        var num = $breadCrumbsElement.find('li').length;
        console.log($breadCrumbsElement.find('li').length);
        bcolor = 0.6 / 5;
        var color = 0.6;
        var scolor = 0.2;
        var min = 0.04;
        for (i = 1; i <= num; i++) {

            color = color - 0.1;
            scolor = scolor - min;
            if (i == num - 1) {

                $breadCrumbsElement.find('li:nth-child(' + i + ') a span').css('border-right', '30px solid rgba(0,0,0,' + color + ')');

            }
            $breadCrumbsElement.find('li:nth-child(' + i + ') a').css('background', 'rgba(0,0,0,' + color + ')');
            $breadCrumbsElement.find('li:nth-child(' + i + ') a').append('<span class="m" style="border-right: 30px solid rgba(0,0,0,' + scolor + ')"> </span>');
            if (i == num - 1) {
                $breadCrumbsElement.find('li:nth-child(' + i + ') a span').css('border-right', '30px solid rgba(0,0,0,' + color + ')');
            }

            min = min / 2;


        }
        //$('li:last-child span').remove()
        $breadCrumbsElement.find('li:last-child a').css('background', 'transparent');


        $breadCrumbsElement.find("li").hover(function () {
                $(this).children('a').css('text-decoration', 'underline');
            },
            function () {
                $(this).children('a').css('text-decoration', 'none');
            }
        );
    }else {

        var num = $breadCrumbsElement.find('li').length;
        bcolor = 0.6 / 5;
        var color = 0.6;
        var scolor = 0.2;
        var min = 0.04;
        for (i = 1; i <= num; i++) {

            color = color - 0.1;
            scolor = scolor - min;
            if (i == num - 1) {

                $breadCrumbsElement.find('li:nth-child(' + i + ') a span').css('border-left', '30px solid rgba(0,0,0,' + color + ')');

            }
            $breadCrumbsElement.find('li:nth-child(' + i + ') a').css('background', 'rgba(0,0,0,' + color + ')');
            $breadCrumbsElement.find('li:nth-child(' + i + ') a').append('<span class="m" style="border-left: 30px solid rgba(0,0,0,' + scolor + ')"> </span>');
            if (i == num - 1) {
                $breadCrumbsElement.find('li:nth-child(' + i + ') a span').css('border-left', '30px solid rgba(0,0,0,' + color + ')');
            }

            min = min / 2;

        }

        $breadCrumbsElement.find('li:last-child a').css('background', 'transparent');


        $breadCrumbsElement.find("li").hover(function () {
                $(this).children('a').css('text-decoration', 'underline');
            },
            function () {
                $(this).children('a').css('text-decoration', 'none');
            }
        );

    }

}

/**
 *
 * @param filename
 * @param filetype
 */
function loadjscssfile(filename, filetype){
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script')
        fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype=="css"){ //if filename is an external CSS file
        var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("body")[0].appendChild(fileref)
}

function alignNumbers(selector)
{
	width = 0.0;
	$(selector).each(function () {
		if(width < parseFloat($(this).css('width').replace('px', '')))
		{
			width = parseFloat($(this).css('width').replace('px', ''));
			console.log(width);
		}
    });
    $(selector).each(function (el) {
    	if($(this).children('span[data-number-aligned="true"]').length == 0)
		{
            oldHtml = $(this).html();
            newHtml = "<span data-number-aligned='true' style='direction: ltr; display: inline-block; width: "+width+"px;text-align: right'>" + oldHtml + "</span>";
            $(this).html(newHtml);
		}
    });
}

function PrintElem(elem)
{
    var mywindow = window.open('', 'PRINT', '');

    mywindow.document.write('<html><head><title>' + document.title  + '</title>');
    mywindow.document.write('</head><body >');
    mywindow.document.write('<h1>' + document.title  + '</h1>');
    mywindow.document.write(document.getElementById(elem).innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;
}

function AppFormatPrice(amount,  countryCode, currency, showCurrency = false) {
	var formatter;
	if(showCurrency) {
		formatter = new Intl.NumberFormat(`en-${countryCode}`, {'style': 'currency', 'currency': currency});
		var formattedNumber = formatter.format(amount);
	} else {
		const currencyFractionDigits = new Intl.NumberFormat(`en-${countryCode}`, {
			style: 'currency',
			currency: currency,
		}).resolvedOptions().maximumFractionDigits;
		var formattedNumber = (amount).toLocaleString(`en-${countryCode}`, { maximumFractionDigits: currencyFractionDigits });
	}
	return formattedNumber;
}

function isValidDate(d) {
	return d instanceof Date && !isNaN(d);
}

function appFormatDate(date, jsDateFormat = null) {
	if(!jsDateFormat) {
		jsDateFormat = __jsDateFormat;
	}
	let dateObj;
	try {
		if ($.datepicker.formatDate(__jsDateFormat, $.datepicker.parseDate(__jsDateFormat, date)) === date) {
			//site format
			dateObj = $.datepicker.parseDate(jsDateFormat, date);
		}
	}catch(err) {
		if(typeof date === 'string') {
			dateObj = new Date(date);
			try {
				if($.datepicker.formatDate('yy-mm-dd', dateObj) !== date) {
					//not mysql format
					return date;
				}
			}catch (err) {
				return date;
			}
		}
	}


	if(!isValidDate(dateObj)) {
		return date;
	}

	return $.datepicker.formatDate(jsDateFormat,dateObj);
}