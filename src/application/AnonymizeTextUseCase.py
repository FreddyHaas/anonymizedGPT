from presidio_analyzer import AnalyzerEngine, PatternRecognizer
from presidio_anonymizer import AnonymizerEngine

from src.adapter.persistence.PersistenceAdapter import PersistenceAdapter
from src.application.ChangeSettingsUseCase import ChangeSettingsUseCase

DENY_LIST_RECOGNIZER = "deny_list"


class AnonymizeTextUseCase:
    _analyzer = AnalyzerEngine()
    _anonymizer = AnonymizerEngine()
    _settings = ChangeSettingsUseCase.get_instance(PersistenceAdapter.get_instance())

    @classmethod
    def anonymize(cls, text: str) -> str:

        entities = [entity.upper() for entity in cls._settings.get_all_entities()]
        allow_list = cls._settings.get_all_allow_list_items()
        deny_list = cls._settings.get_all_deny_list_items()

        cls._analyzer.registry.remove_recognizer(DENY_LIST_RECOGNIZER)

        if len(deny_list) != 0:
            entities.append("CUSTOM_PII")
            deny_list_recognizer = PatternRecognizer(supported_entity="CUSTOM_PII",
                                                     name=DENY_LIST_RECOGNIZER,
                                                     deny_list=deny_list)
            print(deny_list_recognizer.name)
            cls._analyzer.registry.add_recognizer(deny_list_recognizer)

        if len(entities) == 0:
            return text

        results = cls._analyzer.analyze(text=text,
                                        entities=entities,
                                        language="en",
                                        allow_list=allow_list
                                        )
        anonymized_text = cls._anonymizer.anonymize(text=text, analyzer_results=results)

        return anonymized_text.text
