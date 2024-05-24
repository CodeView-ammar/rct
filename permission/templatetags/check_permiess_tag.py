
from django import template

register = template.Library()

@register.simple_tag
def add_(val=None):
  return val
