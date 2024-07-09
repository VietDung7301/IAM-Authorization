# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Client(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    client_secret = models.CharField(max_length=255)
    redirect_uri = models.TextField()
    client_type = models.IntegerField()
    name = models.CharField(max_length=255)
    homepage_url = models.TextField()
    description = models.TextField(blank=True, null=True)
    createdat = models.DateTimeField(db_column='createdAt')  # Field name made lowercase.
    updatedat = models.DateTimeField(db_column='updatedAt')  # Field name made lowercase.

    def __str__(self):
        return self.name

    class Meta:
        managed = False
        db_table = 'Clients'
