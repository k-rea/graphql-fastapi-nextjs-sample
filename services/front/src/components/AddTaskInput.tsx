import * as React from "react";
import {memo, useState} from "react";
import {Button, Input} from "@chakra-ui/react";
import {useSWRConfig} from "swr";
import {AddTaskDocument, GetAllTasksDocument, GetAllTasksQuery,} from "@/graphql/generated/graphql";
import {request} from "graphql-request";

const AddTaskInput = memo(() => {
  const {mutate} = useSWRConfig()

  const API = "http://localhost:8004/graphql";
  const [value, setValue] = useState('')

  return (
    <>
      <Input
        value={value}
        onChange={event => setValue(event.target.value)}
        onKeyPress={async (e)=> {
          if (e.key=='Enter') {
            await request<GetAllTasksQuery>(API, AddTaskDocument, {title: value, index: 1})
            mutate(GetAllTasksDocument).then(d=>d).catch(e=>console.log(e))
            setValue('')
          }
        }}
      />
    </>
  );
});
AddTaskInput.displayName = 'AddTaskInput'
export default AddTaskInput;
