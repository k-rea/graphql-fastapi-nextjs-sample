import type {NextPage} from 'next'
import dynamic from 'next/dynamic'
import {GetStaticProps} from 'next'
import Head from 'next/head'
import {DndProvider, useDrag, useDrop} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {TouchBackend} from "react-dnd-touch-backend";
import React, {useRef, useState} from "react";
import {Box, Center, Checkbox, Heading, HStack, Stack} from "@chakra-ui/react";

type MovableItemType = {
  item: ItemType,
  setItems: React.Dispatch<any>,
  index: number
  moveCardHandler: (d: number, h: number) => void
}
const MovableItem = ({item, setItems, index, moveCardHandler}: MovableItemType) => {
  const ref = useRef<HTMLDivElement>(null)
  const changeItemColumn = (currentItem: ItemType, columnName: string) => {
    setItems((prevState: ItemType[]) => (
      prevState.map(e => (
        {...e, column: e.name === currentItem.name ? columnName : e.column,}
      ))
    ))
  }
  const [, drop] = useDrop<ItemType & { index: number }>({
    accept: 'Our first type',
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = !!clientOffset ? clientOffset.y - hoverBoundingRect.top : 0
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveCardHandler(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  const [{isDragging}, drag] = useDrag({
    type: 'Our first type',
    item: () => ({...item, index}),
    end: (i, monitor) => {
      const dropResult = monitor.getDropResult<DropResultType>()
      if (dropResult && dropResult.name === 'Column 1') {
        changeItemColumn(i, 'Column 1')
      } else if (dropResult && dropResult.name === 'Column 2') {
        changeItemColumn(i, 'Column 2')
      }

    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    })
  })
  const opacity = isDragging ? 0.4 : 1
  drag(drop(ref))
  return (
    // <div className='movable-item'>
    <Box ref={ref} opacity={opacity} p={4} backgroundColor="blackAlpha.100">
      <Checkbox>
        {item.name + ':index' + index}
      </Checkbox>
    </Box>
  )
}

type ColumnType = {
  title: string
  children?: React.ReactNode
}
type DropResultType = {
  dropEffect: string,
  name: string
}

const Column = ({title, children}: ColumnType) => {
  const [, drop] = useDrop({
    accept: 'Our first type',
    drop: () => ({name: title}),
  })
  return (
    <Stack ref={drop} h="80vh" w="300px" backgroundColor="blackAlpha.50" p={4}>
      <Heading as="h3" size="md" mb={2}> {title} </Heading>
      <Stack spacing={4}>
        {children}
      </Stack>
    </Stack>
  )
}

type ItemType = {
  id: number,
  name: string,
  column: string,
}

const Home: NextPage = () => {
  const [items, setItems] = useState<ItemType[]>([
    {id: 1, name: 'Item 1', column: "Column 1"},
    {id: 2, name: 'Item 2', column: "Column 1"},
    {id: 3, name: 'Item 3', column: "Column 1"},
  ])
  const moveCardHandler = (dragIndex: number, hoverIndex: number) => {
    const dragItem = items[dragIndex]
    if (dragItem) {
      setItems((prevState) => {
        const copyItems = [...prevState]
        const prevItem = copyItems.splice(hoverIndex, 1, dragItem)
        copyItems.splice(dragIndex, 1, prevItem[0])
        return copyItems
      })
    }
  }
  const returnItemsForColumn = (columnName: string) => {
    return items
      .map((item, index) => ({...item, index}))
      .filter((item) => item.column === columnName)
      .map((item) => (
        <MovableItem
          key={item.id}
          item={item}
          setItems={setItems}
          moveCardHandler={moveCardHandler}
          index={item.index}
        />
      ))
  }
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main>
        <HStack px={8} py={16} spacing={8}>
          <DndProvider backend={HTML5Backend}>
            <Column title="Column 1">
              {returnItemsForColumn("Column 1")}
            </Column>
            <Column title="Column 2">
              {returnItemsForColumn("Column 2")}
            </Column>
          </DndProvider>
        </HStack>
      </main>

    </div>
  )
}

type Props = {}
export const getStaticProps: GetStaticProps<Props> = async (context) => {
  return {
    props: {},
  }
}
export default Home
