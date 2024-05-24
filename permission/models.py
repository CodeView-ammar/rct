from django.db import models
from django.utils.translation import ugettext_lazy as _

from our_core.models  import ModelUseBranch,CustomModel
from our_core.models  import Company
from our_core.models  import Branch

from .managers import CustomUserManager

from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import BaseUserManager
# from translations.models import Translatable
class PermissionGroup(models.Model):
    """
    All permisssion groups in OUR system 
    """
    group_name = models.CharField(_("Group name"),max_length=200,unique=True)
    def __str__(self):
        return self.group_name
class Systems(models.Model):
    """
    All subsystem in OUR System 
    """

    system_name = models.CharField(_("System name"),max_length=200,unique=True)
    system_name_ar = models.CharField(_("System name ar"),max_length=200,default="")
    system_code = models.CharField(_("System code"),max_length=200,unique=True)
    is_active = models.BooleanField(_("is active"),default=True)
    branch_sys= models.ManyToManyField(Branch, through='BranchSystem')
    groub = models.ManyToManyField(PermissionGroup,through='GroupSystems')
    def __str__(self):
        return self.system_name

class SystemTabs(models.Model):
    """
    contain The tabs that belong to system from systems model
    """
    
    tab_name = models.CharField(_("Tab name"),max_length=200)
    tab_name_ar = models.CharField(_("Tab name ar"),max_length=200,default="")
    tab_code = models.CharField(_("Tab code"),max_length=200 ,unique=True)
    is_system = models.BooleanField(_("Is system",),default=False)
    system= models.ForeignKey(Systems,on_delete=models.CASCADE)
    groub = models.ManyToManyField(PermissionGroup,through='GroupTabs')
    #to detrmain any tab will show in permissiins screen
    def __str__(self):
        return self.tab_code
        
class TabScreens(models.Model):
     
    """
        conntain The Screens that belong to Tabs from SystemTabs model
    """
    screen_name = models.CharField(_("Screen name"),max_length=200,)
    screen_name_ar = models.CharField(_("Screen name ar"),max_length=200,default="")
    screen_code = models.CharField(_("Screen code"),max_length=200,unique=True)
    has_view = models.BooleanField(_("Has view",),default=False)
    has_add = models.BooleanField(_("Has add",),default=False)
    has_edit = models.BooleanField(_("Has edit",),default=False)
    has_delete = models.BooleanField(_("Has delete",),default=False)
    has_print = models.BooleanField(_("Has print",),default=False)
    is_active = models.BooleanField(_("is active"),default=True)

    system_tabs = models.ForeignKey(SystemTabs,on_delete=models.CASCADE)
    group_screens = models.ManyToManyField(PermissionGroup, through='GroupScreens')
    def __str__(self):
        return self.screen_code
class TabPartionsPermission(models.Model): 
    """
        The partions permission that belong to scrrens from TabScreens model
    """
    permission_name = models.CharField(_("Permission name"),max_length=200,unique=True)
    permission_name_ar = models.CharField(_("Permission name ar"),max_length=200,default="")
    permission_code = models.CharField(_("Permission code"),max_length=200,unique=True)
    is_active = models.BooleanField(_("Is active",),default=True)
    tab_screens  = models.ForeignKey(TabScreens,on_delete=models.CASCADE)
    group_partion= models.ManyToManyField(PermissionGroup, through='GroupPartionPermission')
    def __str__(self):
        return self.permission_name
#many to many models
class GroupPartionPermission(models.Model): 
    """
        The group partions permission that many to many between TabPartionsPermission PermissionGroup
    """
    is_active = models.BooleanField(_("Is active",),default=False)
    tab_partions= models.ForeignKey(TabPartionsPermission,on_delete=models.CASCADE)
    group = models.ForeignKey(PermissionGroup,on_delete=models.CASCADE)
    def __str__(self):
        return str(self.is_active)

class GroupScreens(models.Model): 
    """
        The  permission that belong to permission group with screens
    """
    can_view = models.BooleanField(_("Can view",),default=False)
    can_add = models.BooleanField(_("Can add",),default=False)
    can_edit = models.BooleanField(_("Can edit",),default=False)
    can_delete = models.BooleanField(_("Can delete",),default=False)
    can_print = models.BooleanField(_("Has print",),default=False)
    tab_screens= models.ForeignKey(TabScreens,on_delete=models.CASCADE)
    group = models.ForeignKey(PermissionGroup,on_delete=models.CASCADE) 
    def __str__(self): 
        return str(self.can_view) 
