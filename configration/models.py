from django.db import models
from our_core.models  import CustomModel
from django.utils.translation import gettext_lazy as _
# Create your models here.

class Building(CustomModel):
    Unit={
        ("unit",_("Riyadh College"))
    }
    
    number = models.IntegerField(verbose_name=_("number"))
    name_building = models.CharField(verbose_name=_("name"), max_length=100)
    unit_name = models.CharField(_("unit trining"),choices=Unit,default="unit",max_length=10)
    def __str__(self):
        return self.name_building

class HeadDepartment(CustomModel):
    name = models.CharField(_("head department"),max_length=100)
    phone = models.CharField(_("phone"),max_length=100,null=True,blank=True)
    email = models.EmailField(_("email"),null=True,blank=True)
    def __str__(self):
        return self.name
class Department(CustomModel):
    building = models.ForeignKey(Building,on_delete=models.CASCADE)
    head_department= models.ForeignKey(HeadDepartment,on_delete=models.CASCADE,null=True,blank=True)
    number = models.IntegerField(verbose_name=_("number"))
    name_department = models.CharField(verbose_name=_("name"),max_length=100, unique=True)
    def __str__(self):
        return self.name_department


class TypeFile(CustomModel):
    number = models.IntegerField(verbose_name=_("number"))
    name = models.CharField(verbose_name=_("name"),max_length=100)
    def __str__(self):
        return self.name


class Section(CustomModel):
    number = models.IntegerField(verbose_name=_("number"))
    department = models.ForeignKey(Department,on_delete=models.CASCADE)
    name_section = models.CharField(verbose_name=_("name"),max_length=100)
    def __str__(self):
        return self.name_section

class Cuntry(CustomModel):
    number = models.IntegerField(verbose_name=_("number"))
    name_cuntry = models.CharField(verbose_name=_("name"),max_length=25)
    def __str__(self):
        return self.name_cuntry

class Subject(CustomModel):
    testing={
        ("first",_("First test")),
        ("second",_("Second test")),
        ("final",_("final test")),
    }
    stage={
        ("diploma",_("diploma")),
        ("Bachelor's",_("Bachelor's"))
    }
    number = models.IntegerField(verbose_name=_("number"))
    section = models.ForeignKey(Section,on_delete=models.CASCADE,null=True,blank=True)
    code = models.CharField(verbose_name=_("code"),max_length=100)
    name_subject = models.CharField(verbose_name=_("name"),max_length=100)
    testing = models.CharField(_("testing"),max_length=10,choices=testing,default="first")
    hours = models.IntegerField(_("hours"))
    stage = models.CharField(_("stage"),max_length=100,choices=stage,default="diploma")

    def __str__(self):
        return self.name_subject

class Division(CustomModel):
    program={
        ("morning",_("morning")),
        ("evening",_("evening")),
    }
    Subject= models.ForeignKey(Subject,on_delete=models.CASCADE)
    code = models.CharField(_("code"),max_length=100)
    program = models.CharField(_("program"),choices=program,max_length=20,default="morning")
    def __str__(self):
        return self.code

