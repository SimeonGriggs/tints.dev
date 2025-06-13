import { PortableText } from "@portabletext/react";

export interface Block {
  _key: string;
  _type: string;
  style: string;
  children: BlockChild[];
}

export interface BlockChild {
  text: string;
}

export function Prose({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose prose-a:text-first-500 prose-headings:tracking-tight prose-headings:text-pretty">
      <PortableText value={blocks} />
    </div>
  );
}
