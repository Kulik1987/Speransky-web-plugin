import React from "react";
import { Button, Spinner, Tooltip } from "@fluentui/react-components";
import { useCommonStyles } from "../../../theme/commonStyles";

type IconButtonProps = {
  tooltip: string;
  icon: React.ReactElement;
  onClick: () => void;
  positioning?: "above" | "above-start" | "above-end" | "below-end";
  appearance?: "primary" | "transparent";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
};

const IconButton = ({
  tooltip,
  icon,
  onClick,
  positioning = "above",
  appearance = "transparent",
  size = "small",
  disabled,
  loading,
  className,
}: IconButtonProps) => {
  const commonStyles = useCommonStyles();

  return (
    <Tooltip
      content={{ children: tooltip, className: commonStyles.tooltip }}
      relationship="label"
      positioning={positioning}
    >
      <Button
        appearance={appearance}
        size={size}
        onClick={onClick}
        icon={loading ? <Spinner size="tiny" /> : icon}
        disabled={disabled || loading}
        className={className}
      />
    </Tooltip>
  );
};

export default IconButton;
