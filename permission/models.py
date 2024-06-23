from django.db import models
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin


class UsersDetiles(AbstractBaseUser ,PermissionsMixin):
    """
    It is used in users to save system users
    """
    username =models.CharField(max_length=200, unique=True,verbose_name=_("User Name"))
    password = models.CharField(max_length=500,verbose_name=_("password"))
    active = models.BooleanField(default=True,verbose_name=_("status"))
    is_staff = models.BooleanField( default =True)
    is_superuser = models.BooleanField( default =False )
    is_admin = models.BooleanField( default =False )
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []
    
    objects =  CustomUserManager()

    def __str__(self):
        return self.username   

    


def save_defult_UsersDetiles():
    ee=UsersDetiles.objects.all()
    p=[]
    if ee.count() > 0:
        return True
    else:
        p=UsersDetiles(
            id=1,
            last_login='2024-02-10 00:42:45.838931+03', 
            username='admin', 
            password='pbkdf2_sha256$216000$DHk0XLaK2wZ4$pin++NXaj/MmN/QrAC0uCi869F08CBaNKVj46gx1y4Y=',
            active=True,
            is_staff=True,
            is_superuser=True,
            # emplayee_id='',
            is_admin=True,
            usrsgroup_id='',
            )
        p.save()
        return False

