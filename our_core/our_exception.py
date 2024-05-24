
"""Exception raised for errors in the input value.

Attributes:
    value -- input value which caused the error
    message -- explanation of the error
"""

import django.core.exceptions as exception
from django.utils.translation import gettext_lazy  as _

class MainException(Exception):
    """Exception 
    """
    pass

class ValueNotInRangeError(MainException):
    """Exception raised for errors in the input value.

    Attributes:
        value -- input value which caused the error
        message -- explanation of the error
    """

    def __init__(self, value, message=_("value is not in range")):
        self.value = value
        self.message = message
        super().__init__(self.message)

    def __str__(self):
        return f'{self.value} -> {self.message}'

class NotExists(Exception):
    """Exception raised for errors in the general.
    Attributes:
        value -- Name which caused the error
        message -- explanation of the error
        if you want to overwrite an default message use NotExists('',your message)
        if you want to use default message use NotExists(key) exa: key= 'Template'
    """

    def __init__(self, value, message=_(" Doesnot exist")):
        if message is self.__init__.__defaults__[0]:
            self.message =value+message
        else:
            self.message = message
        super().__init__(self.message)

class AccountNotExists(MainException):
    """Exception raised for errors in the Account number.

    Attributes:
        value -- Account number which caused the error
        message -- explanation of the error
    """

    def __init__(self, value, message=_("Account with this number Doesnot exist in this window")):
        self.value = value
        self.message = message
        super().__init__(self.message)
    def __str__(self):
        return f'{self.value} -> {self.message}'

class WithdrawOverLoad(MainException):
    """Exception raised when the withdraw over upper limit.

    Attributes:
        value -- withdraw amount
        message -- explanation of the error
    """
    def __init__(self, value, message=_(" withdraw overload try in lower amount ")):
        self.value = value
        self.message = message
        super().__init__(self.message)
    def __str__(self):
        return f'{self.value} -> {self.message}'

class WithdrawInsufficienAmount(MainException):
    """Exception raised when Insufficien Amount .

    Attributes:
        value -- withdraw amount
        message -- explanation of the error
    """

    def __init__(self, value, message=_(" The account hasnot any amount of money ")):
        self.value = value
        self.message = message
        super().__init__(self.message)
    def __str__(self):
        return f'{self.value} -> {self.message}'