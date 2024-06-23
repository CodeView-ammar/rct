
"""
url models Trainer
"""
from django.urls import path,include
from init_input.trainer import views
urlpatterns = [
    path("trainer/",views.TrainerView.as_view(),name="TrainerView"),
    path("tracking/",views.TrainerView.as_view(),name="TrackingView")
    
]
            