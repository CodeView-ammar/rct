
"""
url models Building
"""
from django.urls import path,include
from configration.building import views
urlpatterns = [
    path("building",views.BuildingView.as_view(),name="BuildingView")
    
]
            