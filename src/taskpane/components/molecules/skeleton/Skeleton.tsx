import React from "react";
import { Skeleton, SkeletonItem } from "@fluentui/react-components";
import { observer } from "mobx-react";
import { useSkeletonStyles } from "./styles";

const ItemSkeleton = () => {
  const styles = useSkeletonStyles();

  return (
    <div className={styles.container}>
      <Skeleton className={styles.skeletonBlock}>
        <div className={styles.block}>
          <SkeletonItem size={24} className={styles.item64} />
          <SkeletonItem size={24} className={styles.item64} />
        </div>
        <SkeletonItem size={72} />
        <SkeletonItem size={72} />

        <div className={styles.block}>
          <SkeletonItem size={32} shape="rectangle" className={styles.item32} />
          <SkeletonItem size={32} shape="rectangle" className={styles.item96} />
          <SkeletonItem size={32} shape="rectangle" className={styles.item96} />
        </div>
      </Skeleton>
    </div>
  );
};

export default observer(ItemSkeleton);
