from django.contrib.admin.models import LogEntry
from django.contrib.contenttypes.models import ContentType

def log_action(user, window, action_type, details=None, action_flag=1):
    content_type = ContentType.objects.get(model=window)
    LogEntry.objects.create(
        user_id=user,
        content_type_id=content_type.id,
        object_id=None,
        object_repr=action_type,
        action_flag=action_flag,
        change_message=details,
    )



