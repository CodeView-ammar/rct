from django.http import HttpResponse, QueryDict, JsonResponse
from django.core import serializers
from django.shortcuts import render   


def Save_logininfo(request):  
    response = HttpResponse("Cookie info login")  

    response.set_cookie('remambe_my', request.POST["remambe_my"])  
    return response  


def Showinfo_login(request):
    data = {"status":0, "data":"You don't have a favorite color."}

    if "remambe_my" in request.COOKIES:
        data = {"status": 1, "data":request.COOKIES["remambe_my"]}

        return JsonResponse(data)
    else:
        return JsonResponse(data)


def closeui(request):
    import os
    from win32com.client import GetObject
    WMI = GetObject('winmgmts:')
    processes = WMI.InstancesOf('Win32_Process')

    os.system("taskkill /pid "+str("127.0.0.1:8000"))
    return True