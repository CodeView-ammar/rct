import json
from django.shortcuts import render
from django.shortcuts import HttpResponseRedirect
from django.shortcuts import HttpResponse
from django.shortcuts import reverse
from django.shortcuts import redirect
from django.shortcuts import get_object_or_404
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth import authenticate, login as login_user, logout as logout_user
from django.db.models import Q

from django.contrib.auth.decorators import login_required, permission_required
from django.contrib.auth.hashers import make_password


from django_datatables_view.base_datatable_view import BaseDatatableView
from django.db import transaction
from django.db import IntegrityError
from django.core.cache import cache

from django.views.generic import ListView
from django.views.generic import CreateView
from django.views.generic import DeleteView
from django.views.generic import UpdateView
from django.core import serializers

from django.conf import settings

from django.http import JsonResponse
from django.http import HttpResponse
from django.http import QueryDict
from django.utils.decorators import method_decorator
from django.contrib import messages
from our_core.our_messages import message

from permission.models import ActivityKey,info_client
from permission.permission.permission import has_screen


from permission.forms import ActivateKeyForm,ActivationForm,unit_actionForm
import subprocess
# import rsa
from training import database
# from cryptography.fernet import Fernet
from datetime import datetime
 

class get_id:

    def get():
        hwid=str(subprocess.check_output("wmic csproduct get uuid"),'utf-8').split('\n')[1].strip()
        enchwid = hwid
        return enchwid
  

def splirepla(txt):

    txt=str(txt).replace("'", "")
    return txt[1:]

def decruypt(txt,f):
    eb =bytes(txt,'utf-8')
    key2=f.decrypt(eb) 
    return splirepla(key2)



class ActivityKeyView(CreateView):
    """
     show main user page  and  add & delete and edit 
    """

    def get(self, request, *args, **kwargs):

        d=get_id.get()
        
        Ac=ActivityKey.objects.all()
        context = {}
        if "id" in request.GET.keys():

            result = {"status": 0, "data": ""}

            return JsonResponse(result)
        form = ActivateKeyForm()
        Acaa=ActivityKey.objects.all()
        context['get_id'] =d+"-"+str(datetime.now().strftime('%Y'))
        context['form'] =form
        if not Acaa:      
            return render(request, 'system_init/activate_key.html', context)
            
        else:
            return redirect('app/login/?next=/')
        
            

    def post(self, request, *args, **kwargs):
        
        form = ActivateKeyForm(request.POST)
        if request.method == 'POST':
            
            key2=request.POST.get('activate_key2')
            # f = Fernet(database.key_encrypt)
            # key2d=decruypt(key2,f)
            # key1=get_id.get()+"-"+str(datetime.now().strftime('%Y'))

            # if(key1==key2d):
            # if request.method == "POST" and request.is_ajax():
            #     obj=ActivityKey.objects.create(activity_key=str(key2),info_cpu=str(key1))
            #     obj.save()
            result = {'status': 1,"url":request.build_absolute_uri("/"), 'message': "تم تفعيل النظام "}
            # else:
            #     result = {'status': 0, 'message': "يجب إدخال السريال "}

            # else:
            #     result = {'status': 0, 'message': "السريل الذي ادخلتة غير صحيح"}

        return JsonResponse(result)


class ActivitonView(CreateView):
    """
     show main user page  and  add & delete and edit 
    """

    def get(self, request, *args, **kwargs):

        context = {}
        form = ActivationForm()
        
        context['form'] =form
        return render(request, 'system_init/activiton.html', context)

            

    def post(self, request, *args, **kwargs):
        form = ActivationForm(request.POST)
        hwid=request.POST.get('activate_key1')
        
      
        if form.is_valid():
            obj = form.save(commit=False)
            obj.activate_key2=hwid
            obj.save()
            msg = message.add_successfully()
            result = {"status": 1, "activate_key2":hwid,"message": msg}
        else:
            
            result = {"status": 0, "message":" msg"}
       
        return JsonResponse(result)

