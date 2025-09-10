export default async function TodoPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
    const todo = await response.json();
    return (
        <div>
            <h1>Todo Details</h1>
            <p>Todo ID: {id}</p>
            <p>Todo Title: {todo.title}</p>
            <p>Todo Completed: {todo.completed ? "Yes" : "No"}</p>
        </div>
    );
}
