import React from "react";
import { Skeleton, SkeletonItem } from "@fluentui/react-components";
import { observer } from "mobx-react";

const ItemSkeleton = () => {
  return (
    <div
      style={{
        border: "1px solid rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        boxShadow: "0 3px 5px rgba(0, 0, 0, 0.25)",
      }}
    >
      <Skeleton style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
          <SkeletonItem size={24} style={{ maxWidth: "64px" }} />
          <SkeletonItem size={24} style={{ maxWidth: "64px" }} />
        </div>
        <SkeletonItem size={72} />
        <SkeletonItem size={72} />

        <div style={{ display: "flex", gap: "12px" }}>
          <SkeletonItem size={32} shape="rectangle" style={{ maxWidth: "32px" }} />
          <SkeletonItem size={32} shape="rectangle" style={{ maxWidth: "96px" }} />
          <SkeletonItem size={32} shape="rectangle" style={{ maxWidth: "96px" }} />
        </div>
      </Skeleton>
    </div>
  );
};

export default observer(ItemSkeleton);