class unit_actionView(CreateView):
    """
    unit_actionView for create new Account Type
    """

    def get(self, request, *args, **kwargs):
        request.session["top_menu"] = {"warehouse": "active"}
        request.session["sup_top_menu"] = {"warehouse_initialization": "active mm-active"}
        request.session["sub_menu"] = {"unit_action_view": "activeli"}

   

        
        from django.db.models import Max   
        max_code = info_client.objects.aggregate(Max("id"))
        if not max_code["id__max"]:
            max_code["id__max"] = 0
        initial_dict = {
            "code": "%03d" % int(max_code["id__max"] + 1),
        }
        form = unit_actionForm(request.POST or None, initial=initial_dict)
        context = {}
        if "id" in request.GET.keys():
            if request.GET.get("id"):
                try:
                    data = info_client.objects.filter(pk=int(request.GET.get("id")))
                    result = {"status": 1, "data": serializers.serialize("json", data)}

                except:
                    result = {"status": 1, "data": "ee"}

            else:
                result = {"status": 1, "data": ""}
            return JsonResponse(result)
        else:
            context["form"] = form
            context["url"] = reverse("unit_actionView")
            context["title_form"] = _("اضافة عميل")
            context["title_list"] = _("إدارة تصاريح العملاء")

        return render(request, "unit_action.html", context)

    def post(self, request, *args, **kwargs):

        if request.POST.get("id"):
            data = get_object_or_404(info_client, pk=int(request.POST.get("id")))
            form = unit_actionForm(request.POST, instance=data)
        else:
            form = unit_actionForm(request.POST)
        if request.method == "POST" and request.is_ajax():
            if form.is_valid():
                hwid=request.POST.get('activate_key1')
 
                obj = form.save()
                enchwid =""
 
                f = Fernet(database.key_encrypt)
                eb =bytes(hwid,'utf-8')
                enchwid = str(f.encrypt(eb))
                enchwidt=enchwid.replace("'", "")
                enchwidt=enchwidt[1:]
                obj.activate_key2=enchwidt
                obj.save()
                if request.POST.get("id"):

                    if obj.id:
                        msg = message.update_successfully()
                        result = {"status": 1, "message": msg}
                    else:
                        msg = message.edit_error()
                        result = {"status": 2, "message": msg}
                else:
                    if obj.id:
                        msg = message.add_successfully()
                        result = {"status": 1, "message": msg}
                    else:
                        msg = message.add_error(request)
                        result = {"status": 2, "message": msg}
            else:
                result = {"status": 0, "error": form.errors.as_json()}
        else:
            msg = message.request_error()
            result = {"status": 2, "message": msg}
        return JsonResponse(result)

    def delete(self, request, *args, **kwargs):
        pk = int(QueryDict(request.body).get("id"))
        if pk:
            try:

                data = get_object_or_404(info_client, pk=pk)
                data.delete()
                msg = message.delete_successfully()
                result = {"status": 1, "message": msg}
            except:

                msg = message.delete_error()
                result = {"status": 1, "message": msg}
        else:
            msg = message.delete_error()
            result = {"status": 1, "message": msg}
        return JsonResponse(result)


class unit_actionListJson(BaseDatatableView):
    """List unit_action To Show in Table
    Returns:
        [json] -- List From unit_action To Show
    """

    model = info_client
    columns = [
        "id",
        "name_client_ar",
        "phon_client",
        "address_client",
        "date_client",
        "agreed_amount",
        "amount_paid_dollar",
        "remaining_dollar_amount",
        "activate_key1",
        
        'action'
    ]
    order_columns = [
        "id",
        "name_client_ar",
        "phon_client",
        "address_client",
        "date_client",
        "agreed_amount",
        "amount_paid_dollar",
        "remaining_dollar_amount",
        "activate_key1",
        
        "action",
    ]
    count = 0

    def render_column(self, row, column):
        """Render Column For Datatable
        """
        if column == "id":
            self.count += 1
            return self.count
        if column == "action":
            action_var = ""
            action_var = (
                action_var
                + ""
                + '<a class="edit_row" data-url="{3}" data-id="{0}" style="DISPLAY: -webkit-inline-box;"  data-toggle="tooltip" title="{1}"><i class="fa fa-edit"></i></a>'.format(
                    row.pk, _("Edit"), _("Delete"), reverse("unit_actionView"))
                
                + ""
                + '<a class="delete_row" data-url="{3}" data-id="{0}"  style="    DISPLAY: -webkit-inline-box;"     data-toggle="tooltip" title="{2}"><i class="fa fa-trash"></i></a>'.format(
                    row.pk, _("Edit"), _("Delete"), reverse("unit_actionView"))
                )
            return action_var
        else:
            return super(unit_actionListJson, self).render_column(row, column)

    def filter_queryset(self, qs):
        """To Filter data in table using in search
        """
        sSearch = self.request.GET.get("sSearch", None)
        if sSearch:
            qs = qs.filter(
            
            )
        return qs

