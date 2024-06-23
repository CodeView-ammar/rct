from django.apps import AppConfig


class OurCoreConfig(AppConfig):
    name = 'our_core'
    def ready(self):
        import our_core.signals