from pydantic import BaseModel


class Config:
    from_attributes = True


MappingDataType = dict[str, dict[str, str]]


class Message(BaseModel):
    role: str
    content: str


class AnonymizationRequest(BaseModel):
    original_messages: list[Message]
    deanonymization_mapping: MappingDataType
    allow_list: list[str]
    entities: list[str]


class AnonymizationResponse(BaseModel):
    anonymized_messages: list[Message]
    updated_deanonymization_mapping: MappingDataType
