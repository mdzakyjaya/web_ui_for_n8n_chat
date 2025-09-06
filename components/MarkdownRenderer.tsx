import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const renderContent = () => {
    let html = content
      // Basic HTML escaping
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const lines = html.split('\n');
    let output = '';
    let inList = false;
    let inCodeBlock = false;
    let codeBlockContent = '';

    for (const line of lines) {
      // --- Handle code blocks ---
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          // End of code block
          output += `<pre class="bg-gray-800 rounded-md p-4 my-2 overflow-x-auto"><code class="text-sm text-white">${codeBlockContent.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
          inCodeBlock = false;
          codeBlockContent = '';
        } else {
          // Start of code block
          if (inList) { // Close list if we enter a code block
              output += `</ul>`;
              inList = false;
          }
          inCodeBlock = true;
        }
        continue; // Move to next line
      }

      if (inCodeBlock) {
        codeBlockContent += line + '\n';
        continue;
      }

      // --- Handle lists ---
      if (line.trim().startsWith('* ')) {
        if (!inList) {
          output += `<ul class="list-disc list-outside pl-6 space-y-1 my-3">`;
          inList = true;
        }
        // Apply inline formatting to list item content
        const itemContent = line.trim().substring(2)
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/`([^`]+)`/g, '<code class="bg-gray-700 rounded-md px-2 py-1 text-sm font-mono text-fuchsia-300">$1</code>');
        output += `<li>${itemContent}</li>`;
      } else {
        // Not a list item, so close any open list
        if (inList) {
          output += `</ul>`;
          inList = false;
        }

        // --- Handle paragraphs ---
        if (line.trim() !== '') {
          // Apply inline formatting to paragraph content
          const pContent = line
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/`([^`]+)`/g, '<code class="bg-gray-700 rounded-md px-2 py-1 text-sm font-mono text-fuchsia-300">$1</code>');
          output += `<p>${pContent}</p>`;
        }
        // Blank lines are treated as separators, so we output nothing for them.
      }
    }

    // Close any open tags at the end of the content
    if (inList) {
      output += `</ul>`;
    }
    if (inCodeBlock) { // Should not happen with valid markdown, but as a safeguard
      output += `<pre class="bg-gray-800 rounded-md p-4 my-2 overflow-x-auto"><code class="text-sm text-white">${codeBlockContent.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
    }
      
    return { __html: output };
  };

  return <div dangerouslySetInnerHTML={renderContent()} />;
};

export default MarkdownRenderer;
