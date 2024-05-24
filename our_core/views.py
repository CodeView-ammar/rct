
# import json
from django.db import transaction, IntegrityError
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.shortcuts import render
from django.urls import reverse
# from django.utils.translation import gettext_lazy as _
from django.views.generic.base import View
from django.core import serializers
from dal import autocomplete
from django.http import QueryDict

# from django.serializers.json import DjangoJSONEncoder

from permission.permission.permission import has_screen
from permission.permission.permission import has_tab
from permission.permission.permission import has_system
from permission.permission.permission import has_partion
from our_core.exceptions import JsonResponseExceptions
from our_core.our_messages import message

from django.views.generic import CreateView

from django.views.generic import CreateView
from django.contrib import messages  # Assuming you use Django messages framework
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.decorators import permission_required  # Assuming you use Django's permission system
from django.utils.decorators import method_decorator  # For applying decorators at the class level
from django_datatables_view.base_datatable_view import BaseDatatableView 
from django.db.models import Q ,Max
from django.core import serializers
from django.forms import formset_factory
# class GenericCreateView(CreateView):
#     model_name = None  # Needs to be defined in the child class
#     urls_form=None
#     urls_json=None
#     form_name = None  # Needs to be defined in the child class
#     permission_code = None  # Optional, permission code for adding (if using permissions)
#     title_form = None  # Optional, define in child class or use model_name by default
#     exclude_field_view=[]
#     template_name = 'core/core.html'
#     css_files = []
#     js_files = ['js/core/core.js']
#     context={}
    
#     def on_render(self, request, *args, **kwargs):
#         return render(request, self.template_name, self.context)

#     def on_save(self, request, *args, **kwargs):
#         self.form_name = self.form_name.__class__(request.POST,request.FILES)
#         kwargs['action'] = 'save'
#         return self.save_and_update(request, *args, **kwargs)

#     def save_and_update(self, request, *args, **kwargs):
#         form_validated = self.form_name.is_valid()
#         if form_validated:
#             self._obj = self.save_form(request, *args, **kwargs)
#             self.save_model(request, self._obj, *args, **kwargs)
#             if kwargs['action'] == 'save':
#                 if self._obj.id:
#                     msg = message.add_successfully()
#                     result = {"status": 1, "message": msg}
#                 else:
#                     msg = message.add_error()
#                     result = {"status": 2, "message": msg}
#             elif kwargs['action'] == 'update':
#                 if self ._obj.id:
#                     msg = message.update_successfully()
#                     result = {"status": 1, "message": msg}
#                 else:
#                     msg = message.edit_error()
#                     result = {"status": 2, "message": msg}
#         else:
#             result = {"status": 0, "error": self.form_name.errors.as_json()}

#         return JsonResponse(result)

#     def save_model(self, request, obj, *args, **kwargs):
#         oj=None
#         if kwargs['action'] == 'save' or kwargs['action'] == 'update':
#             obj.save()
#             return obj
#     def save_form(self, request, *args, **kwargs):
#         return self.form_name.save(commit=False)

#     def on_update(self, request, *args, **kwargs):
#         data = get_object_or_404(self.model_name, pk=int(request.POST.get("id")))
#         self.form_name = self.form_name(request.POST,instance=data)
#         kwargs['action'] = 'update'
#         return self.save_and_update(request, *args, **kwargs)

#     def get(self, request, *args, **kwargs):
#         if "id" in request.GET.keys():
#             return JsonResponse(self.get_data(request, *args, **kwargs))
#         else:
#             return self.get_context(request, *args, **kwargs)

#     def get_data(self, request, *args, **kwargs):
#         if request.GET.get("id"):
#             try:
#                 data = self.model_name.objects.filter(pk=request.GET.get("id"))
#                 result = {"status": 1, "data": serializers.serialize("json", data)}
#             except IntegrityError:
#                 raise
#         else:
#             result = {"status": 0, "data": ""}
#         return result

