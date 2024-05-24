from our_core.our_form import CustomModelForm

from our_notifications.models import NotificationVariables


class NotificationVariablesForm(CustomModelForm):
    def set_initial_val(self):
        notify_data = NotificationVariables.objects.filter(pk=2)
        if notify_data:
            self.fields["saturday"].initial = notify_data[0].saturday
            self.fields["sunday"].initial = notify_data[0].sunday
            self.fields["monday"].initial = notify_data[0].monday
            self.fields["tuesday"].initial = notify_data[0].tuesday
            self.fields["wednesday"].initial = notify_data[0].wednesday
            self.fields["thursday"].initial = notify_data[0].thursday
            self.fields["friday"].initial = notify_data[0].friday
            self.fields["all_days"].initial = notify_data[0].all_days
            self.fields["hours_to_notify"].initial = notify_data[0].hours_to_notify
            self.fields["notify_type"].initial = notify_data[0].notify_type
            self.fields["num_of_messages"].initial = notify_data[0].num_of_messages
            self.fields["every_seconds"].initial = notify_data[0].every_seconds
            self.fields["gl_placement_from"].initial = notify_data[0].gl_placement_from
            self.fields["gl_placement_align"].initial = notify_data[0].gl_placement_align
            self.fields["gl_animate_enter"].initial = notify_data[0].gl_animate_enter
            self.fields["gl_animate_exit"].initial = notify_data[0].gl_animate_exit
            self.fields["allow_dismiss"].initial = notify_data[0].allow_dismiss
            self.fields["gl_newest_on_top"].initial = notify_data[0].gl_newest_on_top

    def __init__(self, *args, **kwargs):
        super(NotificationVariablesForm, self).__init__(*args, **kwargs)
        self.fields["notify_type"].widget.attrs.update(
            {
                "onchange": "getNotifyTypes(this)",
            }
        )
        self.fields["gl_placement_from"].widget.attrs.update(
            {
                "onchange": "getPlacementAnimate()",
            }
        )
        self.fields["gl_placement_align"].widget.attrs.update(
            {
                "onchange": "getPlacementAnimate()",
            }
        )
        self.fields["gl_animate_enter"].widget.attrs.update(
            {
                "onchange": "getPlacementAnimate()",
            }
        )
        self.fields["gl_animate_exit"].widget.attrs.update(
            {
                "onchange": "getPlacementAnimate()",
            }
        )
        self.fields["allow_dismiss"].widget.attrs.update(
            {
                "onchange": "getPlacementAnimate()",
            }
        )
        self.fields["gl_newest_on_top"].widget.attrs.update(
            {
                "onchange": "getPlacementAnimate()",
            }
        )
        self.fields["all_days"].widget.attrs.update(
            {
                "onchange": "checkAllDays(this)",
            }
        )
        self.fields["hours_to_notify"].widget.attrs.update(
            {
                "min": "1",
                "max": "5",
                "oninput": "checkValidNumber(this)",
            }
        )
        self.fields["num_of_messages"].widget.attrs.update(
            {
                "min": "1",
                "max": "5",
                "oninput": "checkValidNumber(this)",
            }
        )
        self.fields["every_seconds"].widget.attrs.update(
            {
                "min": "1",
                "max": "59",
                "oninput": "checkValidNumber(this)",
            }
        )

    class Meta:
        model = NotificationVariables
        # fields = "__all__"
        exclude = ['created_by', 'modified_by']
