import { Button, Group } from "@mantine/core";
import { useEffect, useState, type FC } from "react";
import { type TItem } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

type Props = TItem;

const Item: FC<Props> = ({ label, id, icon, disabled, entity }) => {
  const handleClick = () => {
    window.alt.emit("select", id, entity);
  };
  const [Icon, setIcon] = useState<IconProp>()

  useEffect(() => {loadIcon()}, [])

  const loadIcon = async () => {
    if(!icon) return

    const imp = await import(`@fortawesome/free-solid-svg-icons`)

    //@ts-ignore
    setIcon(imp[icon])
  }

  return (
    <Button size="xs" variant="light" onClick={handleClick} disabled={disabled}>
      <Group gap={10}>
        {Icon && <FontAwesomeIcon icon={Icon}/>}{label}
      </Group>
    </Button>
  );
};

export default Item;
