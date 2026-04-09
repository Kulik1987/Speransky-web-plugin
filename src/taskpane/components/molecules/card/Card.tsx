import React, { ReactNode, useState } from "react";
import { Card as CardUI, CardHeader, Text, mergeClasses } from "@fluentui/react-components";
import { useCardStyles } from "./styles";

type CardProps = {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  text?: string;
  children?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
};

const Card = (props: CardProps) => {
  const { title, subtitle, text, icon, children, disabled, onClick } = props;
  const [isOpen, setIsOpen] = useState(false);
  const styles = useCardStyles();

  const handleClick = () => {
    if (disabled) return;
    if (children) {
      setIsOpen((prev) => !prev);
    } else {
      onClick?.();
    }
  };

  return (
    <CardUI
      appearance="filled"
      className={mergeClasses(styles.card, disabled && styles.disabled)}
      onClick={handleClick}
    >
      <CardHeader
        image={{ children: icon }}
        header={
          <Text weight="semibold" size={400} className={styles.title}>
            {title}
          </Text>
        }
        description={<Text className={styles.subtitle}>{subtitle}</Text>}
      />
      <Text className={styles.text}>{text}</Text>
      {isOpen && children && <div className={styles.content}>{children}</div>}
    </CardUI>
  );
};

export default Card;
