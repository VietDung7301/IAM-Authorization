from django.contrib import admin
from .models import User, Linkedaccount


class UserAdmin(admin.ModelAdmin):
    list_display = ['id', 'role_id', 'username', 'name', 'phone_number']
    exclude = ['password']


class LinkedaccountAdmin(admin.ModelAdmin):
    list_display = ['user', 'provider', 'sub']


admin.site.register(User, UserAdmin)
admin.site.register(Linkedaccount, LinkedaccountAdmin)
