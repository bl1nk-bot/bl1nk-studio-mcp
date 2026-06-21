import { useEffect, useRef } from "react";
import { marked } from "marked";

interface MarkdownPreviewProps {
  content: string;
}

marked.setOptions({ gfm: true, breaks: true });

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const html = marked.parse(content) as string;
      ref.current.innerHTML = html;
    }
  }, [content]);

  return <div ref={ref} className="prose-teal" />;
}
