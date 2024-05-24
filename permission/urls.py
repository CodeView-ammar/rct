from django.urls import path
from permission import views
from permission.activitykey import ActivityKeyView,ActivitonView,unit_actionView, unit_actionListJson
urlpatterns = [
    path('permission/permission/',views.add_new_permission,name='add_new_permission' ),
    path('permission/permissiongroup/<int:pk>/',views.permission_group_delete,name='permission_group_delete' ),
    path('PermissionGroupListJson/',views.PermissionGroupListJson.as_view(),name='PermissionGroupListJson'),
    path('usersgroup',views.UsersGroupView.as_view(),name='UsersGroupView'),
    path('UsersGroupListJson/',views.UsersGroupListJson.as_view(),name='UsersGroupListJson'),
    path('typedevice',views.TypeDeviceView.as_view(),name='TypeDeviceView'),
    path('TypeDeviceListJson/',views.TypeDeviceListJson.as_view(),name='TypeDeviceListJson'),
    path('loadBranchDevice/',views.load_branch_device,name='load_branch_device'),
    path('profile/',views.UsersDetilesView.as_view(),name='UsersDetilesView'),
    path('UsersDetilesViewPassword/',views.change_password,name='UsersDetilesViewPassword'),
    path('UsersDetilesViewPermission/',views.change_usergroup,name='UsersDetilesViewPermission'),
    path('UsersDetilesListJson/',views.UsersDetilesListJson.as_view(),name='UsersDetilesListJson'),
    path('change_db/',views.change_db,name='change_db'),
    path('login/',views.login,name='login'), 
    path('activtykey',ActivityKeyView.as_view(),name='activtykey'), 
    path('activiton',ActivitonView.as_view(),name='activiton'), 

    path("unit_actionView", unit_actionView.as_view(), name="unit_actionView"),
    path("unit_actionListJson", unit_actionListJson.as_view(), name="unit_actionListJson"),
    path('',views.logout,name='logout'),
    path('change_branch/',views.change_branch,name='change_branch'),
    path('test/',views.test,name='test'),
    path('create-auth-token/',views.create_auth_token,name='create_auth_token'),
    
]
