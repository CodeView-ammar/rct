
# import json
from django.db import transaction, IntegrityError
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.shortcuts import render
from django.urls import reverse
# from django.utils.translation import gettext_lazy as _
from django.views.generic.base import View
from django.core import serializers
from dal import autocomplete

# from django.serializers.json import DjangoJSONEncoder


from our_core.exceptions import JsonResponseExceptions
from our_core.our_messages import message



global_var=0
def change_global_value(request):
      
  new_value = request.POST['new_value']
      
  global global_var
  global_var = new_value