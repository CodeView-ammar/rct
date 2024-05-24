from django.http import HttpResponse, QueryDict, JsonResponse
from django.core import serializers
from django.shortcuts import render   
def saveresponsev_sidebar(request):
    response = HttpResponse("Cookie close sidebar")  
    response.set_cookie('close_sidbar_custom', request.POST["close_sidbar_custom"])  
    return response
def showresponsev_sidebar(request):
    data = {"status":0, "data":"You don't have a favorite color."}

    if "close_sidbar_custom" in request.COOKIES:
        data = {"status": 1, "data":request.COOKIES["close_sidbar_custom"]}

    return JsonResponse(data)
    
def SaveColor_sidebar(request):  
    response = HttpResponse("Cookie color sidebar")  
    response.set_cookie('color_sidebar', request.POST["color_sidebar"])  
    return response  

def ShowColor_sidebar(request):
    data = {"status":0, "data":""}

    if "color_sidebar" in request.COOKIES:
        data = {"status": 1, "data":request.COOKIES["color_sidebar"]}

        return JsonResponse(data)
    else:
        
        return JsonResponse(data)


def SaveColor_header(request):  
    response = HttpResponse("Cookie color header")  
    response.set_cookie('color_header', request.POST["color_header"])  
    return response  

def ShowColor_header(request):
    data = {"status":0, "data":"bg-midnight-bloom header-text-light"}

    if "color_header" in request.COOKIES:
        data = {"status": 1, "data":request.COOKIES["color_header"]}

        return JsonResponse(data)
    else:
        return JsonResponse(data)