#     def get_context(self, request, *args, **kwargs):
#         self.request.session["select_menu"] = {"CustomerDataView": "activeli","Customer":"active mm-active"}
#         self.context['form'] = self.form_name()
#         list_fields=[_(field.replace("_"," ")) for field in self.fields if field not in self.exclude_field_view]
#         list_fields.append("action")
#         self.context["js_files"]=self.js_files
#         self.context["permission_code"]=self.permission_code
#         self.context['field'] = list_fields
#         self.context['urls_form'] = reverse(self.urls_form)  # Assuming URL pattern matches model name
#         self.context['urls_json'] = reverse(self.urls_json)  # Assuming URL pattern matches model name
#         self.context['title_form'] = _(self.title_form)
    
#         return self.on_render(request, *args, **kwargs)

#     def post(self, request, *args, **kwargs):
#         if request.POST.get("id"):
#             try:
#                 with transaction.atomic():
#                     return self.on_update(request, *args, **kwargs)
#             except JsonResponseExceptions as e:
#                 return JsonResponse(e.args[0])
#             except Exception as e:
#                 raise e
#         else:
#             try:
#                 with transaction.atomic():
#                     return self.on_save(request, *args, **kwargs)
#             except JsonResponseExceptions as e:
#                 return JsonResponse(e.args[0])
#             except Exception as e:
#                 raise e
            
#     # def delete_data(self, request, *args, **kwargs):

#     def delete(self, request, *args, **kwargs):
#         pk = int(QueryDict(request.body).get("id"))

#         if pk:
#             data = get_object_or_404(self.model_name, pk=pk)
#             index = 1
#             # relation = data.is_deletable()
#             print("aaaaaaaaaaaa"*10)
#             if index:
#                 data.delete()
#                 msg = message.delete_successfully()
#                 result = {"status": 1, "message": msg}
#             else:
#                 msg = message.delete_error_operation(relation)
#                 result = {"status": 0, "message": msg}
#         else:
#             msg = message.delete_error()
#             result = {"status": 0, "message": msg}
#         return JsonResponse(result)


# class GenericCreateJson(BaseDatatableView):
#     """List Customer Groups (Base Class for DataTables in Your Application)

#     This class provides a foundation for creating DataTables with common functionalities
#     like permission checks, column definitions, and basic rendering.

#     Inherit from this class for your specific DataTables and override methods as needed.
#     """

#     model = None  # Needs to be defined in the child class (the model the view works with)
#     permission_code = None  # Optional, permission code for viewing the data (default: None)
#     urls_form=None
#     urls_json=None
#     columns = []  # Override in child class to define specific columns
#     search_fields=[]
#     count=0
#     def get_initial_queryset(self):
#         """
#         Returns the initial queryset for the datatable.

#         This method can be overridden in child classes to apply custom filtering
#         or sorting based on request parameters.

#         By default, it checks for viewing permission and returns all objects if allowed.
#         """

#         if self.has_permission('view'):
#             return self.model.objects.all()
#         else:
#             return self.model.objects.none()

#     def get(self, request, *args, **kwargs):
#         return super().get(request, *args, **kwargs)  # Call the parent class's GET method for datatable handling
   
#     def render_column(self, row, column):
#         """
#         Render a specific column for the datatable.

#         This method can be overridden in child classes to customize the way
#         columns are displayed, including adding action buttons or formatting data.

#         The default implementation returns the value from the corresponding model field.
#         """

#         if column == "id" or column == "#":
#             self.count += 1
#             return self.count

