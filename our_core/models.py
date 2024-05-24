
"""Base class from All Another Models
"""
from django.db import models
from django.conf import settings
# from django.utils.translation import ugettext_lazy as _
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

class BranchFilter(models.Manager):
    def get_queryset(self):
        # try:
        # if cache.get("branch"):
        # try:
        from our_core.our_middleware import RequestMiddleware
        request = RequestMiddleware(get_response=None)
        try:
            return (
                super().get_queryset().filter(branch_id=request.thread_local.branch_id,company_id=request.thread_local.company_id)
            )
        except:
            return super().get_queryset()
      
class CompanyFilter(models.Manager):
    def get_queryset(self):
        # try:
        # if cache.get("branch"):
        # try:
        from our_core.our_middleware import RequestMiddleware
        request = RequestMiddleware(get_response=None)
        try:
            return (
                super().get_queryset().filter(company_id=request.thread_local.company_id)
            )
        except:
            return super().get_queryset()
      

class BranchLocalFilter(models.Manager):
    def get_queryset(self):
        # try:
        try:
            from our_core.our_middleware import RequestMiddleware

            request = RequestMiddleware(get_response=None)
            x = request.thread_local.branch_id
        except:
            x = None
        if x:
            return super().get_queryset().filter(id=x)
        else:
            return super().get_queryset()
        # except:
        #     return super().get_queryset()


class BranchWithoutFilter(models.Manager):
    def get_queryset(self):
        from our_core.our_middleware import RequestMiddleware
        request = RequestMiddleware(get_response=None)
        try:
            return (
                super().get_queryset()
            )
        except:
            return super().get_queryset()

class BaseModel(models.Model):
    """Class Content   Four Fields Uing As base Class For Anther Model
    """
    created_at = models.DateTimeField(auto_now_add=False, auto_now=True)
    modified_at = models.DateTimeField(auto_now=True, auto_now_add=False)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.PROTECT,related_name="%(class)s_createdby",null=True,blank=True)
    modified_by = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.PROTECT,related_name="%(class)s_modifiedby",null=True,blank=True,)
    # bobjects = BranchWithoutFilter()
    # objects = BranchWithoutFilter()
    class Meta:
        abstract = True
   
from django.core.files import File  # you need this somewhere
import urllib 
from PIL import Image


class Company(BaseModel):
    """Class Content    Fields For Initial Company
    """

    name_ar = models.CharField(verbose_name=_("Name"), max_length=100, unique=True)
    name_en = models.CharField(verbose_name=_("Foreign Name"), max_length=100, null=True, blank=True)
    abbrivation_name = models.CharField(
        verbose_name=_("Short Name"), max_length=100, null=True, blank=True
    )
    abbrivation_name_en = models.CharField(
        verbose_name=_("Short Foreign Name"), max_length=100, null=True, blank=True
    )
    note = models.CharField(
        verbose_name=_("Notes"), max_length=100, null=True, blank=True
    )
    # image = models.ImageField(
        # verbose_name=_("image"), upload_to=filepath,null=True, blank=True
    #     verbose_name=_("image"),upload_to = "images",null=True, blank=True
    # )
    # image = models.ImageField(upload_to='images/',blank=True)
    tax_number = models.CharField(
        verbose_name=_("Tax Number"),max_length=100, null=False, blank=False
    )
    image = models.ImageField(upload_to="company/",default="no_img/no_image.png",blank=True)

    def __str__(self):
        return str(self.pk) + "-" + self.name_ar
       
    # def cache(self):
    #     """Store image locally if we have a URL"""

    #     if self.url and not self.photo:
    #         result = urllib.urlretrieve(self.url)
    #         self.photo.save(
    #                 os.path.basename(self.url),
    #                 File(open(result[0], 'rb'))
    #                 )
    #         self.save()

    def is_deletable(self, excepted_related_obj="None"):
        # get all the related object
        for rel in self._meta.get_fields():
            try:
                # check if there is a relationship with at least one related object
                related = rel.related_model.objects.filter(**{rel.field.name: self})
                if (excepted_related_obj in str(rel.related_model)) and (
                    excepted_related_obj != "None"
                ):
                    for obj in related:
                        a, b = obj.is_deletable_local()
                        if not (a):
                            return False, b
                elif related.exists():
                    # if there is return a Tuple of flag = False the related_model object
                    return False, related
            except AttributeError:  # an attribute error for field occurs when checking for AutoField
                pass  # just pass as we dont need to check for AutoField
        return True, None


    class Meta:
        verbose_name = _("company")

