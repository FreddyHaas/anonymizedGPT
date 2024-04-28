from src.application.NotifySettingsChangeUseCase import NotifySettingsChangeUseCase
from src.application.port.persistence import PersistencePort


class ChangeSettingsUseCase:

    _instance = None

    def __init__(self, persistence_port: PersistencePort):
        self.persistence = persistence_port
        self.settings_change = NotifySettingsChangeUseCase.get_instance()

    def save_entity(self, entity: str, value: int) -> None:
        self.persistence.save_entity(entity, value)
        self.settings_change.notify_settings_change()

    def get_entity(self, entity: str) -> int:
        return self.persistence.get_entity(entity)

    def get_all_entities(self) -> [str]:
        return self.persistence.get_all_entities()

    def save_allow_list_item(self, item: str) -> None:
        self.persistence.save_allow_list_item(item)
        self.settings_change.notify_settings_change()

    def delete_allow_list_item(self, item: str) -> None:
        self.persistence.delete_allow_list_item(item)
        self.settings_change.notify_settings_change()

    def get_all_allow_list_items(self) -> [str]:
        return self.persistence.get_all_allow_list_items()

    def save_deny_list_item(self, entity: str) -> None:
        self.persistence.save_deny_list_item(entity)
        self.settings_change.notify_settings_change()

    def delete_deny_list_item(self, entity: str) -> None:
        self.persistence.delete_deny_list_item(entity)
        self.settings_change.notify_settings_change()

    def get_all_deny_list_items(self) -> [str]:
        return self.persistence.get_all_deny_list_items()

    @classmethod
    def get_instance(cls, persistence_port: PersistencePort):
        if cls._instance is None:
            cls._instance = cls(persistence_port)
        return cls._instance



