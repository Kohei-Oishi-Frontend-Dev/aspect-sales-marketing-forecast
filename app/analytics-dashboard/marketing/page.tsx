import MarketingForecast from "./MarketingForecast";

// async function makePostRequest(){
//   const res = await fetch(`${process.env.API_BASE_URL}/api/todos`,{
//     method: "POST",
//     headers : {
//       "Content-Type" : "application/json",
//     },
//     body: JSON.stringify({name : "test"})
//   })
//   return res.json();
// }

export default async function MarketingPage() {
    // const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    // const todos = await response.json();
  return (
    <>
      <MarketingForecast />
      {/* <div className="mt-6">
        <ul className="space-y-2">
          {todos.map(
            (todo: { id: number; title: string; completed: boolean }) => (
              <li
                key={todo.id}
                className="p-3 border rounded flex justify-between items-center"
              >
                <span className="text-sm">{todo.title}</span>
                <span
                  className={`text-xs font-medium ${
                    todo.completed ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {todo.completed ? "Completed" : "Pending"}
                </span>
                <Link
                  href={`/analytics-dashboard/marketing/${todo.id}`}
                  className="text-xs text-blue-600 hover:underline ml-4"
                >
                  View
                </Link>
              </li>
            )
          )}
        </ul>
      </div> */}
    </>
  );
}
