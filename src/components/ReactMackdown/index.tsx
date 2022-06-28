import React from "react";
import ReactMarkdown from "react-markdown"; // 解析 markdown
import remarkGfm from "remark-gfm"; // markdown 对表格/删除线/脚注等的支持
import MarkNav from "markdown-navbar"; // markdown 目录
import "markdown-navbar/dist/navbar.css";

interface IProps {
  mackdown: string;
}

const ReactMackdown: React.FC<IProps> = ({ mackdown }) => {
  return (
    <div className="App">
      <div className="leftSide">
        <MarkNav className="toc-list" source={mackdown} ordered />
      </div>
      <div className="markdown-body content">
        <ReactMarkdown children={mackdown} remarkPlugins={[remarkGfm]} />
      </div>
    </div>
  );
};

export default ReactMackdown;
