import { Box, Card, CloseButton, Stack } from "@mantine/core";
import { useState } from "react";
import Item from "./components/Item";
import useEvent from "./hooks/useEvent";

export type TItem = {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  entity: any
};

function App() {
  const [items, setItems] = useState([] as TItem[]);
  const [pos, setPos] = useState({x: 0, y: 0})

  useEvent("setItems", setItems);
  useEvent("setPos", setPos);

  const handleClose = () => {
    window.alt.emit('close')
  }

  return (
    <Box w={250} pos='fixed' left={pos.x} top={pos.y}>
      <Card p={10}>
        <Stack justify="center" align="end" >
          <CloseButton c='red'onClick={handleClose}/>
        </Stack>
        <Stack gap={10}>
          {items.map((item) => (
            <Item key={item.id} {...item} />
          ))}
        </Stack>
      </Card>
    </Box>
  );
}

export default App;
