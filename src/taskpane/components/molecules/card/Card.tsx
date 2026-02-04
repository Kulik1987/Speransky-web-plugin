import React, { ReactNode, useState } from "react";
import { Card as CardUI, CardHeader, Text } from "@fluentui/react-components";
import { useCardStyles } from "./styles";

type CardProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  text: string;
  children?: ReactNode;
  onClick?: () => void;
};

const Card = (props: CardProps) => {
  const { title, subtitle, text, icon, children, onClick } = props;
  const [isOpen, setIsOpen] = useState(false);
  const styles = useCardStyles();

  const handleClick = () => {
    if (children) {
      setIsOpen((prev) => !prev);
    } else {
      onClick();
    }
  };

  return (
    <CardUI appearance="filled" className={styles.card} onClick={handleClick}>
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