#         if column == "action":
#             if self.has_permission('edit') and self.has_permission('delete'):
#                 # Display both edit and delete buttons
#                 edit_url = reverse(self.urls_form)  # Replace with your URL pattern
#                 delete_url = reverse(self.urls_form)  # Replace with your URL pattern
#                 return f'<a class="edit_row" data-url="{edit_url}" data-id="{row.pk}" data-toggle="tooltip" title="{_("Edit")}"><i class="fa fa-edit"></i></a><a class="delete_row" data-url="{delete_url}" data-id="{row.pk}" data-toggle="tooltip" title="{_("Delete")}"><i class="fa fa-trash"></i></a>'
#             elif self.has_permission('delete'):
#                 # Display only delete button
#                 delete_url = reverse(self.urls_form)  # Replace with your URL pattern
#                 return f'<a class="delete_row" data-url="{delete_url}" data-id="{row.pk}" data-toggle="tooltip" title="{_("Delete")}"><i class="fa fa-trash"></i></a>'
#             elif self.has_permission('edit'):
#                 # Display only edit button
#                 edit_url = reverse(self.urls_form)  # Replace with your URL pattern
#                 return f'<a class="edit_row" data-url="{edit_url}" data-id="{row.pk}" data-toggle="tooltip" title="{_("Edit")}"><i class="fa fa-edit"></i></a>'
#             else:
#                 # No permission, return empty string
#                 return ''
#         else:
#             return super().render_column(row, column)
#     def has_permission(self, permission_type):
#         """
#         Checks if the current user has the necessary permission for the specified action.

#         This method assumes you're using Django's permission system. You might need to
#         adjust it if you're using a different permission mechanism.

#         - permission_type: 'view', 'edit', or 'delete'
#         """

#         if has_screen(self.request,self.permission_code,permission_type):
#             return True
#         else:
#             return False
    
#     def filter_queryset(self, qs):
#         sSearch = self.request.GET.get("sSearch", None)
#         if sSearch:
#             search_queries = Q()
#             if self.search_fields:
#                 for field_name in self.search_fields:
#                     search_queries |= Q(**{'{0}__icontains'.format(field_name): sSearch})
#             else:
#                 for field_name in self.model._meta.get_fields():
#                     if field_name.get_internal_type() == 'CharField':
#                         search_queries |= Q(**{'{0}__icontains'.format(field_name.name): sSearch})
#             qs = qs.filter(search_queries)
#         return qs
    

import inspect,os
def check_number_field(model):
    fields = model._meta.get_fields()
    if any(field.name == "number" for field in fields):
        return True
    else:
        return False
def max_number(model):
    if check_number_field(model):
        id_max = model.objects.all().aggregate(Max("number"))["number__max"]
        if id_max == None:
            n =  1
            return str(n)
        else:
            id_max = int(id_max) + 1
            n = id_max
            return str(n)
    else:
        return None


