from django.db import models
from our_core.models import BaseModel
from configration.models import Department,HeadDepartment
from django.utils.translation import gettext_lazy as _

class Week(BaseModel):
    name = models.CharField(_("week name"),max_length=100)
    date = models.DateField(_("date"))
    def __str__(self):
        return self.name +" " + str(self.date)
class Task(BaseModel):
    Week = models.ForeignKey(Week,on_delete=models.CASCADE)
    all_department= models.BooleanField(_("all department"), default=False)
    department = models.ManyToManyField(Department, related_name="tasks", blank=True)
    head_department= models.ForeignKey(HeadDepartment, on_delete=models.CASCADE, null=True, blank=True)
    name_task= models.CharField(_("task"), max_length=100)
    note = models.CharField(_("note"), max_length=1000,null=True, blank=True)
    done = models.BooleanField(_("done"), default=False)
    requred_file = models.BooleanField(_("See the achievement"), default=False)
    file = models.FileField(_("file"),upload_to="tasks", null=True, blank=True)
    def __str__(self):
        return self.name_task