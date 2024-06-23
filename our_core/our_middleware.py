
import threading

from django.shortcuts import render
from django.urls import reverse

        
class RequestMiddleware:

  def __init__(self, get_response, thread_local=threading.local()):
    self.get_response = get_response
    self.thread_local = thread_local
    # One-time configuration and initialization.

  def __call__(self, request):
    # Code to be executed for each request before
    # the view (and later middleware) are called.
    try:
      self.thread_local.username_=request.session['username_']
      try:
          self.thread_local.username_=request.session['username_']
          self.thread_local.db_name = request.POST['year_db']
      except Exception as e:
        self.thread_local.username_=request.session['username_']
        self.thread_local.db_name = request.session['db_name']
    except Exception as e1:
      self.thread_local.db_name = 'default'


    try:
      self.thread_local.branch_id = request.session.get('branch_id')
      self.thread_local.company_id = request.session.get('company_id')
    except:
      pass
    
    response = self.get_response(request) 

    # Code to be executed for each request/response after
    # the view is called.

    return response
class RequestMiddlewareDB:

  def __init__(self, get_response, db=None):
    self.get_response = get_response
    self.db = db
    # One-time configuration and initialization.

  def __call__(self, request):
    # Code to be executed for each request before
    # the view (and later middleware) are called.
    self.db = request.session.get('db')
    response = self.get_response(request)

    # Code to be executed for each request/response after
    # the view is called.

    return response


