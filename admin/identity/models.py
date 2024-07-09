from django.db import models


class Fingerprint(models.Model):
    user = models.OneToOneField('User', models.DO_NOTHING, primary_key=True)
    fingerprints = models.CharField(max_length=255, blank=True, null=True)
    createdat = models.DateTimeField(db_column='createdAt')  # Field name made lowercase.
    updatedat = models.DateTimeField(db_column='updatedAt')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Fingerprints'


class Linkedaccount(models.Model):
    user = models.OneToOneField('User', models.DO_NOTHING, primary_key=True)
    provider = models.CharField(max_length=255)
    sub = models.CharField(max_length=255)
    createdat = models.DateTimeField(db_column='createdAt')  # Field name made lowercase.
    updatedat = models.DateTimeField(db_column='updatedAt')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'LinkedAccounts'


class Otp(models.Model):
    user = models.OneToOneField('User', models.DO_NOTHING, primary_key=True)  # The composite primary key (user_id, type) found, that is not supported. The first column is selected.
    type = models.IntegerField()
    otp = models.IntegerField()
    is_used = models.IntegerField()
    expires = models.CharField(max_length=255)
    createdat = models.DateTimeField(db_column='createdAt')  # Field name made lowercase.
    updatedat = models.DateTimeField(db_column='updatedAt')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Otps'
        unique_together = (('user', 'type'),)


class User(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    role_id = models.IntegerField()
    username = models.CharField(unique=True, max_length=255)
    password = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    given_name = models.CharField(max_length=255, blank=True, null=True)
    family_name = models.CharField(max_length=255, blank=True, null=True)
    nickname = models.CharField(max_length=255, blank=True, null=True)
    preferred_username = models.CharField(max_length=255, blank=True, null=True)
    profile = models.CharField(max_length=255, blank=True, null=True)
    picture = models.CharField(max_length=255, blank=True, null=True)
    website = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(max_length=255)
    email_verified = models.IntegerField()
    gender = models.CharField(max_length=255, blank=True, null=True)
    birthdate = models.DateTimeField()
    zoneinfo = models.CharField(max_length=255, blank=True, null=True)
    locale = models.CharField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length=255)
    phone_number_verified = models.IntegerField()
    address = models.CharField(max_length=255, blank=True, null=True)
    createdat = models.DateTimeField(db_column='createdAt')  # Field name made lowercase.
    updatedat = models.DateTimeField(db_column='updatedAt')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Users'
