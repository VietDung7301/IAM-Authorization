from django.db import models


class Permissions(models.Model):
    id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    active = models.IntegerField()
    accessible_url = models.CharField(max_length=255)
    method = models.CharField(max_length=6)
    createdat = models.DateTimeField(db_column='createdAt')  # Field name made lowercase.
    updatedat = models.DateTimeField(db_column='updatedAt')  # Field name made lowercase.
    scopeid = models.ForeignKey('Scope', models.DO_NOTHING, db_column='ScopeId', blank=True, null=True)  # Field name made lowercase.

    def __str__(self):
        return self.title

    class Meta:
        managed = False
        db_table = 'permissions'


class RoleScope(models.Model):
    createdat = models.DateTimeField(db_column='createdAt')  # Field name made lowercase.
    updatedat = models.DateTimeField(db_column='updatedAt')  # Field name made lowercase.
    roleid = models.OneToOneField('Role', models.DO_NOTHING, db_column='RoleId', primary_key=True)  # Field name made lowercase. The composite primary key (RoleId, ScopeId) found, that is not supported. The first column is selected.
    scopeid = models.ForeignKey('Scope', models.DO_NOTHING, db_column='ScopeId')  # Field name made lowercase.

    def __str__(self):
        return f'{self.roleid.title} - {self.scopeid.title}'

    class Meta:
        managed = False
        db_table = 'role_scope'
        unique_together = (('roleid', 'scopeid'),)


class Role(models.Model):
    id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    active = models.IntegerField()
    createdat = models.DateTimeField(db_column='createdAt')  # Field name made lowercase.
    updatedat = models.DateTimeField(db_column='updatedAt')  # Field name made lowercase.

    def __str__(self):
        return self.title

    class Meta:
        managed = False
        db_table = 'roles'


class Scope(models.Model):
    id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    active = models.IntegerField()
    createdat = models.DateTimeField(db_column='createdAt')  # Field name made lowercase.
    updatedat = models.DateTimeField(db_column='updatedAt')  # Field name made lowercase.

    def __str__(self):
        return self.title

    class Meta:
        managed = False
        db_table = 'scopes'

