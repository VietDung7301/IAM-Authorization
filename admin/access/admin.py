from django.contrib import admin

from .models import Country


class CountryAdmin(admin.ModelAdmin):
    list_display = ['id', 'country_short', 'country_long', 'region', 'city']
    list_editable = ['country_short', 'country_long', 'region', 'city']


admin.site.register(Country, CountryAdmin)
