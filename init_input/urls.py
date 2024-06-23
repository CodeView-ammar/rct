
"""
url models init_input
"""
from django.urls import path,include
from init_input.admin import my_custom_modal
urlpatterns = [

   path("init_input/detailstracking/",my_custom_modal,name="DetailsTrackingView"),
   # path('init_input/my_custom_modal/<int:pk>/', my_custom_modal, name='my_custom_modal'),
]

from .hooks import sub_app_name
if sub_app_name:
   for sub_app_name_ in sub_app_name:
      urlpatterns+=[path("init_input"+"/",include("init_input"+"."+sub_app_name_+".urls")),]
            