from django.contrib import admin

from .models import Client


class ClientAdmin(admin.ModelAdmin):
    list_display = ['id', 'client_type', 'redirect_uri', 'name']
    exclude = ['client_secret']
    list_editable = ['client_type', 'redirect_uri', 'name']


admin.site.register(Client, ClientAdmin)
