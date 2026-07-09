import React from "react";
import { Divider, mergeClasses, Skeleton, SkeletonItem } from "@fluentui/react-components";
import { observer } from "mobx-react";
import { useSkeletonStyles } from "./styles";
import { useCommonStyles } from "../../../theme/commonStyles";

const ItemSkeleton = ({ title }: { title: string }) => {
  const styles = useSkeletonStyles();
  const commonStyles = useCommonStyles();

  return (
    <div className={styles.container}>
      <Divider className={mergeClasses(commonStyles.divider, styles.title)}>{title}</Divider>
      <Skeleton appearance="translucent" className={styles.skeletonBlock}>
        <SkeletonItem size={48} />
        <SkeletonItem size={40} />
        <SkeletonItem size={40} />
      </Skeleton>
    </div>
  );
};

export default observer(ItemSkeleton);
