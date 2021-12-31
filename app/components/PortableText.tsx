import SanityPortableText from '@sanity/block-content-to-react'
import {config} from '~/lib/sanity'

export interface Block {
  _key: string
  _type: string
  style: string
  children: BlockChild[]
}

export interface BlockChild {
  text: string
}

const serializers = {
  container: ({children}: {children: any}) => children,
}

export function PortableText({blocks}: {blocks: Block[]}) {
  return (
    <div className="prose prose-a:text-first-500">
      <SanityPortableText {...config} serializers={serializers} blocks={blocks} />
    </div>
  )
}
