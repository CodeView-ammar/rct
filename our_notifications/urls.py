from django.urls import path
from our_notifications import views
from our_notifications.notification_helper import NotificationsHelper

urlpatterns = [
    path('NotificationsView/', views.NotificationsView.as_view(), name='NotificationsView'),
    path('get_notification_variables/', NotificationsHelper.get_notification_variables,
         name='get_notification_variables'),
]
