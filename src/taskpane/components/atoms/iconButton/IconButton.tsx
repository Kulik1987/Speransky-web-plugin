import React from "react";
import { Button, Tooltip } from "@fluentui/react-components";
import { useIconButtonStyles } from "./styles";

type IconButtonProps = {
  tooltip: string;
  icon: React.ReactElement;
  onClick: () => void;
  positioning?: "above" | "above-start" | "above-end" | "below-end";
  appearance?: "primary" | "transparent";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
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
  className,
}: IconButtonProps) => {
  const styles = useIconButtonStyles();

  return (
    <Tooltip content={{ children: tooltip, className: styles.tooltip }} relationship="label" positioning={positioning}>
      <Button
        appearance={appearance}
        size={size}
        onClick={onClick}
        icon={icon}
        disabled={disabled}
        className={className}
      />
    </Tooltip>
  );
};

export default IconButton;
