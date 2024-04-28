from abc import ABC, abstractmethod


class SettingsChangeObserver(ABC):

    @abstractmethod
    def on_settings_change(self) -> None:
        pass
