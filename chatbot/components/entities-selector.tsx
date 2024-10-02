'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { useEntities } from '@/lib/hooks/use-entities'

type EntitiesMappingItem = {
  display: string
  value: string
}

export function EntitiesSelector() {
  const { entities, setEntities } = useEntities()

  const entitiesMappingList: Array<EntitiesMappingItem> = [
    { display: 'Person', value: 'PERSON' },
    { display: 'Email address', value: 'EMAIL_ADDRESS' },
    { display: 'Phone number', value: 'PHONE_NUMBER' },
    { display: 'Location', value: 'LOCATION' },
    { display: 'Date time', value: 'DATE_TIME' },
    { display: 'IP address', value: 'IP_ADDRESS' },
    { display: 'URL', value: 'URL' },
    { display: 'IBAN code', value: 'IBAN_CODE' },
    { display: 'Credit card', value: 'CREDIT_CARD' },
    { display: 'Crypto', value: 'CRYPTO' }
  ]

  function toggleEntity(entity: string) {
    if (entities.includes(entity)) {
      setEntities(entities => entities.filter(entry => entry != entity))
    } else {
      setEntities(entities => [...entities, entity])
    }
  }

  return (
    <div className="flex flex-col">
      {entitiesMappingList.map((entity, index) => (
        <div className="flex items-center space-x-2 pl-2 py-1" key={index}>
          <Checkbox
            id={entity.value.toLocaleLowerCase()}
            value={entity.value}
            checked={entities.includes(entity.value)}
            onCheckedChange={() => toggleEntity(entity.value)}
          />
          <label
            htmlFor={entity.value.toLocaleLowerCase()}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {entity.display}
          </label>
        </div>
      ))}
    </div>
  )
}
