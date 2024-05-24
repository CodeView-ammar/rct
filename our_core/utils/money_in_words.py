import numpy as np
from django.utils.translation import ugettext_lazy as _

def flt(s: np.number, precision: int | None = None, rounding_method: str | None = None) -> float:

	"""Convert to float (ignoring commas in string).

	:param s: Number in string or other numeric format.
	:param precision: optional argument to specify precision for rounding.
	:returns: Converted number in python float type.

	Return 0 if input can not be converted to float.

	Examples:

	>>> flt("43.5", precision=0)
	44
	>>> flt("42.5", precision=0)
	42
	>>> flt("10,500.5666", precision=2)
	10500.57
	>>> flt("a")
	0.0
	"""
	if isinstance(s, str):
		s = s.replace(",", "")

	try:
		num = float(s)
		if precision is not None:
			num = num
	except Exception as e:
		if isinstance(e):
			raise
		num = 0.0

	return num

number_format_info = {
	"#,###.##": (".", ",", 2),
	"#.###,##": (",", ".", 2),
	"# ###.##": (".", " ", 2),
	"# ###,##": (",", " ", 2),
	"#'###.##": (".", "'", 2),
	"#, ###.##": (".", ", ", 2),
	"#,##,###.##": (".", ",", 2),
	"#,###.###": (".", ",", 3),
	"#.###": ("", ".", 0),
	"#,###": ("", ",", 0),
	"#.########": (".", "", 8),
}

def get_number_format_info(format: str) -> tuple[str, str, int]:
	"""Return the decimal separator, thousands separator and precision for the given number `format` string.

	e.g. get_number_format_info('1,00,000.50') -> ('.', ',', 2)

	Will return ('.', ',', 2) for format strings which can't be guessed.
	"""
	return number_format_info.get(format) or (".", ",", 2)


# def money_in_words(
# 	number: str | float | int,
# 	main_currency: str | None = None,
# 	fraction_currency: str | None = None,
# ):
# 	"""Return string in words with currency and fraction currency."""
# 	try:
# 		# note: `flt` returns 0 for invalid input and we don't want that
# 		number = float(number)
# 	except ValueError:
# 		return ""

# 	number = flt(number)
# 	if number < 0:
# 		return ""

# 	if not main_currency:
# 		main_currency = "ريال"
# 	if not fraction_currency:
# 		fraction_currency ="سنت"

# 	number_format = (
# 		 "#,###.##"
# 	)

# 	fraction_length = get_number_format_info(number_format)[2]

# 	n = f"%.{fraction_length}f" % number

# 	numbers = n.split(".")
# 	main, fraction = numbers if len(numbers) > 1 else [n, "00"]

# 	if len(fraction) < fraction_length:
# 		zeros = "0" * (fraction_length - len(fraction))
# 		fraction += zeros

# 	in_million = True
# 	if number_format == "#,##,###.##":
# 		in_million = False

# 	# 0.00
# 	if main == "0" and fraction in ["00", "000"]:
# 		out = main_currency + " " + _("Zero")
# 	# 0.XX
# 	elif main == "0":
# 		out = in_words(fraction, in_million).title() + " " + fraction_currency
# 	else:
# 		out = main_currency + " " + in_words(main, in_million).title()
# 		if int(fraction):
# 			out = (
# 				out + " " + _("and") + " " + in_words(fraction, in_million).title() + " " + fraction_currency
# 			)

# 	return _("{0} فقط.").format(out)

def money_in_words(
    number: str | float | int,
    main_currency: str  = 'SAR',
    fraction_currency: str = "فلس",
):
    from num2words import num2words

	 
    


    """Converts a number to words in Arabic, including currency formatting."""
    if isinstance(number, float):
        # Extract integer and fractional parts (handle potential rounding errors)
        integer_part = int(number)
        fractional_part = int((number - integer_part) * 100)  # Convert fraction to cents (adjust as needed)
    else:
        # Handle integer case directly
        integer_part = number
        fractional_part = 0

    word = num2words(integer_part, lang="ar")  # Assuming Convert handles number conversion
    
    # Extract integer and fractional parts
        # Handle fractional part (if any)
    fractional_words = ""
    if fractional_part > 0:
        fractional_words = num2words(fractional_part, lang="ar")  # Replace with your fraction conversion logic
    # Combine integer and fractional words (if applicable)
    words = word.strip()
    words+=" "+main_currency
    if fractional_words:
        words += f" و {fractional_words}"+" "+fraction_currency 
    return f"{words}"


def in_words(integer: int, in_million=True) -> str:
	"""Return string in words for the given integer."""
	from num2words import num2words

	locale = "ar"
	integer = int(integer)
	try:
		ret = num2words(integer, lang=locale)
	except NotImplementedError:
		ret = num2words(integer, lang="en")
	except OverflowError:
		ret = num2words(integer, lang="en")
	return ret.replace("-", " ")
