import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Mutation = {
  __typename?: 'Mutation';
  addTask: TaskType;
};


export type MutationAddTaskArgs = {
  task: TaskInput;
};

export type Query = {
  __typename?: 'Query';
  task: TaskType;
  tasks: Array<TaskType>;
};


export type QueryTaskArgs = {
  taskId: Scalars['Int'];
};


export type QueryTasksArgs = {
  task?: InputMaybe<TaskQuery>;
};

export enum Status {
  Correspondence = 'correspondence',
  Done = 'done',
  NotStarted = 'not_started'
}

export type TaskInput = {
  index: Scalars['Int'];
  isArchive?: InputMaybe<Scalars['Boolean']>;
  status?: InputMaybe<Status>;
  title: Scalars['String'];
};

export type TaskQuery = {
  id?: InputMaybe<Scalars['Int']>;
  isArchive?: InputMaybe<Scalars['Boolean']>;
  status?: InputMaybe<Status>;
  title?: InputMaybe<Scalars['String']>;
};

export type TaskType = {
  __typename?: 'TaskType';
  id: Scalars['Int'];
  index: Scalars['Int'];
  isArchive: Scalars['Boolean'];
  status: Status;
  title: Scalars['String'];
};

export type GetAllTasksQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllTasksQuery = { __typename?: 'Query', tasks: Array<{ __typename?: 'TaskType', id: number, index: number, isArchive: boolean, status: Status, title: string }> };

export type AddTaskMutationVariables = Exact<{
  title: Scalars['String'];
  index: Scalars['Int'];
}>;


export type AddTaskMutation = { __typename?: 'Mutation', addTask: { __typename?: 'TaskType', id: number, index: number, isArchive: boolean, status: Status, title: string } };


export const GetAllTasksDocument = gql`
    query getAllTasks {
  tasks {
    id
    index
    isArchive
    status
    title
  }
}
    `;
export const AddTaskDocument = gql`
    mutation addTask($title: String!, $index: Int!) {
  addTask(task: {title: $title, index: $index}) {
    id
    index
    isArchive
    status
    title
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getAllTasks(variables?: GetAllTasksQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetAllTasksQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAllTasksQuery>(GetAllTasksDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getAllTasks', 'query');
    },
    addTask(variables: AddTaskMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddTaskMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddTaskMutation>(AddTaskDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'addTask', 'mutation');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;