"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { useRouter } from "next/navigation";

const MarkdownRenderer = () => {
  const [markdownContent, setMarkdownContent] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/gameplay_guide.md")
      .then((res) => res.text())
      .then((text) => setMarkdownContent(text));

    // Scroll to the correct section on mount
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.replace("#", ""));
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <ReactMarkdown
        rehypePlugins={[
          rehypeSlug,
          rehypeAutolinkHeadings,
          rehypeHighlight,
        ]}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;