
''' Class Helper '''
from django.db import connection, models
import sys
from django.shortcuts import render,redirect,get_object_or_404
from django.urls import reverse
from django.contrib import messages
from django.utils.translation import ugettext_lazy as _
from django.core.exceptions import ObjectDoesNotExist

class Helper():
    ''' Class Helper '''
    def query(sqlCommand):
        ''' Create New Query '''
        cursor = connection.cursor()
        cursor.execute('delete from accounts_type where id=19')
        result=cursor.fetchall()
        return result
 
def display_view(request,model_name,form_name,templet_name,title):
    """Base Function To Show and  add new  Record Of Any Model
    Arguments:
        request {request} 
        model_name {model} -- Model for get data
        form_name {Form} -- form to add datt
        templet_name {html} -- to display data
        title {str} -- title for show in Tamplat
    
    Returns:
        [redirect] -- redirect to next page
    """
    
    if request.method=="POST":
        form=form_name(request.POST,request.FILES)
        if form.is_valid():
            obj= form.save(commit=False)
            obj.created_by=request.user
            obj.save()
            if obj.pk:
                messages.success(request, _('Added Successfully '))
                return redirect(request.get_full_path())
            else:
                messages.error(request, _('Error adding process'))
    else:
        form=form_name()
    context={
        'form':form,
        'action':reverse(str(model_name.__name__).lower()+'_list'),
        'title': _(title),
            }
    return render(request,templet_name,context)

def max_id(model_name, branch=None):
    number_max = model_name.objects.filter(branch_id=branch).aggregate(number_max=models.Max('number'))['number_max']
    if number_max is None:
        n = int(branch) * 1000 + 1  # Generate the initial number for the branch
        return n
    else:
        y = int(number_max) + 1
        if y % 1000 == 0:  # Check if the number is a multiple of 1000
            y += 1  # If the number is a multiple of 1000, add 1 to avoid ending in 000
        return y


