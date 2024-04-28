from src.application.SettingsChangeObserver import SettingsChangeObserver


class NotifySettingsChangeUseCase:

    _instance = None

    def __init__(self):
        self.observers: [SettingsChangeObserver] = []

    def subscribe(self, observer: SettingsChangeObserver):
        self.observers.append(observer)

    def notify_settings_change(self):
        for observer in self.observers:
            observer.on_settings_change()

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

