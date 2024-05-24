from django.shortcuts import render, redirect,get_object_or_404
from django.core import serializers
from django.http import HttpResponse
from django.urls import reverse_lazy
from our_core.helper import display_view
from django.http import HttpResponseRedirect,JsonResponse,HttpResponse
from django.utils.translation import ugettext_lazy as _
from django.views.generic import ListView,CreateView,View,UpdateView,DeleteView
from django.urls import reverse
from django.db.models import Q ,Max
from django.http import QueryDict

from django_datatables_view.base_datatable_view import BaseDatatableView 

from our_core.our_messages import message
from django.contrib import messages
from django.db.models import Subquery
from django.db import connection
from django.forms import modelformset_factory
from django.db.models import F
from django.db import transaction, IntegrityError
from dal import autocomplete

from django.utils.html import format_html
from permission.permission.permission import has_screen
from django.views.decorators.csrf import csrf_protect
from django.template import RequestContext
from datetime import datetime, timedelta
from django.db.models import Sum
import json
from decimal import Decimal



def index(request):
    # request.session["top_menu"] = {"dashbord": "active"}
    # request.session["sup_top_menu"] = {"dashbord": "active mm-active"}
    # request.session["select_home"] = {"dashbord": "activeli"}
    # # request.session["select_menu"] = {"dashbord": "activeli"}
    # request.session["select_menu"] = {"dashbord": "activeli"}

    
    context = {
        
        'count_report':{
                "count_active_suppliers":"",
                "count_active_customers":"",
                "sales_bills_this_month":"",
                "active_purchase_invoices_this_month":"",

        },
        'total_report':{
                "total_sales_bills_this_month":"",
                "total_active_purchase_invoices_this_month":"",
                "total_sales_bills_this_month_is_stage":"",
                "total_active_purchase_invoices_this_month_is_stage":"",
                
        },
        "report_account":{
                "total_income_this_year":"",
                "total_expenses_this_year":"",
                "total_income_expenses_this_year":"",
    },
    "report_chart":{
        "get_profit_data":"",
        "get_monthly_sales":"",
        "get_monthly_purchase":"",
        }
    }

    return render(request, 'index.html',context)

def handler404(request, exception):
    return render(request, "errors/404.html", status=404)

def handler500(request, exception):
    return render(request, "errors/500.html", {})

def handler403(request, exception):
    return render(request, "errors/403.html", status=403)

def handler400(request, exception):
    return render(request, "errors/400.html", status=400)
