
"""
Form Widget classes specific to the core core.
"""

import json
from datetime import datetime

from django import forms
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.encoding import force_str
from django.utils.formats import get_format
from django.utils.safestring import mark_safe
from django.utils.translation import get_language
from django.utils.translation import gettext_lazy as _
from django.forms.widgets import NumberInput
import re
class our_coreNumberInput(NumberInput):

    def get_context(self, name, value, attrs):
        custom_attrs = self.build_attrs(self.attrs, attrs)
        context = {}
        if custom_attrs.get('class',None):
            if not '_currency_input' in custom_attrs.get('class'):
                custom_attrs['class'] = custom_attrs['class'] + ' _currency_input'
        else:
            custom_attrs['class'] =' _currency_input'
        context['widget'] = {
            'name': name,
            'is_hidden': self.is_hidden,
            'required': self.is_required,
            'value': self.format_value(value),
            'attrs': custom_attrs,
            'template_name': self.template_name,
        }
        return context


    def value_from_datadict(self, data, files, name):
        """
        Given a dictionary of data and this widget's name, return the value
        of this widget or None if it's not provided.
        """
        return re.sub("[^\d\.]", "", data.get(name))
# TODO: complete this class to use it instead of the _style.html and _script.html files

# def media():
#     extra = '.min' if settings.DEBUG else '.min'
#     css = [
#         'vendor/bootstrap/css/bootstrap%s.css' % extra,
#         'vendor/mdb/css/mdb%s.css' % extra,
#         'vendor/fontawesome/css/all%ss.css' % extra,
#         'vendor/datatables/css/datatables%s.css' % extra,
#         'vendor/datatables/css/datatables-select2%s.css' % extra,
#         'vendor/jquery-ui/jquery-ui%s.css' % extra,
#         'vendor/summernote/summernote-bs4%s.css' % extra,
#         'css/core.css',
#     ]
#     js = [
#         'vendor/jquery/jquery%s.js' % extra,
#         'vendor/bootstrap/js/popper%s.js' % extra,
#         'vendor/bootstrap/js/bootstrap%s.js' % extra,
#         'vendor/mdb/js/mdb%s.js' % extra,
#         'vendor/fontawesome/js/all%s.js' % extra,
#         'vendor/datatables/js/datatables%s.js' % extra,
#         'vendor/datatables/js/datatables-select2%s.js' % extra,
#         'vendor/jquery-ui/jquery-ui%s.js' % extra,
#         'vendor/summernote/summernote-bs4%s.js' % extra,
#         'js/data_table_list.js',
#         'js/core.js',
#     ]
#     return forms.Media(js=["%s" % path for path in js], css=["%s" % path for path in css])

__all__ = (
    'CoreCheckBoxWidget', 'CoreSwitchCheckBoxWidget', 'CoreFileWidget',
    'CorePasswordWidget', 'CoreCharInputWidget', 'CoreEmailInputWidget',
    'CoreTextInputWidget', 'CoreDatePickerWidget', 'CoreDateTimePickerWidget',
    'CoreTimePickerWidget'
)


class CoreCheckBoxWidget(forms.CheckboxInput):
    template_name = 'core/widgets/checkbox_widget.html'
    input_type = 'checkbox'
    class_name = 'custom-control-input'

    class Media:
        pass

    def __init__(self, attrs=None, *args, **kwargs, ):
        attrs = {'class': self.class_name, 'size': '10', **(attrs or {})}
        default_options = {'toggle': 'toggle', 'offstyle': 'offset'}
        options = kwargs.get('options', {})
        default_options.update(options)
        for key, val in default_options.items():
            attrs['data-' + key] = val
        super().__init__(attrs)

    def get_context(self, name, value, attrs):
        context = super().get_context(name, value, attrs)
        return context


class CoreSwitchCheckBoxWidget(forms.CheckboxInput):
    input_type = 'checkbox'
    template_name = 'core/widgets/switch_checkbox_widget.html'
    class_name = 'form-check-input'

    class Media:
        pass

    def __init__(self, attrs=None, *args, **kwargs):
        attrs = {'class': self.class_name, 'size': '10', **(attrs or {})}
        super().__init__(attrs)


class CoreFileWidget(forms.FileInput):
    input_type = 'file'
    needs_multipart_form = True
    template_name = 'core/widgets/file_widget.html'
    class_name = 'custom-file-input form-control-sm'

    def __init__(self, attrs=None, *args, **kwargs):
        attrs = {'class': self.class_name, 'size': '10', **(attrs or {})}
        super().__init__(attrs)


