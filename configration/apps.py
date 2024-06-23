from django.apps import AppConfig


class ConfigrationConfig(AppConfig):
    name = 'configration'
    def ready(self):
        import our_core.signals