#  public enum FormState : int
#     {
#         Normal = 1,
#         Insert = 2,
#         Update = 3,
#         Delete = 4,
#         Search = 5,
#         Block = 6
#     }

from django.shortcuts import redirect
from django.urls import reverse

from django import template
register = template.Library()

global_var=0
# @register.filter(name='get_global_vale')
@register.simple_tag
def get_global_vale():
  return global_var

# global_var=0
def change_global_value(request):
  
      
  new_value = request.POST['new_value']
  global global_var
  global_var = new_value
