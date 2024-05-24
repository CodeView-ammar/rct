
from __future__ import absolute_import, unicode_literals

from celery import shared_task
from accountsystem.middleware2 import _locals
@shared_task
def add(d):
    _locals.session = d
 