class CorePasswordWidget(forms.PasswordInput):
    template_name = 'core/widgets/password_widget.html'
    class_name = 'form-control form-control-sm'

    def __init__(self, attrs=None, *args, **kwargs):
        attrs = {'class': self.class_name, 'size': '10', **(attrs or {})}
        super().__init__(attrs)


class CoreCharInputWidget(forms.TextInput):
    input_type = 'text'
    template_name = 'core/widgets/text_widget.html'
    class_name = 'form-control form-control-sm'

    def __init__(self, attrs=None, *args, **kwargs):
        attrs = {'class': self.class_name, 'size': '10', **(attrs or {})}
        super().__init__(attrs)

class CoreSelectWidget(forms.Select):
    input_type = 'select'
    template_name = 'core/widgets/select_widget.html'
    option_template_name = 'core/widgets/select_option.html'
    def get_context(self, name, value, attrs):
        context = super().get_context(name, value, attrs)
        if self.allow_multiple_selected:
            context['widget']['attrs']['multiple'] = True
        return context
    @staticmethod
    def _choice_has_empty_value(choice):
        """Return True if the choice's value is empty string or None."""
        value, _ = choice
        return value is None or value == ''

    def use_required_attribute(self, initial):
        """
        Don't render 'required' if the first <option> has a value, as that's
        invalid HTML.
        """
        use_required_attribute = super().use_required_attribute(initial)
        # 'required' is always okay for <select multiple>.
        if self.allow_multiple_selected:
            return use_required_attribute

        first_choice = next(iter(self.choices), None)
        return use_required_attribute and first_choice is not None and self._choice_has_empty_value(first_choice)



class CoreNumberInputWidget(forms.NumberInput):
    input_type = 'number'
    template_name = 'core/widgets/number_widget.html'
    class_name = 'form-control form-control-sm'

    def __init__(self, attrs=None, *args, **kwargs):
        attrs = {'class': self.class_name, 'size': '10', **(attrs or {})}
        super().__init__(attrs)


class CoreEmailInputWidget(forms.EmailInput):
    template_name = 'core/widgets/email_widget.html'
    class_name = 'form-control form-control-sm'
    data_error = _('Enter a valid email')
    data_success = _('Email is valid')

    def __init__(self, attrs=None, *args, **kwargs):
        attrs = {'class': self.class_name, 'size': '10', **(attrs or {})}
        super().__init__(attrs)


class CoreTextInputWidget(forms.Textarea):
    template_name = 'core/widgets/textarea_widget.html'

    def __init__(self, attrs=None):
        # Use slightly better defaults than HTML's 20x2 box
        default_attrs = {'cols': '40', 'rows': '10'}
        if attrs:
            default_attrs.update(attrs)
        super().__init__(default_attrs)


