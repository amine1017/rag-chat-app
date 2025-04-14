import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

export default function MarkdownMessage({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        pre: ({ node, ...props }) => (
          <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto" {...props} />
        ),
        code: ({ node, ...props }) => (
          <code className="text-sm" {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className="mb-2 text-sm leading-relaxed" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
