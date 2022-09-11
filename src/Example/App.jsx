import { useState } from "react";
import { useQuery } from "../Core";

const fetchTodos = (count = 1) =>
  fetch(`https://jsonplaceholder.typicode.com/todos?_limit=${count}`)
    .then((res) => res.json())
    .then((data) => data);

function App() {
  const { data: todos = [], isFetching } = useQuery(
    "todos",
    () => fetchTodos(10),
    // {
    //   cacheTime: 1000,
    //   staleTime: 5000,
    // }
  );
  return (
    <div className="App">
      <h1>Todos</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
      {isFetching && <p>Loading...</p>}
    </div>
  );
}

export default App;
