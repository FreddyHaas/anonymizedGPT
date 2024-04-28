from abc import ABC, abstractmethod


class PersistenceAbstractClass(ABC):

    @abstractmethod
    def save_entity(self, entity: str, value: int) -> None:
        pass

    @abstractmethod
    def get_entity(self, entity: str) -> int:
        pass

    @abstractmethod
    def get_all_entities(self) -> [str]:
        pass

    @abstractmethod
    def save_allow_list_item(self, item: str) -> None:
        pass

    @abstractmethod
    def delete_allow_list_item(self, item: str) -> None:
        pass

    @abstractmethod
    def get_all_allow_list_items(self) -> [str]:
        pass

    @abstractmethod
    def save_deny_list_item(self, entity: str) -> None:
        pass

    @abstractmethod
    def delete_deny_list_item(self, entity: str) -> None:
        pass

    @abstractmethod
    def get_all_deny_list_items(self) -> [str]:
        pass
