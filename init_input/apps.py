from django.apps import AppConfig


class InitInputConfig(AppConfig):
    name = 'init_input'
    def ready(self):
        import our_core.signals