class GroupTabs(models.Model): 
    """ 
        The group tabs permission that many to many between Groups and SystemTabs
    """
    is_active = models.BooleanField(_("Is active",),default=False)
    system_tabs= models.ForeignKey(SystemTabs,on_delete=models.CASCADE)
    group = models.ForeignKey(PermissionGroup,on_delete=models.CASCADE)
    def __str__(self):
        return str(self.is_active)
class GroupSystems(models.Model): 
    """
        The group tabs permission that many to many between Groups and SystemTabs
    """
    is_active = models.BooleanField(_("Is active",),default=False)
    systems= models.ForeignKey(Systems,on_delete=models.CASCADE)
    group = models.ForeignKey(PermissionGroup,on_delete=models.CASCADE)
    def __str__(self):
        return str(self.group)
    def __str__(self):
        return str(self.systems)

class BranchSystem(models.Model):
    """
        The branch tabs permission that many to many between Groups and SystemTabs
    """
    system= models.ForeignKey(Systems,on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch,on_delete=models.CASCADE)
    branch_group = models.ManyToManyField(PermissionGroup,blank=True)
    def __str__(self):
        return str(self.system)


class UsersGroup(models.Model):
    """
    it is user group to join in users models
    """
    name_ar = models.CharField(_("name_ar"),max_length=50)
    name_en = models.CharField(_("name_en"),max_length=50)
    company = models.ForeignKey(Company,models.CASCADE,blank=True,null=True)
    # objects =  UserDataBaseManger()

    def __str__(self):
        return self.name_ar
class TypeDevice(models.Model):
    """
    It is used in user for everyone has Name Device only or many  
    """
    name_device =models.CharField(_("Name Device"),max_length=200)
    mac_address = models.CharField(_("Mac Address"),max_length=50)
    ip_address = models.CharField(_("IP Address"),max_length=50)
    serel_cpu = models.CharField(_("erel_cpu"),max_length=200)
    branch = models.ForeignKey(Branch,verbose_name =_("Branch"), on_delete= models.CASCADE,blank=True,null=True)
    def __str__(self):
        return self.name_device
class UsersDetiles(AbstractBaseUser ,PermissionsMixin):
    """
    It is used in users to save system users
    """
    username =models.CharField(max_length=200, unique=True,verbose_name=_("User Name"))
    password = models.CharField(max_length=500,verbose_name=_("password"))
    active = models.BooleanField(default=True,verbose_name=_("status"))
    usrsgroup = models.ForeignKey(UsersGroup,on_delete= models.CASCADE,blank=True,null=True,verbose_name=_("usrsgroup"))
    is_staff = models.BooleanField( default =True)
    is_superuser = models.BooleanField( default =False )
    is_admin = models.BooleanField( default =False )
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()
    # objects =  UserDataBaseManger()

    def __str__(self):
        return self.username   


    def user_branch(self):
    
        # get all the related object
        try:
            
            user_branch_all = UsersDetilesUserBranch.objects.filter(usersdetiles_id=self.id)
                # if related.exists():
                #     # if there is return a Tuple of flag = False the related_model object
                #     return False, related
        except AttributeError:  # an attribute error for field occurs when checking for AutoField
            # just pass as we dont need to check for AutoField
            pass
        return user_branch_all
    def user_permission_group(self):
    
        try:
            user_permission_group_all = UsersDetilesUserPermissionGroup.objects.filter(usersdetiles_id=self.id)  
        except AttributeError:  # an attribute error for field occurs when checking for AutoField
            pass
        return user_permission_group_all
class UsersDetilesUserBranch(models.Model):
    """
    It is used in users to save user_branch
    """
    usersdetiles = models.ForeignKey(UsersDetiles,on_delete= models.CASCADE,blank=True,null=True,verbose_name=_("UsersDetiles"))
    branch = models.ForeignKey(Branch,on_delete= models.CASCADE,blank=True,null=True,verbose_name=_("branch"))

    class Meta:
        db_table = "permission_usersdetiles_user_branch"
    def __str__(self):
        return self.branch.name_ar    
