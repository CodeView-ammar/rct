from django.core import serializers
from django.http import HttpResponse, QueryDict, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from our_core.our_messages import message
from our_notifications.forms import NotificationVariablesForm
from our_notifications.models import NotificationVariables
from django.utils.translation import gettext_lazy as _


class NotificationsHelper:
    @staticmethod
    def get_notification_context(request):
        form = NotificationVariablesForm()
        form.set_initial_val()
        notification_form_data = {
            'form': form,
            'url': reverse('NotificationsView'),
            'title_form': _('Update Notifications Variables'),
        }
        context = {
            'notification_form_data': notification_form_data,
        }
        return context

    @staticmethod
    def notification_post_data(request):
        if request.POST['notify_type'] == '1' or request.POST['notify_type'] == '4':
            primary_key = 1
        if request.POST['notify_type'] == '2' or request.POST['notify_type'] == '3':
            primary_key = 2
        notify_form = NotificationVariablesForm(request.POST)
        indicator = False
        # if request.POST.get("id"):
        try:
            notify_data = get_object_or_404(NotificationVariables, pk=primary_key)
            notify_form = NotificationVariablesForm(request.POST, instance=notify_data)
            indicator = True
        except:
            pass
        if notify_form.is_valid():
            notify_obj = notify_form.save(commit=False)
            notify_obj.id = primary_key
            notify_obj.save()
            if indicator:
                if notify_obj.id:
                    msg = message.update_successfully()
                    result = {"status": 1, "message": msg}
                else:
                    msg = message.edit_error()
                    result = {"status": 2, "message": msg}
            else:
                if notify_obj.id:
                    msg = message.add_successfully()
                    result = {"status": 1, "message": msg}
                else:
                    msg = message.add_error(request)
                    result = {"status": 2, "message": msg}
        else:
            result = {"status": 0, "error": notify_form.errors.as_json()}
        return result

    @staticmethod
    def get_notification_variables(request):
        try:
            # how to make Queryset with empty database or without this model in the database
            notification_data = NotificationVariables.objects.order_by('id').values('saturday', 'sunday', 'monday',
                                                                                'tuesday',
                                                                                'wednesday', 'thursday', 'friday',
                                                                                'all_days',
                                                                                'hours_to_notify', 'notify_type',
                                                                                'num_of_messages', 'every_seconds',
                                                                                'gl_placement_from',
                                                                                'gl_placement_align',
                                                                                'gl_animate_enter', 'gl_animate_exit',
                                                                                'allow_dismiss', 'gl_newest_on_top')
            if notification_data:
                result = {'status': 0, 'notification_data': list(notification_data)}
            else:
                result = {'status': 1, 'notification_data': ""}
        except:
            result = {'status': 2, 'data': 'err'}
        return JsonResponse(result)

    @staticmethod
    def get_selected_notification(request):
        if request.GET.get('type_id'):
            try:
                notification_obj = NotificationVariables.objects.filter(notify_type=request.GET.get("type_id"))
                result = {}
                if notification_obj.exists():
                    result = {"status": 0, "notification": serializers.serialize("json", notification_obj)}
                else:
                    msg = "No Data For This Selection!"
                    result = {'status': 2, 'message': msg}
            except Exception as e:
                msg = "Error ! Some thing wrong happened check your input or contact Afeef !"
                result = {'status': 2, 'message': msg}
            return result
