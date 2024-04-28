from src.application.port.persistence.PersistencePort import PersistenceAbstractClass
import configparser
import os
from src.config import ASSETS_PATH


class PersistenceAdapter(PersistenceAbstractClass):

    _instance = None

    def __init__(self):
        self.config = configparser.ConfigParser()
        self.config_file_path = os.path.join(ASSETS_PATH, 'config.ini')
        self.config.read(self.config_file_path)

        if 'entities' not in self.config:
            if 'entities' not in self.config:
                self.config.add_section('entities')
            self.config['entities']['PERSON'] = str(1)

        if 'allow_list' not in self.config:
            self.config.add_section('allow_list')
            self.config['allow_list']['items'] = ''

        if 'deny_list' not in self.config:
            self.config.add_section('deny_list')
            self.config['deny_list']['items'] = ''

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def save_entity(self, entity: str, value: int) -> None:
        self.config['entities'][entity] = str(value)
        with open(os.path.join(self.config_file_path), 'w') as configfile:
            self.config.write(configfile)

    def get_entity(self, entity: str) -> int:
        return int(self.config['entities'][entity])

    def get_all_entities(self) -> [str]:
        entities = []
        for entity, value in self.config['entities'].items():
            if value == '1':
                entities.append(entity)
        return entities

    def save_allow_list_item(self, item: str) -> None:
        self.config['allow_list']['items'] += ',' + item
        with open(self.config_file_path, 'w') as configfile:
            self.config.write(configfile)

    def delete_allow_list_item(self, item: str) -> None:
        items = self.config['allow_list']['items'].split(',')
        if item in items:
            items.remove(item)
            self.config['allow_list']['items'] = ','.join(items)
            with open(self.config_file_path, 'w') as configfile:
                self.config.write(configfile)

    def get_all_allow_list_items(self) -> [str]:
        allow_list = self.config['allow_list']['items'].split(',')
        allow_list.remove('')
        return allow_list

    def save_deny_list_item(self, entity: str) -> None:
        self.config['deny_list']['items'] += ',' + entity
        with open(self.config_file_path, 'w') as configfile:
            self.config.write(configfile)

    def delete_deny_list_item(self, entity: str) -> None:
        entities = self.config['deny_list']['items'].split(',')
        if entity in entities:
            entities.remove(entity)
            self.config['deny_list']['items'] = ','.join(entities)
            with open(self.config_file_path, 'w') as configfile:
                self.config.write(configfile)

    def get_all_deny_list_items(self) -> [str]:
        deny_list = self.config['deny_list']['items'].split(',')
        deny_list.remove('')
        return deny_list

