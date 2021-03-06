/**
 * @ts-ignore # 忽视本行代码的小错误
 * @ts-nocheck # 忽略全文
 * @ts-check # 取消忽略全文
 */
import "katex/dist/katex.min.css";
import React, { ReactNode } from "react";
import classname from "classname";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import styles from "./index.less";

interface IProps {
  mackdown: string;
  className?: string;
}

const Preview: React.FC<IProps> = ({ mackdown, className: classProps }) => {
  const createA = (children: ReactNode) => (
    <a id={`${children}`} href={`#${children}`}>
      {children}
    </a>
  );

  const renderH = ({
    children,
    level,
    ...props
  }: {
    children: ReactNode;
    level: number;
  }) => {
    switch (level) {
      case 1:
        return <h1 {...props}>{createA(children)}</h1>;
      case 2:
        return <h2 {...props}>{createA(children)}</h2>;
      case 3:
        return <h3 {...props}>{createA(children)}</h3>;
      case 4:
        return <h4 {...props}>{createA(children)}</h4>;
      case 5:
        return <h5 {...props}>{createA(children)}</h5>;
      case 6:
        return <h6 {...props}>{createA(children)}</h6>;
      default:
        return <h3 {...props}>{createA(children)}</h3>;
    }
  };

  return (
    <div className={classname(styles.container, classProps)}>
      <ReactMarkdown
        children={mackdown}
        // remarkMath 及 rehypeKatex 插件的作用
        remarkPlugins={[[remarkGfm, { singleTilde: false }], remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, "")}
                style={oneDark}
                language={match[1]}
                PreTag="div"
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          h2: ({ node, children, level, ...props }) =>
            renderH({ children, level, ...props }) as any,
          h3: ({ node, children, level, ...props }) =>
            renderH({ children, level, ...props }) as any,
          blockquote: ({ node, ...props }) => (
            <blockquote className={styles.blockquote} {...props} />
          ),
        }}
      />
    </div>
  );
};
export default Preview;
