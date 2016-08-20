import './App.css';

import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import _ from 'lodash';

class App extends Component {
  constructor() {
    super();

    this.handleCreateTodo = this.handleCreateTodo.bind(this);
  }
  handleCreateTodo(event) {
    event.preventDefault();

    const { submit } = this.props;

    // input
    const id = Math.floor((Math.random() * 5555) + 1);
    const target = event.target;
    const task = target.todoTask.value;

    // make mutation and refetch data
    return submit(id, task).then(() => {

      // clear text field
      target.todoTask.value = '';
    });

  }
  render() {
    // data prop
    const { todos } = this.props.data;

    return (
      <div className="App">
      <h1>Todo App</h1>
      <form onSubmit={this.handleCreateTodo}>
              <input type="text" name="todoTask" placeholder="Enter task" />
      </form>
        <ul>
          {
            _.map(todos, (todo) => {
              return (
                <li key={todo.id}>{todo.task}</li>
              )
            })
          }
        </ul>
      </div>
    );
  }
}

const GET_TODO = gql`
  query getTodos {
    todos {
      id
      task
      completed
    }
  }
`;

const TODO_MUTATION = gql`
  mutation createTodo($id: Int!, $todoTask: String!) {
    createTodo(id: $id, task: $todoTask) {
      id
    }
  }
`;

const TodowithData = graphql(GET_TODO, {
  options: () => ({ pollInterval: 1000 }),
})(App);

const TodoWithDataAndMutations = graphql(TODO_MUTATION, {
  props({ mutate }) {
    return {
      submit(id, todoTask) {
        return mutate({ variables: { id, todoTask } });
      }
    };
  },
})(TodowithData);

// export component
export default TodoWithDataAndMutations;
