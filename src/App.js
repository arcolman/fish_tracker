import './App.css'
import { pb } from './pocketbase'
import { useState, useEffect } from 'react'

function App() {

  const [records, setRecords] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({ first: '', last: '' })

  // async function getCollection(collection) {
  //   try {
  //     const list = await pb.collection(collection).getFullList({
  //       sort: '-created',
  //     })
  //     return list
  //   } catch (error) {
  //     console.error('Error fetching data:', error)
  //     return []
  //   }
  // }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const list = await pb.collection("name").getFullList({
          sort: '-created',
        })
        setRecords(list)
        setIsLoading(false)
        return list
      } catch (error) {
        console.error('Error fetching data:', error)
        setIsLoading(true)
        return []
      }
    }
    fetchData()
  }, [])

  async function submit(data) {
    const pbData = { first_name: data.first, last_name: data.last }
    console.log(data)
    await pb.collection("name").create(pbData)
    setFormData({ first: '', last: '' })
  }

  return (
    <>
      <h1>Logged In: {pb.authStore.isValid.toString()}</h1>
      <button onClick={() => window.location.reload(false)}>Click to reload!</button>
      <form onSubmit={submit}>
        <input
          type="text"
          label="First Name"
          placeholder="John"
          id="firstName"
          name="first"
        />
        <input
          type="text"
          label="Last Name"
          placeholder="Doe"
          id="lastName"
          name="last"
        />
        <button type="submit">Submit</button>
      </form>
      <ul>
        {
          isLoading ? <h1>Loading...</h1> : <h1>Loaded</h1>
        }
        {records ? (
          records.map((record) => (
            <li key={record.id}>
              {record.first_name} {record.last_name}
            </li>
          ))
        )
          :
          (
            <p>Loading records...</p>
          )
        }
      </ul>
    </>
  );
}

export default App;
