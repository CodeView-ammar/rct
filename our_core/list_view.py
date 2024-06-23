
from django.db import transaction
from django.http import HttpResponseNotFound
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.views.generic import TemplateView
from django_datatables_view.base_datatable_view import BaseDatatableView
from our_core.exceptions import ImproperlyConfigured
from django.utils.html import format_html
from django.db.models import Q
from our_core.json_response import json_response
from django.apps import apps
from django.db import models
from permission.permission.permission import has_screen
def create_datatable(self1, ind=True, with_details=False):
    class MainDataTable(BaseDatatableView):
        model = self1.model_name
        # columns = ['id','DT_RowId', *self1.list_fields if hasattr(self1,'list_fields') else *list(), 'action']
        columns = ['id', *self1.list_fields]
        if with_details:
            columns.append('details')
        columns.append('action')
        order_columns = columns

        def get_initial_queryset(self):
            return self1.get_initial_queryset(self)
        
        counter = 0
        def has_permission(self, permission_type, obj=None):
            """
            Checks if the current user has the necessary permission for the specified action and object.

            - permission_type: 'view', 'edit', or 'delete'
            - obj (optional): The object to check permission on (defaults to None)
            """
            return has_screen(self1.request,self1.model_name.__name__.lower(),permission_type)

        def render_column(self, row, column):
            
            if column == 'id':
                self.counter += 1
                return self.counter
            
            if column == 'action':
                action_=''
                if self.has_permission('edit'):
                    action_= self1.data_table_edit_actions(id=row.id if ind else row['id'],
                                                url=reverse(self1.__class__.__name__))
                if self.has_permission('delete'):
                    action_+= self1.data_table_delete_actions(id=row.id if ind else row['id'],
                                             url=reverse(self1.__class__.__name__))
                return action_
            
            else:
                if with_details:
                    if column == 'details':
                        return format_html('<i class="fa fa-plus"></i>')
                return self1.render_column(self, row, column)

        def prepare_results(self, qs):
            return self1.prepare_results(self, qs)

        def filter_queryset(self, qs):
            try:
                temp_column = self._columns.pop()
                temp_data = self.columns_data.pop()
                if with_details:
                    temp_column1 = self._columns.pop()
                    temp_data1 = self.columns_data.pop()

            except:
                pass
            temp_result = self1.filter_queryset(self, qs)
            try:
                self._columns.append(temp_column)
                self.columns_data.append(temp_data)
                if with_details:
                    self._columns.append(temp_column1)
                    self.columns_data.append(temp_data1)
            except:
                pass
            return temp_result
            
        def get_context_data(self, *args, **kwargs):
            return self1.get_context_data(self, *args, **kwargs)

    return MainDataTable


class ListViewMixin:
    defaults = dict()
    list_fields = None
    search_fields = []
    _table_type = {1: 'bordered', 2: 'borderless', 3: 'striped',
                   4: 'hover', 5: 'dark', 6: 'light', 7: 'success', 8: 'info',
                   9: 'primary', 10: 'warning', 11: 'danger'}
    table_type = 2
    with_data_table = True
    """
        with_enabled=["1","2","3"]
        i-name filde
        2-value is the name of the True
        3-value is the name of the False  
    """
    with_enabled=["","",""]

    def __init__(self, **kwargs):
        if self.list_fields is None:
            model_fields = [field.name for field in self.model_name._meta.fields]
            form_fields = list(self.form_name._meta.fields)
            self.list_fields = [field for field in form_fields if field in model_fields]
        if not isinstance(self.table_type, int):
            raise ImproperlyConfigured(
                ("table_type attribute for '%s' must be a int type or an instance of it." % self.__class__.__name__)
            )
        elif self.table_type <= 0 or self.table_type > 11:
            raise ImproperlyConfigured(
                (
                    "table_type attribute for '{0}' must be between[1 - 11] ( > 0 and <= 11)!\nprovided value is '{1}'.".format(
                        self.__class__.__name__, self.table_type)
                ))

        self._datable_class = create_datatable(self)

    def get_initial_queryset(self, self1):
        return super(self1.__class__, self1).get_initial_queryset()

    # def get_fields_verbose_name(self):
    #     model_fields = {field.name: field.verbose_name for field in self.model_name._meta.fields}
    #     counter = 0
    #     for field in self.defaults['list_fields']:
    #         if field in list(model_fields.keys()):
    #             self.defaults['list_fields'][counter] = model_fields[field]
    #         counter += 1

    def render_column(self, self1, row, column):
        if self.with_enabled[0]:
            if column == self.with_enabled[0]:
                print("ammarsss"*10)
                if row.__dict__.get(self.with_enabled[0]):
                    return self.with_enabled[1]
                else:
                    return self.with_enabled[2]
        return super(self1.__class__, self1).render_column(row, column)

    def prepare_results(self, self1, qs):
        return super(self1.__class__, self1).prepare_results(qs)

    def filter_queryset(self, self1, qs):
        # sSearch = self.request.GET.get("sSearch", None)
        # if sSearch:
        #     filter_q = Q()
        #     if self.search_fields:
        #         for field in self.search_fields:
        #             filter_q = filter_q | Q(**{field + '__icontains': sSearch})
        #         qs = qs.filter(filter_q)
        #         return qs
        sSearch = self.request.GET.get("sSearch", None)
        if sSearch:
            search_queries = Q()
            if self.search_fields:
                for field_name in self.search_fields:
                    search_queries |= Q(**{'{0}__icontains'.format(field_name): sSearch})
            else:
                for field_name in self.columns:
                    search_queries |= Q(**{'{0}__icontains'.format(field_name): sSearch})
            qs = qs.filter(search_queries)
        return qs
    
        return super(self1.__class__, self1).filter_queryset(qs)

    def get_datatable_verbose_name(self):
        temp_columns = []
        temp_foreign_columns = []
        if self.columns:
            for item in self.columns:
                if isinstance(item, tuple):
                    temp_columns.append(item[0])
                    temp_foreign_columns.append(item[1])
                else:
                    temp_columns.append(item)
                    field_name = self.model_name._meta.get_field(item)
                    temp_foreign_columns.append(
                        field_name.verbose_name if hasattr(field_name, 'verbose_name') else field_name.name)
        elif hasattr(self, 'form_name'):
            temp_model_dict = {field.name: field.verbose_name for field in self.model_name._meta.get_fields() if
                               hasattr(field, 'verbose_name')}
            temp_form_list = self.form_name.fields.keys()
            for field in temp_form_list:
                if field in temp_model_dict.keys():
                    temp_columns.append(field)
                    temp_foreign_columns.append(temp_model_dict[field])
        else:
            raise Exception('The columns for class {} must be given'.format(self.__class__.__name__))
        self.columns = temp_foreign_columns
        self.list_fields = temp_columns

    def data_table_edit_actions(self, id, url):
        return '<a class="edit_row" data-url="{3}" data-id="{0}" style="DISPLAY: -webkit-inline-box;"  ' \
               'data-toggle="tooltip" title="{1}"><i class="fa fa-edit text-primary"></i></a>'.format(id, _("Edit"),
                                                                                                         _("Delete"),
                                                                                                         url)
    def data_table_delete_actions(self, id, url):
        return '<a class="delete_row" ' 'data-url="{3}" data-id="{0}" style="DISPLAY: -webkit-inline-box;"  ' \
               'data-toggle="tooltip" ' 'title="{2}"><i class="fa fa-trash text-danger"></i></a>'.format(id, _("Edit"),
                                                                                                         _("Delete"),
                                                                                                         url)
    def get_context_data(self, self1, *args, **kwargs):
        return super(self1.__class__, self1).get_context_data(*args, **kwargs)

