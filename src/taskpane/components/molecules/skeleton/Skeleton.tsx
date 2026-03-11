import React from "react";
import { Divider, Skeleton, SkeletonItem } from "@fluentui/react-components";
import { observer } from "mobx-react";
import { useSkeletonStyles } from "./styles";

const ItemSkeleton = ({ title }) => {
  const styles = useSkeletonStyles();

  return (
    <div className={styles.container}>
      <Divider className={styles.title}>{title}</Divider>
      <Skeleton appearance="translucent" className={styles.skeletonBlock}>
        <SkeletonItem size={48} />
        <SkeletonItem size={40} />
        <SkeletonItem size={40} />
      </Skeleton>
    </div>
  );
};

export default observer(ItemSkeleton);