class __CoreDateTimeMixin:
    """
    The Core Mixin contains shared functionality for the three types of date
    pickers offered.
    """

    def __init__(self, attrs=None, options=None):
        super().__init__()

        # Set default options to include a clock item, otherwise datetimepicker
        # shows no icon to switch into time mode
        self.js_options = {
            "format": self.get_js_format(),
            "icons": {"time": "fa fa-clock",
                      "date": "fa fa-calendar",
                      "up": "fa fa-arrow-up",
                      "down": "fa fa-arrow-down"},

        }
        # If a dictionary of options is passed, combine it with our pre-set js_options.
        if isinstance(options, dict):
            self.js_options = {**self.js_options, **options}
        # save any additional attributes that the user defined in self
        self.attrs = attrs or {}

    def render(self, name, value, attrs=None, renderer=None):
        context = super().get_context(name, value, attrs)

        # self.attrs = user-defined attributes from __init__
        # attrs = attributes added for rendering.
        # context['attrs'] contains a merge of self.attrs and attrs
        # NB If crispy forms is used, it will already contain
        # 'class': 'datepicker form-control'
        # for DatePicker widget

        all_attrs = context["widget"]["attrs"]
        all_attrs["id"] = all_attrs["id"].replace('-', '_')
        cls = all_attrs.get("class", "")
        if "form-control" not in cls:
            cls = "form-control " + cls

        # Add the attribute that makes datepicker popup close when focus is lost
        cls += " datetimepicker-input"
        all_attrs["class"] = cls

        # defaults for our widget attributes
        input_toggle = True
        icon_toggle = True
        input_group = True
        append = ""
        prepend = ""
        size = ""

        attr_html = ""
        for attr_key, attr_value in all_attrs.items():
            if attr_key == "prepend":
                prepend = attr_value
            elif attr_key == "append":
                append = attr_value
            elif attr_key == "input_toggle":
                input_toggle = attr_value
            elif attr_key == "input_group":
                input_group = attr_value
            elif attr_key == "icon_toggle":
                icon_toggle = attr_value
            elif attr_key == "size":
                size = attr_value
            elif attr_key == "icon_toggle":
                icon_toggle = attr_value
            else:
                attr_html += ' {key}="{value}"'.format(key=attr_key, value=attr_value)

        options = {}
        options.update(self.js_options)

        if getattr(settings, "FINIX_DATE_TIME_LOCALIZE", False) and "locale" not in self.js_options:
            options["locale"] = get_language()

        if context["widget"]["value"] is not None:
            # Append an option to set the datepicker's value using a Javascript
            # moment object
            options.update(self.moment_option(value))

        # picker_id below has to be changed to underscores, as hyphens are not
        # valid in JS function names.
        field_html = render_to_string(
            "core/widgets/date_time_widget.html",
            {
                "type": context["widget"]["type"],
                "picker_id": context["widget"]["attrs"]["id"].replace("-", "_"),
                "name": context["widget"]["name"],
                "attrs": mark_safe(attr_html),
                "js_options": mark_safe(json.dumps(options)),
                "prepend": prepend,
                "append": append,
                "icon_toggle": icon_toggle,
                "input_toggle": input_toggle,
                "input_group": input_group,
                "size": size,
            },
        )

        return mark_safe(force_str(field_html))

    def moment_option(self, value):
        """
        Returns an option dict to set the default date and/or time using a Javascript
        moment object. When a form is first instantiated, value is a date, time or
        datetime object, but after a form has been submitted with an error and
        re-rendered, value contains a formatted string that we need to parse back to a
        date, time or datetime object.
        """
        if isinstance(value, str):
            if isinstance(self, CoreDatePickerWidget):
                formats = "DATE_INPUT_FORMATS"
            elif isinstance(self, CoreTimePickerWidget):
                formats = "TIME_INPUT_FORMATS"
            else:
                formats = "DATETIME_INPUT_FORMATS"
            for fmt in get_format(formats):
                try:
                    value = datetime.strptime(value, fmt)
                    break
                except (ValueError, TypeError):
                    continue
            else:
                return {}

        # Append an option to set the datepicker's value using iso formatted string
        iso_date = value.isoformat()

        # iso format for time requires a prepended T
        if isinstance(self, CoreTimePickerWidget):
            iso_date = "T" + iso_date

        return {"date": iso_date}

    def get_js_format(self):
        raise NotImplementedError(
            'get_js_format must be implemented in for any successor class of __CoreDateTimeMixin class \n')


class CoreDatePickerWidget(__CoreDateTimeMixin, forms.DateInput):
    """
    Widget for Core DatePicker.
    """

    def __init__(self, attrs=None, options=None):
        attrs = {'prepend': 'fa fa-calendar', **(attrs or {})}
        super().__init__(attrs)

    def get_js_format(self):
        if getattr(settings, "FINIX_DATE_TIME_LOCALIZE", False):
            js_format = "L"
        else:
            js_format = "YYYY-MM-DD"
        return js_format


class CoreDateTimePickerWidget(__CoreDateTimeMixin, forms.DateTimeInput):
    """
    Widget for Core DateTimePicker.
    """

    def __init__(self, attrs=None, options=None):
        attrs = {'prepend': 'fa fa-calendar', **(attrs or {})}
        super().__init__(attrs)

    def get_js_format(self):
        if getattr(settings, "FINIX_DATE_TIME_LOCALIZE", False):
            js_format = "L LTS"
        else:
            js_format = "YYYY-MM-DD HH:mm:ss"
        return js_format


class CoreTimePickerWidget(__CoreDateTimeMixin, forms.TimeInput):
    """
    Widget for Core TimePicker.
    """

    def __init__(self, attrs=None, options=None):
        attrs = {'prepend': 'fa fa-clock', **(attrs or {})}
        super().__init__(attrs)

    def get_js_format(self):
        if getattr(settings, "FINIX_DATE_TIME_LOCALIZE", False):
            js_format = "LTS"
        else:
            js_format = "HH:mm:ss"
        return js_format