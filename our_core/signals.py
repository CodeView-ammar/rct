from django.db.models.signals import pre_save, pre_delete
from django.dispatch import receiver
from permission.models import UsersDetiles
from django.utils import timezone

@receiver(pre_save)
def pre_save_callback(sender, instance, **kwargs):
    
    # if not instance and instance.id:
    from our_core.our_middleware import RequestMiddleware
    request = RequestMiddleware(get_response=None)
    try:
        request_ = request.thread_local.username_
    
    except Exception:
            request_=None        
    if request_:   
        # request = request.user
        try:
            if not instance.id:
                # إذا كانت هذه أول مرة يتم حفظ الكائن
                instance.created_by = UsersDetiles.objects.get(id=request_)
                instance.created_at = timezone.now()
            else:
                instance.modified_by = UsersDetiles.objects.get(id=request_)
                instance.modified_at = timezone.now()
        except Exception:
            pass