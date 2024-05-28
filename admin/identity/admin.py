from django.contrib import admin
from .models import User, Otp, Fingerprint


admin.site.register(User)
admin.site.register(Otp)
admin.site.register(Fingerprint)
