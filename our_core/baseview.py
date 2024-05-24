
from django.shortcuts import render, get_object_or_404
from django.db import transaction, IntegrityError
from django import forms
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Submit, Row, Column, HTML, Fieldset, Field, Div
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.db.models import Q ,Max
from django.forms import modelform_factory
from django.http import HttpResponseRedirect, JsonResponse, HttpResponse, QueryDict
from django.core import serializers

from our_core.auto_complete import AutoCompleteMixin
from our_core.list_view import (
    ListViewMixin, TreeViewMixin
)
# from our_core.helper import max_id
from django.forms import widgets
from our_core import widgets as core_widgets
from our_core.views import ViewMixin

FIELD_WIDGET = {
    widgets.Textarea: core_widgets.CoreTextInputWidget,
    widgets.TextInput: core_widgets.CoreCharInputWidget,
    widgets.TimeInput: core_widgets.CoreTimePickerWidget,
    widgets.CheckboxInput: core_widgets.CoreCheckBoxWidget,
    widgets.ClearableFileInput: core_widgets.CoreFileWidget,
    widgets.DateInput: core_widgets.CoreDatePickerWidget,
    widgets.DateTimeInput: core_widgets.CoreDateTimePickerWidget,
    widgets.EmailInput: core_widgets.CoreEmailInputWidget,
    widgets.NumberInput: core_widgets.CoreNumberInputWidget,
    # widgets.Select:core_widgets.CoreSelectWidget,
}

from our_core.our_messages import message



class BaseView(ViewMixin, ListViewMixin, AutoCompleteMixin):
    columns = []

    def setup(self, request, *args, **kwargs):
        self.form_name = self.form_name()
        return super(BaseView, self).setup(request, *args, **kwargs)

    def get_context_data(self, self1, *args, **kwargs):
        temp = super(BaseView, self).get_context_data(self1, *args, **kwargs)
        if self1.request.GET.get('with_header'):
            temp_dict = {}
            for counter in range(len(self.list_fields)):
                temp_dict[self.list_fields[counter]] = self.columns[counter]
            temp['table_header'] = temp_dict
        return temp

    def get(self, request, *args, **kwargs):
        self.auto_complete_init()
        if self.has_datatable:
            self.get_datatable_verbose_name()
            if "dataTable" in request.GET.keys():
                ListViewMixin.__init__(self, **kwargs)
                return self._datable_class().get(request, *args, **kwargs)
        if "autoComplete" in request.GET.keys():
            return self._auto_complete_class.as_view()(request)
        self.form_widgets_design(*args, **kwargs)
        if not hasattr(self.form_name, 'helper'):
            self.form_designer(*args, **kwargs)
        return super(BaseView, self).get(request, *args, **kwargs)

    

    def form_designer(self, *args, **kwargs):
        self.form_name.helper = FormHelper()
        self.form_name.helper.layout = Layout(
            Row(*[Column(field, css_class="col col-lg-6 col-md-4 col-sm-12") for field in self.form_name.fields.keys()],
                css_class="form_group"))
        self.form_name.helper.form_tag = False

    def form_widgets_design(self, *args, **kwargs):
        for field in self.form_name.fields.values():

            temp = FIELD_WIDGET.get(field.widget.__class__)
            # if temp:
            #     field.widget = temp()

    def auto_complete_widgets(self):
        super(BaseView, self).auto_complete_init()


class TreeView(ViewMixin, TreeViewMixin, AutoCompleteMixin):
    columns = []
    has_datatable = True
    template_name = 'tree.html'
    _css_files = []
    _js_files = ['js/initialize_tree_view.js']
    # auto_complete_fields = ['parent__name']
    def setup(self, request, *args, **kwargs):
        self.form_name = self.form_name()
        return super(TreeView, self).setup(request, *args, **kwargs)

    get_datatable_verbose_name = BaseView.get_datatable_verbose_name
    form_designer = BaseView.form_designer
    form_widgets_design = BaseView.form_widgets_design
    delete = BaseView.delete

    def get(self, request, *args, **kwargs):
        self.auto_complete_init()
        if self.has_datatable:
            self.get_datatable_verbose_name()
            if "gridView" in request.GET.keys():
                return self.get_tree_view(request, request.GET.get('id', None))
        if "autoComplete" in request.GET.keys():
            return self._auto_complete_class.as_view()(request)
        self.form_widgets_design(*args, **kwargs)
        if not hasattr(self.form_name, 'helper'):
            self.form_designer(*args, **kwargs)
        return super(TreeView, self).get(request, *args, **kwargs)

    def on_render(self, request, *args, **kwargs):
        self.context['list_fields'] = self.columns[1:]
        return super(TreeView, self).on_render(request, *args, **kwargs)