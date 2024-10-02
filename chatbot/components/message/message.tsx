'use client'

import {
  IconEyeClosed,
  IconEyeOpen,
  IconOpenAI,
  IconUser
} from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import React, { Dispatch, SetStateAction } from 'react'
import { renderToString } from 'react-dom/server'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { MemoizedReactMarkdown } from '../markdown'
import { CodeBlock } from '../ui/codeblock'
import { spinner } from './spinner'

// Different types of message bubbles.

export function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex size-[25px] shrink-0 select-none items-center justify-center rounded-md border bg-background shadow-sm">
        <IconUser />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden pl-2">
        {children}
      </div>
    </div>
  )
}

export function AnonymizedText({
  anonymizedText,
  deanonymizerMapping,
  anonymizedView,
  setAnonymizedView
}: {
  anonymizedText: string
  deanonymizerMapping: { [key: string]: { [key: string]: string } }
  anonymizedView: Boolean
  setAnonymizedView: Dispatch<SetStateAction<Boolean>>
}): React.ReactElement {
  if (deanonymizerMapping === undefined || deanonymizerMapping === null) {
    return <p>{anonymizedText}</p>
  }

  const anonymizedWords = Object.keys(deanonymizerMapping).flatMap(value =>
    Object.keys(deanonymizerMapping[value])
  )

  const escapeRegExp = (text: string) => {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  const regex = new RegExp(
    `(${anonymizedWords.map(escapeRegExp).join('|')})`,
    'gi'
  )

  function deanonymizePhrase(anonymizedPhrase: string): string {
    const entities = Object.keys(deanonymizerMapping)

    for (const entity of entities) {
      if (
        deanonymizerMapping[entity] !== undefined &&
        deanonymizerMapping[entity][anonymizedPhrase]
      ) {
        return deanonymizerMapping[entity][anonymizedPhrase]
      }
    }

    return anonymizedPhrase
  }

  function toggleAnonymizedView() {
    setAnonymizedView(prev => !prev)
  }

  const segments = anonymizedText.split(regex)

  const highlightedSegments = segments.map((segment, index) => {
    if (anonymizedWords.includes(segment)) {
      return anonymizedView ? (
        <button
          key={index}
          className="bg-green-600 w-fit px-2 rounded-md inline-flex justify-center items-center gap-1 cursor-pointer"
          onClick={toggleAnonymizedView}
        >
          <IconEyeClosed />
          {segment}
        </button>
      ) : (
        <button
          key={index}
          className="bg-red-400 w-fit px-2 rounded-md inline-flex justify-center items-center gap-1 cursor-pointer"
          onClick={toggleAnonymizedView}
        >
          <IconEyeOpen />
          {deanonymizePhrase(segment)}
        </button>
      )
    } else {
      return segment
    }
  })

  return <p>{highlightedSegments}</p>
}

export function BotMessage({
  content,
  deanonymizerMapping,
  className,
  anonymizedView,
  setAnonymizedView
}: {
  content: string
  deanonymizerMapping: { [key: string]: { [key: string]: string } }
  className?: string
  anonymizedView: Boolean
  setAnonymizedView: Dispatch<SetStateAction<Boolean>>
}) {
  return (
    <div className={cn('group relative flex items-start md:-ml-12', className)}>
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
        <IconOpenAI />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        <MemoizedReactMarkdown
          className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
          rehypePlugins={[rehypeRaw as any]}
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>
            },
            code({ node, inline, className, children, ...props }) {
              if (children.length) {
                if (children[0] == '▍') {
                  return (
                    <span className="mt-1 animate-pulse cursor-default">▍</span>
                  )
                }

                children[0] = (children[0] as string).replace('`▍`', '▍')
              }

              const match = /language-(\w+)/.exec(className || '')

              if (inline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ''}
                  value={String(children).replace(/\n$/, '')}
                  {...props}
                />
              )
            }
          }}
        >
          {renderToString(
            <AnonymizedText
              anonymizedText={content}
              deanonymizerMapping={deanonymizerMapping}
              anonymizedView={anonymizedView}
              setAnonymizedView={setAnonymizedView}
            ></AnonymizedText>
          )}
        </MemoizedReactMarkdown>
      </div>
    </div>
  )
}

export function BotSpinnerMessage() {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
        <IconOpenAI />
      </div>
      <div className="ml-4 h-[24px] flex flex-row items-center flex-1 space-y-2 overflow-hidden px-1">
        {spinner}
      </div>
    </div>
  )
}

export function UserSpinnerMessage() {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex size-[25px] shrink-0 select-none items-center justify-center rounded-md border bg-background shadow-sm">
        <IconUser />
      </div>
      <div className="ml-4 h-[24px] flex flex-row items-center flex-1 space-y-2 overflow-hidden px-1">
        {spinner}
      </div>
    </div>
  )
}
