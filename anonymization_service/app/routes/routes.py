from fastapi import APIRouter, HTTPException, Depends

from schemas.schemas import AnonymizationResponse, AnonymizationRequest
from services.anonymization_service import AnonymizationService

router = APIRouter()

@router.post("/messages/anonymize", response_model=AnonymizationResponse)
def post_chatbot_message(request: AnonymizationRequest):
    try:
        messages = AnonymizationService().anonymize_message(
            original_messages=request.original_messages,
            existing_deanonymization_mapping=request.deanonymization_mapping,
            allow_list=request.allow_list,
            entities=request.entities
        )
        return AnonymizationResponse(
            anonymized_messages=messages.anonymized_messages,
            updated_deanonymization_mapping=messages.updated_deanonymization_mapping
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
