from django.urls import path
from permission import views
urlpatterns = [

    path('accounts/login/',views.login,name='login'), 

    path('accounts/logout/',views.logout_view,name='logout'),
    # path('create-auth-token/',views.create_auth_token,name='create_auth_token'),
    
]