class ViewMixin(View):
    model_name = None
    form_name = None
    modal_size = None
    title_form = None
    title_list = None
    type_page=1
    template_name = 'core/core.html'
    permission_code=None
    css_files = []
    has_datatable = True
    view_header_control=True
    _css_files = []
    _js_files = []
    _obj = None
    breadcrumbs=[]
    model_formset=None
    overwrite=[]
    def save_and_update(self, request, *args, **kwargs):
        form_validated = self.form_name.is_valid()
        objs_=0
        if form_validated:
            self._obj = self.save_form(request, *args, **kwargs)
            objs_=self.save_model(request, self._obj, *args, **kwargs)
            if self.model_formset:
                DataFormset = formset_factory(form=self.model_formset[1], min_num=0)
                formset = DataFormset(request.POST, prefix=self.permission_code)
                if formset.forms:
                    for form in formset.forms:
                        if form.is_valid():
                            obj = form.save(commit=False)
                            obj.__dict__[(self.model_name.__name__+"_id").lower()] =objs_.id
                            obj.created_by=request.user
                            obj.save()
                        else:
                            raise IntegrityError 
            if kwargs['action'] == 'save':
                if self._obj.id:
                    
                    msg = message.add_successfully()
                    result = {"status": 1, "message": msg,"max_number":max_number(self.model_name)}
                else:
                    msg = message.add_error()
                    result = {"status": 2, "message": msg}
            elif kwargs['action'] == 'update':
                if self ._obj.id:
                    msg = message.update_successfully()
                    result = {"status": 1, "message": msg,"max_number":max_number(self.model_name)}
                else:
                    msg = message.edit_error()
                    result = {"status": 2, "message": msg}
        else:
            result = {"status": 0, "error": self.form_name.errors.as_json()}

        return JsonResponse(result)

    
    def get_data(self, request, *args, **kwargs):
        if request.GET.get("id"):
            try:
                formset=''
                if self.model_formset:
                    
                    model_name_str = (self.model_name.__name__+"_id").lower()  # Get the model name as a string
                    formsetdata = self.model_formset[0].objects.filter(
                        **{model_name_str: int(request.GET.get("id"))}
                    )
                    
                    formset={"data": serializers.serialize("json", formsetdata),"prefix":self.permission_code},
                data = self.model_name.objects.filter(pk=request.GET.get("id"))
                result = {"status": 1, "data": serializers.serialize("json", data),"formset":formset}
            except IntegrityError:
                raise
        else:
            result = {"status": 0, "data": ""}
        return result


    def on_render(self, request, *args, **kwargs):

        model_file = inspect.getfile(self.model_name)
        model_folder = os.path.basename(os.path.dirname(model_file))
        request.session["select_menu"] = {self.model_name.__name__+"View": "activeli",model_folder:"active mm-active"}
        if self.template_name!='core/core.html':
        
            template_name_=self.template_name
        else:    
            template_name_=self.template_name
            if self.type_page==2:
                template_name_='core/page_model_core.html'
        return render(request,template_name_, self.context)

    def on_save(self, request, *args, **kwargs):
        self.form_name = self.form_name.__class__(request.POST,request.FILES)
        kwargs['action'] = 'save'
        return self.save_and_update(request, *args, **kwargs)

    def has_permission(self, permission_type):
        """
        Checks if the current user has the necessary permission for the specified action.

        This method assumes you're using Django's permission system. You might need to
        adjust it if you're using a different permission mechanism.

        - permission_type: 'view', 'edit', or 'delete'
        """
        if  self.permission_code:
            permission_code_=self.permission_code
        else:
            permission_code_=self.model_name.__name__+"View"
        if has_screen(self.request,self.permission_code,permission_type):
            return True
        else:
            return False
    

    def save_model(self, request, obj, *args, **kwargs):
        if kwargs['action'] == 'save' or kwargs['action'] == 'update':
            obj.save()
            return obj
    def save_form(self, request, *args, **kwargs):
        return self.form_name.save(commit=False)

    def on_update(self, request, *args, **kwargs):
        data = get_object_or_404(self.model_name, pk=int(request.POST.get("id")))
        self.form_name = self.form_name.__class__(request.POST,
                                        instance=data)
        if self.model_formset:
            model_name_str = (self.model_name.__name__+"_id").lower()  # Get the model name as a string
            formsetdata = self.model_formset[0].objects.filter(
                **{model_name_str: int(request.POST.get("id"))}
            ).delete()
                    
        kwargs['action'] = 'update'
        return self.save_and_update(request, *args, **kwargs)
    def get_context_custome(self):
        
        return self
    def get(self, request, *args, **kwargs):
        if "id" in request.GET.keys():
            return JsonResponse(self.get_data(request, *args, **kwargs))
        else:
            return self.get_context(request, *args, **kwargs)
            
    def delete(self, request, *args, **kwargs):
        pk = int(QueryDict(request.body).get("id"))

        if pk:
            data = get_object_or_404(self.model_name, pk=pk)
            if self.model_formset:
                model_name_str = (self.model_name.__name__+"_id").lower()  # Get the model name as a string
                self.model_formset[0].objects.filter(
                    **{model_name_str: int(pk)}
                ).delete()
        
            index = 1
            if index:
                data.delete()
                msg = message.delete_successfully()
                result = {"status": 1, "message": msg,"max_number":max_number(self.model_name)}
            else:
                msg = message.delete_error_operation(relation)
                result = {"status": 0, "message": msg}
        else:
            msg = message.delete_error()
            result = {"status": 0, "message": msg}
        return JsonResponse(result)

    def get_context(self, request, *args, **kwargs):
        formset_=None
        
        if self.model_formset:
            formset_=self.core_formset(self, request)
        self.context = {
            "breadcrumbs":self.breadcrumbs[0],
            "permission_code":self.permission_code,
            "form": self.form_name,
            "modal_size": self.modal_size,
            "url": reverse(self.__class__.__name__),
            "title_form": _(self.title_form),
            "title_list": _(self.title_list),
            'css_files':self._css_files,
            'has_datatable':self.has_datatable,
            "view_header_control":self.view_header_control,
            'js_files':['js/core/core.js']+self._js_files,
            'list_fields':self.columns,
            "formset":formset_,
            "overwrite":self.overwrite,
            "custom":self.get_context_custome
        }
        return self.on_render(request, *args, **kwargs)
    def core_formset(self, request, *args, **kwargs):
        """Method Load Formset  For table Sales Bill
        """
        formset_=None
        
        if self.model_formset:
            DataFormset = formset_factory(form=self.model_formset[1], extra=1)
            formset_ = DataFormset(self.request.POST or None, prefix=self.permission_code)
        
        id_ = self.request.GET.get("id")

        if id_:
            data = AddressDetail.objects.filter(id=id_)
            data_iterator = iter(data)
            DataFormset = formset_factory(form=self.model_formset[1], extra=len(data))
            formset = DataFormset(
                self.request.POST or None, prefix=self.permission_code, form_kwargs={"row": data_iterator}
            )
        else:
            DataFormset = formset_factory(form=self.model_formset[1], extra=1)
            formset = DataFormset(self.request.POST or None, prefix=self.permission_code)
         
        return  formset   
     
    # def delete(self)
        

    def post(self, request, *args, **kwargs):
        result = {"status": "", "message": "", "error": ""}

        if request.POST.get("id"):
            if not has_screen(self.request, self.permission_code, "edit"):  # check permission
                result["status"] = 2
                result["message"] = {
                    "message": _("You Don't have Premission edit on {0}".format(self.title_list)),
                    "class": "alert alert-danger",
                }
                return JsonResponse(result)
            try:
                with transaction.atomic():
                    return self.on_update(request, *args, **kwargs)
            except JsonResponseExceptions as e:
                return JsonResponse(e.args[0])
            except Exception as e:
                raise e
        else:
            if not has_screen(self.request, self.permission_code, "add"):  # check permission
                result["status"] = 2
                result["message"] = {
                    "message": _("You Don't have Premission Add on {0}".format(self.title_list)) ,
                    "class": "alert alert-danger",
                }
                return JsonResponse(result)
            try:
                with transaction.atomic():
                    return self.on_save(request, *args, **kwargs)
            except JsonResponseExceptions as e:
                return JsonResponse(e.args[0])
            except Exception as e:
                print("e.args[0]")
                msg=""
                print(e.args[0])
                if str(e.args[0])=="1062":
                    msg="الاسم {0} مكرر سابقأ: ".format(e.args[1].split("'")[1])
                else:
                    msg=e.args[1]

                result["status"] = 2
                result["message"] = {
                    "message": _("{0}".format(msg)),
                    "class": "alert alert-danger",
                }
                return JsonResponse(result)



from django.apps import apps
class Autocomplete(autocomplete.Select2QuerySetView):
    model = None
    field = None

    def dispatch(self, request, *args, **kwargs):
        self.model = kwargs['model']
        self.field = kwargs['field']
        return super(Autocomplete, self).dispatch(request, *args, **kwargs)

    def get_queryset(self):

        Model = apps.get_model('core',self.model)
        if not self.request.user.is_authenticated:
            return self.model.objects.none()
        qs = Model.objects.all()
        if self.q:
            qs = qs.filter(name__istartswith=self.q)
        return qs

from django.apps import apps
class Autocomplete(autocomplete.Select2QuerySetView):
    model = None
    field = None

    def dispatch(self, request, *args, **kwargs):
        self.model = kwargs['model']
        self.field = kwargs['field']
        return super(Autocomplete, self).dispatch(request, *args, **kwargs)

    def get_queryset(self):

        Model = apps.get_model('core',self.model)
        if not self.request.user.is_authenticated:
            return self.model.objects.none()
        qs = Model.objects.all()
        if self.q:
            qs = qs.filter(name__istartswith=self.q)
        return qs