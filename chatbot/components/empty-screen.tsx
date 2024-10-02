import { ExternalLink } from './external-link';

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-lg font-semibold">Welcome to AnonymizedGPT!</h1>
        <p className="leading-normal text-muted-foreground">
          AnonymizedGPT is an open source AI chatbot app that anonymizes
          sensible information in your prompts before sending them to the OpenAI
          Api. Usage requires setting an <ExternalLink href="https://platform.openai.com/account/api-keys"> OpenAI API key</ExternalLink>.
        </p>
        <p className="font-semibold">
          {' '}
          Try it yourself with the example prompt below!
        </p>
      </div>
    </div>
  )
}
