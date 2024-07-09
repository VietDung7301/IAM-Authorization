class Router:
    """
    A router to control all database operations on models in the application.
    """
    def db_for_read(self, model, **hints):
        print(model._meta.app_label)
        print(model._meta.get_fields())
        if model._meta.app_label == 'role':
            return 'role'
        elif model._meta.app_label == 'identity':
            return 'identity'
        elif model._meta.app_label == 'access':
            return 'access'
        return 'authorization'

    def db_for_write(self, model, **hints):
        print(model._meta.get_fields())
        if model._meta.app_label == 'role':
            return 'role'
        elif model._meta.app_label == 'identity':
            return 'identity'
        elif model._meta.app_label == 'access':
            return 'access'
        return 'authorization'

    def allow_relation(self, obj1, obj2, **hints):
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        return None
