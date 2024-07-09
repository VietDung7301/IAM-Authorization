from django.contrib import admin
from .models import Role, RoleScope, Scope, Permission


class RoleAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'description', 'active']
    list_editable = ['title', 'description', 'active']


class RoleScopeAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'roleid', 'scopeid']


class ScopeAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'description', 'active']
    list_editable = ['title', 'description', 'active']


class PermissionAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'accessible_url', 'method', 'scopeid']


admin.site.register(Role, RoleAdmin)
admin.site.register(RoleScope, RoleScopeAdmin)
admin.site.register(Scope, ScopeAdmin)
admin.site.register(Permission, PermissionAdmin)
