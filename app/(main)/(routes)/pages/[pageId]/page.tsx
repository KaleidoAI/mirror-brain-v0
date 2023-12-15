"use client";

import { useMutation, useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { useMemo } from "react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";

interface PageIdPageProps {
  params: {
    pageId: Id<"pages">;
  };
};

const PageIdPage = ({
  params
}: PageIdPageProps) => {
  const Editor = useMemo(() => dynamic(() => import("@/components/editor"), { ssr: false }) ,[]);

  const document = useQuery(api.pages.getPage, {
    id: params.pageId
  });

  const updatePageContent = useMutation(api.pages.updatePageContent);
  const updatePageMarkdown = useMutation(api.pages.updatePageMarkdown);

  const updateContent = (raw_content: string) => {
    updatePageContent({
      id: params.pageId,
      content: raw_content
    });
  };

  const updateMarkdown = (markdown: string) => {
    updatePageMarkdown({
      id: params.pageId,
      markdown
    });
  };

  if (document === undefined) {
    return (
      <div>
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <div>Not found</div>
  }

  return ( 
    <div className="pb-40">
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={document} />
        <Editor
          updateContent={updateContent}
          updateMarkdown={updateMarkdown}
          initialContent={document.content}
          editable={true}
          id={params.pageId}
        />
      </div>
    </div>
  );
}

export default PageIdPage;
