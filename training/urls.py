from django.contrib import admin
from django.urls import path, include, re_path
from django.conf.urls.static import static
from django.conf import settings
from training import home 
from django.conf.urls.i18n import set_language

from django.contrib.auth import login

urlpatterns =[
        path('app/', admin.site.urls), 
        path('', admin.site.urls), 
        # path('',home.index , name='index'),  # overwriting at sidebare view
        path('i18n/', include('django.conf.urls.i18n')),
        
        path("app/", include("our_core.urls")), 
        path('app/', include('our_notifications.urls')),
        path('app/', include('permission.urls')),
        path('app/', include('configration.urls')),
        path('app/', include('init_input.urls')),

        # path("app/", include("our_core.urls")), 
        # path('app/', include('our_notifications.urls')),
        # path('app/', include('permission.urls')),
        # path('app/', include('configration.urls')),
        # path('app/', include('init_input.urls')),
        path('setlang/', set_language, name='set_language'),  # overwriting at sidebare view

        # مصمم التقارير
    ]+static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


    
# from django.urls import reverse_lazy
# from configration.models import Building
# Assuming you have a model instance named 'object'
# admin_url = reverse_lazy('admin:%s_%s' % (Building._meta.app_label, Building._meta.model_name), args=(Building.pk,))
# print(admin_url)  # This will print the admin URL for the instance




    
from training.settings import MEDIA_ROOT,MEDIA_URL 
from django.conf.urls.static import static
urlpatterns += static(settings.MEDIA_URL, document_root= settings.MEDIA_ROOT)








from django.http import JsonResponse
from django.shortcuts import render
def handler404(request, exception=None):
    response = JsonResponse({"status": "failure", "message": "Not Found"})
    response.status_code = 404
    return render(request, 'errors/400.html', response)

def handler500(request, exception=None):
    response = JsonResponse({"status": "failure", "message": "Server Error"})
    response.status_code = 500
    return render(request, 'errors/500.html', {"":""})


handler404 = handler404
handler500 = handler500
# handler404 = 'training.home.handler404'
# handler500 = 'training.home.handler500'
# handler403 = 'training.home.handler403'
# handler403 = 'training.home.handler400'

