from django.urls import path
from permission import views
urlpatterns = [

    path('login/',views.login,name='login'), 

    path('',views.logout,name='logout'),
    # path('create-auth-token/',views.create_auth_token,name='create_auth_token'),
    
]
