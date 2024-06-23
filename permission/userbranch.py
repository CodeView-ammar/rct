        

from django.http import HttpResponseForbidden
from django.shortcuts import render,get_object_or_404,redirect,reverse
from collections.abc import Iterable

def set_session_variables(request,**qeord):
    for key, value in qeord.items():
        request.session[key] = value