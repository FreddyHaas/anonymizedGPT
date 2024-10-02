import { Chat } from '@/components/chat'
import { nanoid } from 'nanoid'
import { getMissingKeys } from '../../lib/chat/actions'

export const metadata = {
  title: 'AnonymizedGPT'
}

export default async function IndexPage() {
  const id = nanoid()
  const missingKeys = await getMissingKeys()

  return <Chat id={id} missingKeys={missingKeys} />
}
