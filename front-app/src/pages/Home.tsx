import { Link } from 'react-router-dom'
import { useSession } from '@/context/SessionContext'
import '../App.css'

function Home() {
  const { session } = useSession()

  return (
    <section id="center">
      <div>
        <h1>Bienvenue sur MyApp</h1>
        {session?.userId ? (
          <p>Connecté en tant que <strong>{session.userId}</strong></p>
        ) : (
          <p>
            <Link to="/login">Connectez-vous</Link> pour accéder à votre espace.
          </p>
        )}
      </div>
    </section>
  )
}

export default Home
