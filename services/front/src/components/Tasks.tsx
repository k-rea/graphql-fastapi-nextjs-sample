import * as React from 'react';
import {memo, Suspense} from "react";
import {request} from 'graphql-request'
import useSWR from 'swr'

import {GetAllTasksDocument, GetAllTasksQuery} from "@/graphql/generated/graphql";
import Task from "@/components/Task";

const API = "http://localhost:8004/graphql";

const _Tasks = () => {
  const {data, error} = useSWR<GetAllTasksQuery>(GetAllTasksDocument, query => request(API, query), {suspense: true})
  if (error) return <div>{error.message}</div>

  return (
    <>
      {data?.tasks.map(d => (<Task key={d.id} data={d}></Task>))}
    </>
  );
};

const Tasks = memo(() => (
  <Suspense fallback={<div>loading...</div>}>
    <_Tasks/>
  </Suspense>
))

Tasks.displayName = 'Tasks'
export default Tasks;