class BaseModelcompany(models.Model):
    """Class Content   Four Fields Uing As base Class For Anther Model
    """
    created_at = models.DateTimeField(auto_now_add=False, auto_now=True)
    modified_at = models.DateTimeField(auto_now=True, auto_now_add=False)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.PROTECT,related_name="%(class)s_createdby",null=True,blank=True)
    modified_by = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.PROTECT,related_name="%(class)s_modifiedby",null=True,blank=True,)
    company = models.ForeignKey(Company,verbose_name=_("company"),null=True, blank=True, on_delete=models.CASCADE, default=1)
    objects = CompanyFilter()
    
    class Meta:
        abstract = True

class City(BaseModelcompany):
    """
    Create City Model  ...بيانات المدن
    """

    number = models.CharField(verbose_name=_("Number Code"), max_length=50)
    name_ar = models.CharField(
        verbose_name=_("Arabic Name"), max_length=50, unique=True
    )
    name_en = models.CharField(
        verbose_name=_("Foreign Name"), max_length=50, null=True, blank=True
    )

    def __str__(self):
        return self.name_ar

    class Meta:
        verbose_name = _("City")


class Area(BaseModelcompany):
    """
    Create Area Model  ...بيانات المناطق
    """

    number = models.CharField(verbose_name=_("Number Code"), max_length=50)
    name_ar = models.CharField(
        verbose_name=_("Arabic Name"), max_length=50, unique=True
    )
    name_en = models.CharField(
        verbose_name=_("Foreign Name"), max_length=50, null=True, blank=True
    )

    def __str__(self):
        return self.name_ar

    class Meta:
        verbose_name = _("Areas")




class Branch(BaseModelcompany):
    """Class Content    Fields For Initial Branch
    """

    # area = models.ForeignKey(Area,verbose_name=_("Area"), on_delete=models.CASCADE,null=True,blank=True)
    name_ar = models.CharField(verbose_name=_("Name"), max_length=100)
    name_en = models.CharField(
        verbose_name=_("Foreig Nmae"), max_length=100, null=True, blank=True
    )
    address = models.CharField(
        verbose_name=_("Address"), max_length=200, null=True, blank=True
    )
    address_en = models.CharField(
        verbose_name=_("Foreign Address"), max_length=200, null=True, blank=True
    )
    first_line = models.CharField(
        verbose_name=_("First Head"), max_length=100, null=True, blank=True
    )
    second_line = models.CharField(
        verbose_name=_("Second Head"), max_length=100, null=True, blank=True
    )
    third_line = models.CharField(
        verbose_name=_("Third Head"), max_length=100, null=True, blank=True
    )
    first_line_en = models.CharField(
        verbose_name=_("Foreign First Head"), max_length=100, null=True, blank=True
    )
    second_line_en = models.CharField(
        verbose_name=_("Foreign Second Head"), max_length=100, null=True, blank=True
    )
    third_line_en = models.CharField(
        verbose_name=_("Foreign Third Head"), max_length=100, null=True, blank=True
    )
    specifiction = models.CharField(
        verbose_name=_("specifiction"), max_length=100, null=True, blank=True
    )
    website = models.URLField(
        verbose_name=_("website"), max_length=100, null=True, blank=True
    )
    tax_number = models.CharField(
        verbose_name=_("Tax Number"),max_length=100, null=True, blank=True
    )
    company_register = models.PositiveIntegerField(
        verbose_name=_("company register"), null=True, blank=True
    )
    phone = models.CharField(
        verbose_name=_("Phone"), max_length=16, null=True, blank=True
    )
    image = models.ImageField(
        verbose_name=_("Image"),upload_to="branch/",default="no_img/no_image.png", max_length=254 ,null=True, blank=True
    )

    objects = BranchWithoutFilter()
    lobjects = BranchLocalFilter()

    def __str__(self):
        return str(self.pk) + "-" + self.name_ar

    
    def is_deletable(self, excepted_related_obj="None"):
        # get all the related object
        for rel in self._meta.get_fields():
            try:
                # check if there is a relationship with at least one related object
                related = rel.related_model.objects.filter(**{rel.field.name: self})
                if (excepted_related_obj in str(rel.related_model)) and (excepted_related_obj != "None"):
                    for obj in related:
                        a, b = obj.is_deletable_local()
                        if not (a):
                            return False, b
                elif related.exists():
                    # if there is return a Tuple of flag = False the related_model object
                    return False, related
            except AttributeError:  # an attribute error for field occurs when checking for AutoField
                pass  # just pass as we dont need to check for AutoField
        return True, None


    class Meta:
        verbose_name = _("Branch")

