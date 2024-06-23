from django.db import models
from our_core.models  import CustomModel,CustomModeluseys
from django.utils.translation import gettext_lazy as _
from permission.models import UsersDetiles
from configration.models import Section,Cuntry,Subject,Division
class Trainer(CustomModel):
    qualification_options=(
        ("d","دكتوراه"),
        ("ms","ماجستير"),
        ("pk","بكالريوس"),
        ("dp","دبلوم"),
    )
    job_options=(
        {"1","مدرب ب"},
        {"2","مدرب أ"},
        {"3","مدرب اول ب"},
        {"4","مدرب اول أ"},
        {"5","كبير المدربين"},
    )
    User=models.ForeignKey(UsersDetiles,on_delete=models.CASCADE,null=True,blank=True)
    fullname= models.CharField(_('full name'), max_length=100,null=True)
    birthday= models.DateField(_('birth date'),null=True,blank=True)
    phone= models.CharField(_('phone'), max_length=10,null=True,blank=True)
    section = models.ForeignKey(Section,on_delete=models.CASCADE,null=True,blank=True)
    qualification= models.CharField(_("qualification"), max_length=100,choices=qualification_options,null=True, blank=True)
    date_qualification= models.DateField(_("date qualification"),null=True, blank=True)
    field_study = models.CharField(_("field study"), max_length=100,null=True, blank=True)
    Cuntry_study = models.ForeignKey(Cuntry,on_delete=models.CASCADE,null=True,blank=True)
    date_start = models.DateField(_("date start"),null=True, blank=True)
    name_job = models.CharField(_("name"),max_length=50,choices=job_options,default="3")
    off_addrs = models.CharField(_("offes address"),max_length=100, blank=True,null=True)
    
    def __str__(self):
        return self.fullname

class Tracking(CustomModeluseys):
    ye={
        ("01",_("First semester")),
        ("02",_("Second semester")),
    }
    
    projram={
        ("morning",_("morning")),
        ("evening",_("evening")),
    }
    trainer = models.ForeignKey(Trainer,on_delete=models.CASCADE)
    semester = models.CharField(_("Semester"),max_length=10,choices=ye,default="01")
    division = models.ForeignKey(Division,on_delete=models.CASCADE)
    projram = models.CharField(_("projram"),max_length=20,choices=projram,default="morning")
    subject = models.ForeignKey(Subject,on_delete=models.CASCADE)
    calculated = models.BooleanField(_("calculated"),default=True)
    status = models.BooleanField(_("status"),default=False)

class DetailsTracking(CustomModel):
    tracking = models.ForeignKey(Tracking, on_delete=models.CASCADE,null=True, blank=True)
    count_student = models.IntegerField(_("count student"), default=0)
    max_mark = models.IntegerField(_("max mark"), default=0)
    min_mark = models.IntegerField(_("min mark"), default=0)
    absent = models.IntegerField(_("absent"), default=0)
    less_than = models.IntegerField(_("less than"), default=0)
    mark= models.IntegerField(_("mark"), default=0)
    