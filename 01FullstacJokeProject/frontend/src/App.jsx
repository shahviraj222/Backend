import { useEffect, useState } from 'react'
import axios from 'axios'
function App() {

  const [jokes, setJokes] = useState([{ id: "1", joke: "Viraj" }])

  useEffect(() => {
    axios.get("/api/jokes")
      .then((response) => {
        setJokes(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  return (
    <>
      <h1>Full Stack Project</h1>
      {
        jokes.map((joke) => (
          <div key={joke.id}>
            <h2>{joke.joke}</h2>
          </div>
        ))
      }
    </>
  )
}

export default App
