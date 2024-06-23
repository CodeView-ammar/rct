
"""
url models Cuntry
"""
from django.urls import path,include
from configration.cuntry import views
urlpatterns = [
    path("cuntry/",views.CuntryView.as_view(),name="CuntryView")
    
]
            