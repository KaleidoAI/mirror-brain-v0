"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import { Item } from "./item";

export const DocumentList = () => {
  const params = useParams();
  const router = useRouter();

  const documents = useQuery(api.pages.getAllPages);

  const onRedirect = (documentId: string) => {
    router.push(`/pages/${documentId}`);
  };

  if (documents === undefined) {
    return (
      <>
        <Item.Skeleton />
        <Item.Skeleton />
        <Item.Skeleton />
      </>
    );
  };

  return (
    <>
      {documents.map((document) => (
        <div key={document._id}>
          <Item
            id={document._id}
            onClick={() => onRedirect(document._id)}
            label={document.title}
            active={params.pageId === document._id}
          />
        </div>
      ))}
    </>
  );
};
