import { useState } from 'react'
import LoginGIS from './sections/QGISHeatseek/LoginGIS';



function App() {
  const [count, setCount] = useState(0)

  return (
    <main>

    <LoginGIS/>
      
    </main>
  );
}

export default App
