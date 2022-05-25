import {memo} from "react";
import {TaskType} from "@/graphql/generated/graphql";
import {Box} from "@chakra-ui/react";
import {useDrag} from 'react-dnd';

type PropTypes = {
  data: TaskType
};
export type DropResult = {
  colNumber: number;
};

const Task = memo(({data}: PropTypes) => {
  const [collected, drag] = useDrag({
    type: data.title,
    end: (_, monitor) => {
      const dropResult = monitor.getDropResult() as DropResult
      if (dropResult) {
        console.log(dropResult.colNumber)
      }
    },
    collect: (monitor) => {
      return {dragging: monitor.isDragging()}
    }
  });
  const { dragging } = collected;


  return (
    <Box ref={drag}>
        {data.title}
    </Box>
  );
});
Task.displayName = 'Task'
export default Task;
