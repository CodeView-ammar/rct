from init_input.trainer.forms import TrainerForm,customUserForm
from init_input.models import Trainer
from django.utils.translation import gettext_lazy as _
from our_core.baseview import BaseView
import inspect,os
from django.shortcuts import render
from django.urls import reverse
from our_core.exceptions import JsonResponseExceptions
from django.db import transaction, IntegrityError
from django.http import JsonResponse
from our_core.our_messages import message


class TrainerView(BaseView):
    
    model_name=Trainer
    form_name=TrainerForm
    modal_size='xl'
    template_name="trainer/trainer.html"
    type_page=2
    title_form=_("trainer")
    title_list=_("trainer")
    columns = ["User","fullname","birthday","phone","section"]
    search_fields = columns
    permission_code = 'TrainerView'  # Optional, permission code for adding
    breadcrumbs=[
                    {'label': _('Home'), 'url': '/',"is_active":False},
                    {'label': title_form, 'url': '#',"is_active":True}
                 ],

    def get_context(self, request, *args, **kwargs):
        formset_=None

        if self.model_formset:
            formset_=self.core_formset(self, request)
        self.context = {
            "breadcrumbs":self.breadcrumbs[0],
            "permission_code":self.permission_code,
            "form": customUserForm,
            "form2": TrainerForm,
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
    
    def post(self, request, *args, **kwargs):
        result = {"status": "", "message": "", "error": ""}
        userform=customUserForm(request.POST)
        Traform=TrainerForm(request.POST or None)
        print(request.POST.get('username'))

        if not self.has_permission('add'):  # check permission
            result["status"] = 2
            result["message"] = {
                "message": _("You Don't have Premission Add on {0}".format(self.title_list)) ,
                "class": "alert alert-danger",
            }
            return JsonResponse(result)
       
        try:
            with transaction.atomic():
                if userform.is_valid():
                    user_=userform.save()
                    user_.save() 
                    if Traform.is_valid():
                        Tra_=Traform.save()
                        print("user_.id"*100)
                        print(user_.id)
                        Tra_.User.id=user_.id
                        Tra_.save()
                        msg = message.add_successfully()
                        result = {"status": 1, "message": msg,"max_number":""}
                    else:
                        msg = message.add_error()
                        result = {"status": 0, "message": msg,"max_number":""}
                else:
                    msg = message.add_error()
                    result = {"status": 0, "message": msg,"max_number":""}
                return JsonResponse(result)
        except JsonResponseExceptions as e:
            return JsonResponse(e.args[0])
        except Exception as e:
            print("e.args[0]")
            msg=""
            print(e)

            result["status"] = 2
            result["message"] = {
                "message": _("{0}".format(msg)),
                "class": "alert alert-danger",
            }
            return JsonResponse(result)

