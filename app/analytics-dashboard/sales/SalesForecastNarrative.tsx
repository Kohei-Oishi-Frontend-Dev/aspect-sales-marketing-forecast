import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeSanitize from "rehype-sanitize";
import type {salesNarrativeData} from "./page";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

type SalesForecastNarrativeProps = {
  className?: string;
  salesNarrativeData?: salesNarrativeData;
};

export default function SalesForecastNarrative({
  className = "",
  salesNarrativeData,
}: SalesForecastNarrativeProps) {
  const md = String(salesNarrativeData?.narrative ?? "");

  return (
    <Card className={"w-full " + className}>
      <CardHeader>
        <CardTitle>Sales Narrative</CardTitle>
      </CardHeader>
      <CardContent>
        {md ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            rehypePlugins={[rehypeSanitize]}
            components={{
              p: ({ children }) => <p className="mb-2">{children}</p>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
              ul: ({ children }) => <ul className="list-disc pl-5 mb-3">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-5 mb-3">{children}</ol>,
              li: ({ children }) => <li className="mb-1">{children}</li>,
              code: ({ children }) => <code className="bg-gray-100 px-1 rounded text-sm">{children}</code>,
            }}
          >
            {md}
          </ReactMarkdown>
        ) : null}
      </CardContent>
    </Card>
  );
}
