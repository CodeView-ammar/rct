from django.db import models
from our_core.models import ModelUseBranch,CustomModel
from django.utils.translation import ugettext_lazy as _


class NotificationVariables(CustomModel):
    saturday = models.BooleanField(verbose_name=_("Saturday"), default=False)
    sunday = models.BooleanField(verbose_name=_("Sunday"), default=False)
    monday = models.BooleanField(verbose_name=_("Monday"), default=False)
    tuesday = models.BooleanField(verbose_name=_("Tuesday"), default=False)
    wednesday = models.BooleanField(verbose_name=_("Wednesday"), default=False)
    thursday = models.BooleanField(verbose_name=_("Thursday"), default=False)
    friday = models.BooleanField(verbose_name=_("Friday"), default=False)
    all_days = models.BooleanField(verbose_name=_("All Days"), default=False)
    hours_to_notify = models.IntegerField(verbose_name=_("Hours To Notify"))
    types = [('1', _("System Default Notify")), ('4', _('Popup Message')), ('3', _("Custom Default Notify")),
             ('2', _("Marquee"))]
    notify_type = models.CharField(choices=types, verbose_name=_("Type of Notification"), max_length=50)
    num_of_messages = models.IntegerField(verbose_name=_("Number of Messages to Show"))
    every_seconds = models.IntegerField(verbose_name=_("Every  Seconds"))
    placement = [('top', _("top")), ('bottom', _("bottom"))]
    placement_alight = [('right', _("right")), ('left', _("left"))]
    gl_placement_from = models.CharField(choices=placement, verbose_name=_("Placement From"), max_length=50,
                                         default='top')
    gl_placement_align = models.CharField(choices=placement_alight, verbose_name=_("Placement Align"), max_length=50,
                                          default='right')
    animate_enter = [('fadeInRight', _("fadeInRight")),
                     ('bounceInDown', _("bounceInDown")),
                     ('bounceIn', _("bounceIn")), ('flipInY', _("flipInY")),
                     ('lightSpeedIn', _("lightSpeedIn")), ('rollIn', _("rollIn")),
                     ('zoomInDown', _("zoomInDown"))]
    animate_exit = [('fadeOutRight', _("fadeOutRight")),
                    ('bounceOutUp', _("bounceOutUp")),
                    ('bounceOut', _("bounceOut")),
                    ('flipOutX', _("flipOutX")),
                    ('lightSpeedOut', _("lightSpeedOut")),
                    ('rollOut', _("rollOut")),
                    ('zoomInDown', _("zoomInDown")), ('zoomOutUp', _("zoomOutUp"))]
    gl_animate_enter = models.CharField(choices=animate_enter, verbose_name=_("Animate Enter"), max_length=50,
                                        default='fadeInRight')
    gl_animate_exit = models.CharField(choices=animate_exit, verbose_name=_("Animate Exit"), max_length=50,
                                       default='fadeOutRight')
    allow_dismiss = models.BooleanField(verbose_name=_("Allow Dismiss"), default=False)
    gl_newest_on_top = models.BooleanField(verbose_name=_("Newest on Top"), default=False)

    class Meta:
        verbose_name=_("Notification")
        

