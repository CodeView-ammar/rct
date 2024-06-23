
''' Class Oaks Message '''
from django.contrib import messages
from django.utils.translation import gettext_lazy as _


class MyMessage():
    ''' Class Messge '''

    def add_successfully(msg=_('The Save Operation Completed Successfully')):
        '''  Message add new  '''
        mes = {
            'message': msg,
            'class': 'alert alert-success',
            'icon': 'fa fa-save'
        }
        return mes

    def update_successfully(msg=_('The Update Operation Completed Successfully')):
        '''  Message Update  '''
        mes = {
            'message': msg,
            'class': 'alert alert-success',
            'icon': 'fa fa-plus'
        }
        return mes

    def delete_successfully(msg=_('The Delete Operation Completed Successfully')):
        '''  Message Delete  '''
        mes = {
            'message': msg,
            'class': 'alert alert-success',
            'icon': 'fa fa-trash-alt'
        }
        return mes

    def edit_password_successfully(msg=_('Password Change Completed Successfully')):
        '''  Message Change  Successfully '''
        mes = {
            'message': msg,
            'class': 'alert alert-success'
        }
        return mes

    def backup_successfully(msg=_('The Backup Created  Successfully')):
        '''  Message Backup Created  Successfully '''
        mes = {
            'message': msg,
            'class': 'alert alert-success'
        }
        return mes

    def backup_error(msg=_('A mistake in The Created Backup')):
        '''  Message Error Backup Created   '''
        mes = {
            'message': msg,
            'class': 'alert alert-danger'
        }
        return mes

    def error_input_data(msg=_('A mistake in The Input Data')):
        '''  Message Error input Data   '''
        mes = {
            'message': msg,
            'class': 'alert alert-danger'
        }
        return mes
    def error_options_sales(msg=_('Error in Variables Sales Please Check Advance Option before Any Transctions')):
        '''  Message Error input Data   '''
        mes = {
            'message': msg,
            'class': 'alert alert-danger'
        }
        return mes

    def restore_error(msg=_('A mistake in The Restore Backup')):
        '''  Message Error Backup Restore   '''
        mes = {
            'message': msg,
            'class': 'alert alert-danger'
        }
        return mes

    def restore_successfully(msg=_('The Backup was Successfully Restored')):
        '''  Message Backup Restored  Successfully '''
        mes = {
            'message': msg,
            'class': 'alert alert-success'
        }
        return mes

    def add_error(msg=_('A mistake in The Save Process')):
        '''  Message  Error In Add '''
        mes = {
            'message': msg,
            'class': 'alert alert-danger',
            'icon': 'fa fa-save'
        }
        return mes
    def add_error_warehouse_variable(msg=_('there are a processes on this item, you can not add')):
        '''  Message  Error In Add '''
        mes = {
            'message': msg,
            'class': 'alert alert-danger',
            'icon': 'fa fa-save'
        }
        return mes

    def qty_error(instance,status,value=0):
        msg=''
        if status==1:
            msg=_('A mistake in The Save Process This is Store: {} have not this item: {}').format(instance.store,instance.item )
            '''  Message  Error In Add '''
        elif status==2:
            msg=_("Quantity at Store less than Required of item: {} Qty: {}").format(instance.item,value)
            '''  Message  Error In Add '''
        mes = {
            'message': msg,
            'class': 'alert alert-danger',
            'icon': 'fa fa-save'
            }
        return mes

    def edit_error(msg=_('A mistake in The Update Process')):
        '''  Message  Error In edit '''
        mes = {
            'message': msg,
            'class': 'alert alert-danger',
            'icon': 'fa fa-plus'
        }
        return mes

    def delete_error(msg=_('A mistake in The Delete Process')):
        '''  Message  Error In Delete '''
        mes = {
            'message': msg,
            'class': 'alert alert-danger',
            'icon': 'fa fa-trash'
        }
        return mes

    def equation_empty(msg=_('Please Inter Your Equation')):
        '''  Message  equation empty '''
        mes = {
            'message': msg,
            'class': 'alert alert-danger',
        }
        return mes

    def equation_formate(msg=_('Please Make Sure From Equation Syntax ( ,+,-,x,)')):
        '''  Message error in equation Syntax'''
        mes = {
            'message': msg,
            'class': 'alert alert-danger',
        }
        return mes
    
    def unlinked(msg=_('Please From Create New Reporter Edit This And Click Save')):
        '''  Message error in Linked Model'''
        mes = {
            'message': msg,
        }
        return mes
    
    def version(msg=_('Sorry! There is a Function Unsupported In This Version')):
        '''  Message error in django.db.Function'''
        mes = {
            'message': msg,
        }
        return mes

    def date_field(msg=_('There a Function Required to Use Only Data Field')):
        '''  Message error in django.db.Function'''
        mes = {
            'message': msg,
        }
        return mes

    def not_exists(msg=_('There are a Culomn not Found in Data Base (Make Sure From Your Inputs)')):
        '''  Message error in django.db'''
        mes = {
            'message': msg,
        }
        return mes

    
    

    def equation_operation_str(msg=_('May You Try to Make Operation with Number and String Make Sure that You Have Both Number Column or You Can Concatenating string By Use Concat( Function instead')):
        '''  Message  Operation error '''
        mes = {
            'message': msg,
            'class': 'alert alert-danger',
        }
        return mes

    def equation_operation(msg=_('The Column Type Mismatch String with Interger Operation')):
        '''  Message  equation Mismatch '''
        mes = {
            'message': msg,
            'class': 'alert alert-danger',
        }
        return mes

    def only_numbers(msg=_('Can not Make Operation With String Column')):
        ''' For The Sumation,Evrageing,Min or Maximum Operations'''
        mes = {
            'message': msg,
            'class': 'alert alert-danger',
        }
        return mes

    def delete_error_operation(msg):
        '''  Message  Error In Delete have related with other tabels '''
        mes = {
            'message': _('Can Not Delete You Have Relation with') ,
            'class': 'alert alert-danger',
            'icon': 'fa fa-trash'
        }
        return mes

    def update_error_operation(msg):
        '''  Message  Error In Update have related with other tabels '''
        mes = {
            'message': _('Can Not Update You Have Relation with'),
            'class': 'alert alert-danger',
            'icon': 'fa fa-plus'
        }
        return mes
    def broker_error_operation():
        '''  Message  Error In Update have related with other tabels '''
        mes = {
            'message': _('You must insert addition broker accounts'),
            'class': 'alert alert-danger',
            'icon': 'fa fa-plus'
        }
        return mes

    def check_input(msg):
        '''  Message  Error In inputs '''
        mes = {
            'message': _('Can Not Save / Update please Make Sure From Your Inputs') + str(msg),
            'class': 'alert alert-danger',
            'icon': 'fa fa-trash-alt'
        }
        return mes

    def record_error_delete(
            msg=_('Sorry, The Current Record Cannot be (deleted) Because it is Related to Other Processes')):
        '''  Message  Error In Delete Record  Related to Other Record '''
        mes = {
            'message': msg,
            'class': 'alert alert-danger'
        }
        return mes

    def login_error(msg=_('Wrong Username or Password')):
        '''  Message  Error In Login '''
        mes = {
            'message': msg,
            'class': 'alert alert-danger'
        }
        return mes
    def request_error(msg=_('Request method not Accepted')):
        '''  Message  Error In request type not as exepected '''
        mes = {
            'message': msg,
            'class': 'alert alert-danger',
            'icon': 'fa fa-save'
        }
        return mes
    def permission_error(msg=_('Sorry You Don\'t Have permission to action')):
        '''  Message  Error In request type not as exepected '''
        mes = {
            'message': msg,
            'class': 'alert alert-danger',
            'icon': 'fa fa-save'
        }
        return mes

message = MyMessage