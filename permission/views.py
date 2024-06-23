from django.shortcuts import render,HttpResponseRedirect,HttpResponse,reverse,redirect,get_object_or_404
import json
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import authenticate, login as login_user, logout as logout_user
from django.db.models import Q
from django.conf import settings

from django.contrib.auth.decorators import login_required, permission_required
from django.views.decorators.http import require_http_methods
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse, HttpResponse, QueryDict


from django.db import transaction,IntegrityError
from django.core.cache import cache

from django.views.generic import  CreateView
from django.core import serializers



from django.utils.decorators import method_decorator
from django.contrib import messages
from our_core.our_messages import message
# from permission.models import (PermissionGroup,
# Systems,
# SystemTabs,TabScreens,TabPartionsPermission,GroupPartionPermission,GroupScreens,
# GroupTabs,GroupSystems,
# BranchSystem,
# UsersDetilesUserBranch,
# UsersDetilesUserPermissionGroup,
# UsersDetilesTypeDevice)

from django.contrib.auth.models import  User
from permission.forms import UserPassword,LoginForm


from training.save_db import SaveDB

from permission.permission.permission import get_all, get_all_partion

from permission.permission.permission import decorator_has_perm,has_screen,has_tab,has_system,has_partion
from permission.templatetags.permission_tag import (change_screen,active_screen,change_tab,change_system,change_partion)



from permission.userbranch import set_session_variables


from datetime import datetime


 
# from django.contrib.auth.decorators import login_required
# import signal
def SigIntHand(SIG, FRM):
    print("Please Right click-copy. Ctrl-C does not work on the cmd prompt")


    
def login(request):
    # form = LoginDataForm(request.POST or None)
    form2 = LoginForm(request.POST or None)

    context = {}
    logout_user(request)
    
    
    if request.method == 'POST':
        password = request.POST['password']
        username = request.POST['username']
        request.session['db_name'] = "trainers" 
        context=[]    

        if form2.is_valid():

            user = authenticate(username=username, password=password)
            if user is not None:
                if user.active:
                
                    login_user(request, user)
                    
                    
                    
                    
                    set_session_variables(request,

                    
                    permission= get_all(request),
                    permission_partion= get_all_partion(request),
                    username_= request.user.id
                    )
                    # request.session['username_'] = request.user.id

                    def isNum(data):
                        try:
                            int(data)
                            return True
                        except ValueError:
                            return False
                    
                    # تعيين وقت انتهاء الجلسة بعد 30 دقيقة
                    request.session.set_expiry(1800)
                    # if Activ:
                    if request.GET.get('next'):
                        homee=request.GET.get('next')
                    else:
                        homee=request.GET.get('/')
                    return redirect(homee)
            
    return render(request, 'login.html', { 'form2': form2,"context":context})

def logout(request):
    cache.delete('branch')
    return redirect(settings.LOGOUT_REDIRECT_URL)
    # logout_user(request)




from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
# from rest_framework.authtoken.models import Token

# @receiver(post_save, sender=settings.AUTH_USER_MODEL)
# def create_auth_token(request):
#     # try:
#     user = request.POST.get('id')
#     token, _ = Token.objects.get_or_create(user=UsersDetiles.objects.get(id=user))  # Efficient token creation
#     result = {'status': 1, 'data': token.key}
#     print(result)
#     return JsonResponse(result)
    # Handle the error gracefully (e.g., log or send notification)