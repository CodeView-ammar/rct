
"""Base class from All Another Models
"""
from django.db import models
from django.conf import settings
# from django.utils.translation import gettext_lazy as _
from django.utils.translation import gettext_lazy as _
# from search.url_mapping import model_detials
# from django.contrib.sessions.models import Session

from django.core.cache import cache
import datetime
import os


def filepath(request, filename):
    old_filename = filename
    timeNow = datetime.datetime.now().strftime('%Y%m%d%H:%M:%S')
    filename = "%s%s" % (timeNow, old_filename)
    return os.path.join('images/', filename)


class BaseModel(models.Model):
    """Class Content   Four Fields Uing As base Class For Anther Model
    """
    created_at = models.DateTimeField(auto_now_add=False, auto_now=True)
    modified_at = models.DateTimeField(auto_now=True, auto_now_add=False)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.PROTECT, editable=False,related_name="%(class)s_createdby",null=True,blank=True)
    modified_by = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.PROTECT, editable=False,related_name="%(class)s_modifiedby",null=True,blank=True,)
    # bobjects = BranchWithoutFilter()
    # objects = BranchWithoutFilter()
    class Meta:
        permissions = [
            ("print", "can print"),
            ("view_sidbar","displaying in side bar"),
            ("app_view_permission","app view")
            ]
        abstract = True
class Years(BaseModel):
    year = models.CharField(max_length=4, blank=True, null=True)
    class Meta:
        abstract = True

CustomModel = BaseModel
CustomModeluseys = Years


class SidebarItem(models.Model):
    title_ar = models.CharField(max_length=1000)
    title_en = models.CharField(max_length=1000,null=True, blank=True)
    name_code = models.CharField(max_length=1000,null=True, blank=True)
    url = models.CharField(max_length=200)
    icon_left = models.CharField(max_length=1000,null=True, blank=True)
    icon_right = models.CharField(max_length=1000,null=True, blank=True)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='subitems')
    url_value=models.CharField(max_length=1000,null=True, blank=True)
    is_sub_parent = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    def __str__(self):
        return self.title_ar

