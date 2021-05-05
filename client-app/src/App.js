import './App.scss';
import {BrowserRouter} from 'react-router-dom'
import {AuthContext} from './context/AuthContext'
import { useAuth } from './hooks/auth.hook'
import {useRoute} from './routes'

function App() {
  const {login, logout, token, userId} = useAuth()
  const isAuthenticated = !!token
  const routes = useRoute(true)
  return (
    <AuthContext.Provider value={{login, logout, token, userId, isAuthenticated}}>
      <BrowserRouter>
        <div>
          {routes}
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
