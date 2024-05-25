
"""
url models init_input
"""
from django.urls import path,include
urlpatterns = []

from .hooks import sub_app_name
if sub_app_name:
   for sub_app_name_ in sub_app_name:
      urlpatterns+=[path("init_input"+"/",include("init_input"+"."+sub_app_name_+".urls")),]
            