import string
from typing import Optional, Dict, Callable

from langchain_experimental.data_anonymizer.deanonymizer_mapping import create_anonymizer_mapping, MappingDataType, \
    DeanonymizerMapping
from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine, OperatorConfig, ConflictResolutionStrategy
from schemas.schemas import Message, AnonymizationResponse

FAKER_SEED = 42


class AnonymizationService:
    def __init__(
            self
    ):
        self._operators = self._create_operators()
        self._analyzer = AnalyzerEngine()
        self._anonymizer = AnonymizerEngine()

    def anonymize_message(
            self,
            original_messages: list[Message],
            existing_deanonymization_mapping: MappingDataType,
            allow_list: list[str],
            entities: list[str]
    ) -> AnonymizationResponse:

        deanonymization_mapping = DeanonymizerMapping()
        deanonymization_mapping.update(new_mapping=existing_deanonymization_mapping)

        for message in original_messages:
            new_deanonymization_mapping = self._create_deanonymization_mapping(allow_list, entities, message)
            deanonymization_mapping.update(new_deanonymization_mapping)

        anonymized_messages = [
            self._anonymize_message(message, deanonymization_mapping.data)
            for message in original_messages
        ]

        return AnonymizationResponse(
            anonymized_messages=anonymized_messages,
            updated_deanonymization_mapping=deanonymization_mapping.data
        )

    def _create_deanonymization_mapping(self, allow_list, entities, original_message):
        analyzer_results = self._analyzer.analyze(
            text=original_message.content,
            language='en',
            entities=entities,
            allow_list=allow_list
        )
        anonymizer_results = self._anonymizer.anonymize(
            text=original_message.content,
            analyzer_results=analyzer_results,
            operators=self._operators
        )
        filtered_analyzer_results = self._anonymizer._remove_conflicts_and_get_text_manipulation_data(
            analyzer_results,
            ConflictResolutionStrategy.MERGE_SIMILAR_OR_CONTAINED
        )
        new_deanonymization_mapping = create_anonymizer_mapping(
            original_text=original_message.content,
            analyzer_results=filtered_analyzer_results,
            anonymizer_results=anonymizer_results,
            is_reversed=True,
        )
        return new_deanonymization_mapping

    def _create_operators(self) -> Dict[str, OperatorConfig]:
        return {
            field: OperatorConfig(
                operator_name="custom", params={"lambda": faker_function}
            )
            for field, faker_function in self._get_pseudoanonymizer_mapping().items()
        }

    @staticmethod
    def _anonymize_message(message: Message, deanonymization_mapping: MappingDataType) -> Message:
        for entities, mapped_values in deanonymization_mapping.items():
            for anonymized_value, original_value in mapped_values.items():
                message.content = message.content.replace(original_value, anonymized_value)
        return message

    @staticmethod
    def _get_pseudoanonymizer_mapping(seed: Optional[int] = None) -> Dict[str, Callable]:
        """Get a mapping of entities to pseudo anonymize them."""
        try:
            from faker import Faker
        except ImportError as e:
            raise ImportError(
                "Could not import faker, please install it with `pip install Faker`."
            ) from e
        fake = Faker()
        fake.seed_instance(seed)
        # Source: https://microsoft.github.io/presidio/supported_entities/
        # Listed  entities supported by Microsoft Presidio (for now, global and US only)
        return {
            "PERSON": lambda _: fake.name(),
            # Global entities
            "EMAIL_ADDRESS": lambda _: fake.email(),
            "PHONE_NUMBER": lambda _: fake.phone_number(),
            "IBAN_CODE": lambda _: fake.iban(),
            "CREDIT_CARD": lambda _: fake.credit_card_number(),
            "CRYPTO": lambda _: "bc1"
                                + "".join(
                fake.random_choices(string.ascii_lowercase + string.digits, length=26)
            ),
            "IP_ADDRESS": lambda _: fake.ipv4_public(),
            "LOCATION": lambda _: fake.city(),
            "DATE_TIME": lambda _: fake.date(),
            "NRP": lambda _: str(fake.random_number(digits=8, fix_len=True)),
            "MEDICAL_LICENSE": lambda _: fake.bothify(text="??######").upper(),
            "URL": lambda _: fake.url(),
            # US-specific entities
            "US_BANK_NUMBER": lambda _: fake.bban(),
            "US_DRIVER_LICENSE": lambda _: str(fake.random_number(digits=9, fix_len=True)),
            "US_ITIN": lambda _: fake.bothify(text="9##-7#-####"),
            "US_PASSPORT": lambda _: fake.bothify(text="#####??").upper(),
            "US_SSN": lambda _: fake.ssn(),
            # UK-specific entities
            "UK_NHS": lambda _: str(fake.random_number(digits=10, fix_len=True)),
            # Spain-specific entities
            "ES_NIF": lambda _: fake.bothify(text="########?").upper(),
            # Italy-specific entities
            "IT_FISCAL_CODE": lambda _: fake.bothify(text="??????##?##?###?").upper(),
            "IT_DRIVER_LICENSE": lambda _: fake.bothify(text="?A#######?").upper(),
            "IT_VAT_CODE": lambda _: fake.bothify(text="IT???????????"),
            "IT_PASSPORT": lambda _: str(fake.random_number(digits=9, fix_len=True)),
            "IT_IDENTITY_CARD": lambda _: lambda _: str(
                fake.random_number(digits=7, fix_len=True)
            ),
            # Singapore-specific entities
            "SG_NRIC_FIN": lambda _: fake.bothify(text="????####?").upper(),
            # Australia-specific entities
            "AU_ABN": lambda _: str(fake.random_number(digits=11, fix_len=True)),
            "AU_ACN": lambda _: str(fake.random_number(digits=9, fix_len=True)),
            "AU_TFN": lambda _: str(fake.random_number(digits=9, fix_len=True)),
            "AU_MEDICARE": lambda _: str(fake.random_number(digits=10, fix_len=True)),
        }