class UsersDetilesUserPermissionGroup(models.Model):
    """
    It is used in users to save user_branch
    """
    usersdetiles = models.ForeignKey(UsersDetiles,on_delete= models.CASCADE,blank=True,null=True)
    permissiongroup = models.ForeignKey(PermissionGroup,on_delete= models.CASCADE,blank=True,null=True)
    class Meta:
        db_table = "permission_usersdetiles_user_permission_group"
    # def __str__(self):
        # return self.permissiongroup.group_name    

class UsersDetilesTypeDevice(models.Model):
    """
    It is used in users to save user_branch
    """
    usersdetile = models.ForeignKey(UsersDetiles,on_delete= models.CASCADE,blank=True,null=True,verbose_name=_("UsersDetiles"))
    typedevice = models.ForeignKey(TypeDevice,on_delete= models.CASCADE,blank=True,null=True,verbose_name=_("branch"))

    class Meta:
        db_table = "permission_usersdetiles_type_device"


class ActivityKey(models.Model):
    """
    It is used in users to save user_branch
    """
    activity_key = models.CharField(max_length=200, unique=True,verbose_name=_("User Name"))
    info_cpu = models.CharField(max_length=200, unique=True,verbose_name=_("User Name"))
    def delete_everything(self):
        try:
            ActivityKey.objects.all().delete()
        except ObjectDoesNotExist as e:
            raise InvoiceExcept(_("the unit {0} is not existe ".format(self.unit)))



class info_client(models.Model):
    name_client_ar=models.CharField(max_length=200,unique=True,verbose_name=_("اسم العميل"))
    phon_client=models.CharField(max_length=200,verbose_name=_("رقم جوال العميل"))
    address_client=models.CharField(max_length=200,verbose_name=_("عنوان العميل "))
    date_client=models.CharField(max_length=200,verbose_name=_("تاريخ التحاق العميل"))
    agreed_amount=models.CharField(max_length=200,verbose_name=_("المبلغ المتفق عليه دولار"))
    amount_paid_dollar=models.CharField(max_length=200,verbose_name=_("المبلغ المدفوع دولار"))
    remaining_dollar_amount=models.CharField(max_length=200,verbose_name=_("المبلغ المتبقي دولار"))
    activate_key1=models.CharField(max_length=200,unique=True,verbose_name=_("السريال المرسل من العميل"))
    activate_key2=models.CharField(max_length=500,verbose_name=_("السريل الخاص بالعميل")) 


from django.db.models import signals
from django.dispatch import receiver

@receiver(signals.post_save, sender=Branch)
def create_superuser_branch(sender, instance,created, **kwargs):
    """ when add Branch Must be Add To SuperUser 

    Args:
        sender ([Branch]): [the model Who keept under eye when any change]
        instance ([Branch]): [description]
        created ([boolean]): [return true if instance created else False]
    """
    if created:
        for i in UsersDetiles.objects.all().filter(is_superuser=True):
            
            UsersDetilesUserBranch.objects.create(usersdetiles=i,branch=instance)
            # i.user_branch.add(instance.id)

@receiver(signals.pre_delete, sender=Branch, dispatch_uid='deleted_user_branch_signal')
def deleted_user_branch(sender, instance, using, **kwargs):
    # for i in UsersDetiles.objects.filter(is_superuser=True):
    #     UsersDetilesUserBranch.objects.delete(usersdetiles=i.id,branch=instance.id)
    pass
        # i.user_branch.remove(instance.id)
    



# def save_defult_usersgroup():
#     ee=UsersGroup.objects.all()
#     if ee.count() > 0:
#         print("UsersGroup"*50)
#         print(ee.count())
#         return True
#     else:
#         print("ammar"*100)
#         print(ee.count())
#         return False

# class BranchSystemBranchGroup(models.Model):
#     """
#         The branch tabs permission that many to many between Groups and SystemTabs
#     """
#     # # system= models.ForeignKey(Systems,on_delete=models.CASCADE)
#     # branchsystem = models.ForeignKey(BranchSystem,on_delete= models.CASCADE,blank=True,null=True)
#     # permissiongroup = models.ForeignKey(PermissionGroup,on_delete= models.CASCADE,blank=True,null=True)
#     # class Meta:
#     #     db_table = "permission_branchsystem_branch_group"    
#     pass

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


