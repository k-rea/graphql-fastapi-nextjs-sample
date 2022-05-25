import * as React from "react";
import {memo} from "react";
import {DndProvider} from "react-dnd";
import { HTML5Backend } from 'react-dnd-html5-backend';
import {Heading, Stack} from "@chakra-ui/react";

type PropTypes = {
  name: string,
  value: string,
  children: React.ReactNode
};
const Column = memo(({children, name, value}: PropTypes) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Stack backgroundColor="blackAlpha.200" h="90vh" w="200pt" p={4}>
        <Heading as="h3" size="md">
          {value}
        </Heading>
        {children}
      </Stack>
    </DndProvider>
  );
});
Column.displayName = 'Board'
export default Column;