class CustomBaseModel(BaseModelcompany):
    """Class Content Five Fields Using As base Class For Another Model
    """

    branch = models.ForeignKey(
        Branch, verbose_name=_("Branch"), on_delete=models.CASCADE, default=1
    )
    objects = BranchFilter()
    bobjects = BranchWithoutFilter()

    class Meta:
        abstract = True
        
    def is_deletable(self):
        # get all the related object
        for rel in self._meta.get_fields():
            try:
                # check if there is a relationship with at least one related object
                related = rel.related_model.objects.filter(**{rel.field.name: self})
                if related.exists():
                    # if there is return a Tuple of flag = False the related_model object
                    return False, related
            except AttributeError:  # an attribute error for field occurs when checking for AutoField
                pass  # just pass as we dont need to check for AutoField
        return True, None


CustomModel = BaseModelcompany
ModelUseBranch = CustomBaseModel
modewithoutbranch=BaseModel
# CustomModel


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
class DataImport(models.Model):
    IMPORT_CHOICES = (
        ('1', 'أدخل سجلات جديدة'),
        ('2', 'تعديل على السجلات'),
    )
    FILE_CHOICES = (
        ('1', 'اكسل'),
        ('2', 'csv'),
    )
    number= models.CharField(max_length=30,verbose_name=_("Number"))
    document_name = models.CharField(max_length=100)
    import_type = models.CharField(max_length=100, choices=IMPORT_CHOICES)
    file_type = models.CharField(max_length=100, choices=FILE_CHOICES,blank=True,null=True)
    
class DataExport(models.Model):
    FILE_CHOICES = (
        ('1', 'اكسل'),
        ('2', 'csv'),
    )
    number= models.CharField(max_length=30,verbose_name=_("Number"))
    document_name = models.CharField(max_length=100)
    file_type = models.CharField(max_length=100, choices=FILE_CHOICES,blank=True,null=True)
    

# def save_defult_Company():
#     ee=Company.objects.all()
#     if ee.count() > 0:
#         return True
#     else:
        
#         Company(
#             id=1,
#             created_at="2022-01-14 20:24:03.3738+03",
#             modified_at="2022-01-14 20:24:03.3738+03",
#             name_ar="الشركة الاول",
#             name_en="company one",
#             abbrivation_name="الشركة الاول",
#             abbrivation_name_en="",
#             note="لا شيء",
#             image="images/logo.png",
#             created_by_id="",
#             modified_by_id="",
#         ).save()

#         return False

# def save_defult_Branch():
#     ee=Branch.objects.all()
#     if ee.count() > 0:
#         return True
#     else:
#         Branch(
#             id=1,
#             created_at="2022-01-10 20:38:08.218136+03",
#             modified_at="2022-01-10 20:38:08.218136+03",
#             name_ar="الفرع الاول",
#             name_en="الفرع الاول",
#             address="الفرع الاول",
#             address_en="الفرع الاول",
#             first_line="الفرع الاول",
#             second_line="",
#             third_line="",
#             first_line_en="",
#             second_line_en="",
#             third_line_en="",
#             specifiction="",
#             website="",
#             image="images/logo.png",
#             tax_number=0,
#             company_register=0,
#             phone="",
#             company_id=1,
#             created_by_id="",
#             modified_by_id=""
#         ).save()
#         return False

 