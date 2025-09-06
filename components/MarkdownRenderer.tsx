
import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const renderContent = () => {
    let html = content
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-700 rounded-md px-2 py-1 text-sm font-mono text-fuchsia-300">$1</code>')
      .replace(/```([\s\S]*?)```/g, (_match, code) => `<pre class="bg-gray-800 rounded-md p-4 my-2 overflow-x-auto"><code class="text-sm text-white">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`)
      .replace(/\n/g, '<br />');

    return { __html: html };
  };

  return <div dangerouslySetInnerHTML={renderContent()} />;
};

export default MarkdownRenderer;
