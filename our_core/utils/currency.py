from general_configuration.models import Currency
def get_local_currency():
    """
    get local currency and code
    """
    try:
        currency = Currency.objects.get(currency_type="local")
        return currency
    except:
        return None

def format_currency_code(request,value_blanc):
    if request.session['currency']:
        return f"{round(Decimal(value_blanc), int(request.session.get('digits_fractions_numbar')))} {request.session.get('currency_code')}"
    else:
        return f"{Decimal(value_blanc)}"


def format_currency_blanc(request,value_blanc):
    if request.session.get('digits_fractions_numbar'):
        return round(Decimal(value_blanc), int(request.session.get('digits_fractions_numbar')))
    else:
        return f"{Decimal(value_blanc)}"