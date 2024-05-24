import datetime
from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, QueryDict, JsonResponse
from django.core import serializers
from django.db import transaction, IntegrityError, connection
from django.utils.translation import ugettext_lazy as _
from django.views.generic import ListView, CreateView, View, UpdateView, DeleteView
from our_notifications.notification_helper import NotificationsHelper


# Create your views here.

from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
 
@method_decorator(login_required(login_url='login'), name='dispatch')
class NotificationsView(CreateView):
    """
    Notifications View to (add, update) Notifications variables
    """
    def get(self, request, *args, **kwargs):
        request.session["top_menu"] = {"general_configuration": "active"}
        request.session["sup_top_menu"] = {"notifications_app": "active mm-active"}
        request.session["sub_menu"] = {"notifications": "activeli"}

       
        if "type_id" in request.GET.keys():
            return JsonResponse(NotificationsHelper.get_selected_notification(request))

        else:
            context = NotificationsHelper.get_notification_context(request)
            return render(request, "notification_variables.html", context)

    def post(self, request, *args, **kwargs):
        """
        the post method will get the submited data by the form the save
        or update the notifications variables
        """
        result = None
        if request.method == "POST":
            result = NotificationsHelper.notification_post_data(request)
        return JsonResponse(result)