class TreeViewMixin:
    list_fields = []
    search_fields = []

    def create_tree_view(self, request, with_filter=dict(), *args, **kwargs):

        self._tree_view = self.get_tree_data(self, request, with_filter, *args, **kwargs)

    def get_tree_view(self, request, parent_filter=None):
        return json_response(self.get_tree_data(request, parent_filter))

    def get_tree_data(self, request, parent_filter):
        return_results = {'status': 'ok'}
        with transaction.atomic():
            return_results['data'] = self.hierarchical(parent_filter)
        return return_results

    def hierarchical(self, parent_id=None):
        filtered_value = {'parent_id': parent_id}
        return_list = []
        temp_results = self.model_name.objects.filter(**filtered_value)
        if temp_results:
            for obj in temp_results:
                temp = dict()
                for field in ['id', *self.list_fields]:
                    temp[field] = getattr(obj, field)
                temp_children = self.hierarchical(obj.id)
                if temp_children:
                    temp['children'] = temp_children
                return_list.append(temp)
            return return_list
        else:
            return []

class ListView(ListViewMixin,TemplateView):
    # This class to create only datatable without form
    columns = None
    def __init__(self):
        pass
    def get(self, request, *args, **kwargs):
        if "dataTable" in request.GET.keys():
            self.get_datatable_verbose_name()
            if self.columns is None:
                raise ImproperlyConfigured(
                    _(
                        "list_fields must be not None at {}".format(
                            self.__class__.__name__)
                    ))
            if not isinstance(self.table_type, int):
                raise ImproperlyConfigured(
                    _(
                        "table_type attribute for '%s' must be a int type or an instance of it." % self.__class__.__name__)
                )
            elif self.table_type <= 0 or self.table_type > 11:
                raise ImproperlyConfigured(
                    _(
                        "table_type attribute for '{0}' must be between[1 - 11] ( > 0 and <= 11)!\nprovided value is '{1}'.".format(
                            self.__class__.__name__, self.table_type)
                    ))

            self.defaults['list_fields'] = ['#', *self.list_fields, _('Operations')]
            self.get_fields_verbose_name()
            self._datable_class = create_datatable(self)
            return self._datable_class().get(request, *args, **kwargs)
        else:
            return HttpResponseNotFound('Not Found')

class ModelListViewMixin(ListViewMixin):
    def __init__(self, **kwargs):
        if self.list_fields is None:
            model_fields = list([field.name for field in self.model_name._meta.base_field])
            form_fields = list(self.form_name.base_field.keys())
            self.list_fields = [field for field in form_fields if field in model_fields]
        if not isinstance(self.table_type, int):
            raise ImproperlyConfigured(
                _("table_type attribute for '%s' must be a int type or an instance of it." % self.__class__.__name__)
            )
        elif self.table_type <= 0 or self.table_type > 11:
            raise ImproperlyConfigured(
                _(
                    "table_type attribute for '{0}' must be between[1 - 11] ( > 0 and <= 11)!\nprovided value is '{1}'.".format(
                        self.__class__.__name__, self.table_type)
                ))
        self.defaults['list_fields'] = ['#', *self.list_fields, _('Details'), _('Action')]
        self._datable_class = create_datatable(self, True)

    def get_initial_queryset(self, self1):
        if self1.request.GET.get('filtered_id'):
            return self1.model_name.objects.filter(**{self1.fk_name + '_id': self.request.GET.gat('filtered_id')})
        else:
            return super(ModelListViewMixin, self).get_initial_queryset(self1)