from django.db import models
from our_core.models  import ModelUseBranch,CustomModel
from django.utils.translation import ugettext as _
# Create your models here.
class Building(CustomModel):
    number = models.IntegerField(verbose_name=_("number"))
    name = models.CharField(verbose_name=_("name"), max_length=100)
    def __str__(self):
        return self.name

class Department(CustomModel):
    building = models.ForeignKey(Building,on_delete=models.CASCADE)
    number = models.IntegerField(verbose_name=_("number"))
    name = models.CharField(verbose_name=_("name"),max_length=100, unique=True)
    def __str__(self):
        return self.name


class TypeFile(CustomModel):
    number = models.IntegerField(verbose_name=_("number"))
    name = models.CharField(verbose_name=_("name"),max_length=100)
    def __str__(self):
        return self.name


class Section(CustomModel):
    number = models.IntegerField(verbose_name=_("number"))
    department = models.ForeignKey(Department,on_delete=models.CASCADE)
    name = models.CharField(verbose_name=_("name"),max_length=100)
    def __str__(self):
        return self.name

class Cuntry(CustomModel):
    number = models.IntegerField(verbose_name=_("number"))
    name = models.CharField(verbose_name=_("name"),max_length=25)
    def __str__(self):
        return self.name

class Subject(CustomModel):
    number = models.IntegerField(verbose_name=_("number"))
    section = models.ForeignKey(Section,on_delete=models.CASCADE)
    name = models.CharField(verbose_name=_("name"),max_length=100)
    def __str__(self):
        return self.name


