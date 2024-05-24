from django.contrib import admin
from django.urls import path, include, re_path
from django.conf.urls import url
from django.conf.urls.static import static
from django.conf import settings
from AccountingSystem import home 
from django.conf.urls.i18n import set_language
from . import home

from permission.models import UsersDetiles
from django.contrib.auth import login

urlpatterns =[
 
        path('',home.index , name='index'),  # overwriting at sidebare view
        path('i18n/', include('django.conf.urls.i18n')),
        
        path("app/", include("our_core.urls")), 
        path('app/', include('our_notifications.urls')),
        path('app/', include('permission.urls')),
        path('app/', include('setting.urls')),
        path('setlang/', set_language, name='set_language'),  # overwriting at sidebare view

        # مصمم التقارير
    ]+static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


def get_footer(request):
    # header footer report
    from django.http import  JsonResponse
    from django.core import serializers 
    if request.GET.get("id"):
        try:
            data = Branch.lobjects.all()
            host = f"{ request.scheme }://{ request.META.get('HTTP_HOST') }/media/"

            result = {
                "status": 1,
                'host':host,
                "company__name_ar":my_values[0]["company__name_ar"],
                "company__name_en":my_values[0]["company__name_en"],
                "data": serializers.serialize("json", data),
            
            }
        except:
            result = {"status": 0, "data": "ee"}
    else:
        result = {"status": 0, "data": ""}
    return JsonResponse(result)
    
    



urlpatterns +=[
    
path('get_footer/',get_footer,name='get_footer')] 
from AccountingSystem.settings import MEDIA_ROOT,MEDIA_URL 
from django.conf.urls.static import static
urlpatterns += static(settings.MEDIA_URL, document_root= settings.MEDIA_ROOT)






from AccountingSystem.settings import DEBUG
if DEBUG:
    from django.contrib import admin

    admin.autodiscover()
    urlpatterns=[path('admind', admin.site.urls),*urlpatterns]
  


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
# handler404 = 'AccountingSystem.home.handler404'
# handler500 = 'AccountingSystem.home.handler500'
# handler403 = 'AccountingSystem.home.handler403'
# handler403 = 'AccountingSystem.home.handler400'

