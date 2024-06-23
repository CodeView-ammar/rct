from django.contrib import admin
from configration.models import Building,Department,TypeFile,Section,Cuntry,Subject,Division
from guardian.admin import GuardedModelAdmin
from our_core.signals import pre_save_callback
from unfold.admin import ModelAdmin
class customAdmin(ModelAdmin):
    pass
# Register your models here.

admin.site.register(Building,customAdmin)# admin.site.register(Company)
admin.site.register(Department,customAdmin)# admin.site.register(Company)
admin.site.register(TypeFile,customAdmin)# admin.site.register(Company)
admin.site.register(Section,customAdmin)# admin.site.register(Company)
admin.site.register(Cuntry,customAdmin)# admin.site.register(Company)
admin.site.register(Subject,customAdmin)# admin.site.register(Company)
admin.site.register(Division,customAdmin)# admin.site.register(Company)




