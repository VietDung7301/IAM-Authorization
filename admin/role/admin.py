from django.contrib import admin
from .models import Role, RoleScope, Scope, Permissions


admin.site.register(Role)
admin.site.register(RoleScope)
admin.site.register(Scope)
admin.site.register(Permissions)
