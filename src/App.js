import { useState,   useRef, useEffect } from 'react'
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import './App.css'
import './style.css'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import MovieDetailPage from './pages/MovieDetailPage'
import SearchGenrePage from './pages/SearchGenrePage'
import SearchPage from './pages/SearchPage'
import CreditPage from './pages/CreditPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MemberPage from './pages/MemberPage'
import AboutPage from './pages/AboutPage'
import config from './config';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AuthContext from './context'
import Footer from './components/Footer'

function App() {
  const [user, setUser] = useState(null)
  const [isHide, setIsHide] = useState(false)
  const [userFavorite, setUserFavorite] = useState({})
  let lastScrollY = useRef(0)
  const app = initializeApp(config);
  const db = getDatabase();

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user.auth.currentUser)
      const uid = user.uid;
    } else {
      console.log('找不到登入的人')
      // User is signed out
      // ...
    }
  });

  const handleScroll = () => {
    let st = window.scrollY //目前距離頂部位置
    if(st < lastScrollY) {
      setIsHide(false)
    }else if(st > lastScrollY) {
      setIsHide(true)
    }
    lastScrollY = st
    //console.log(lastScrollY.current.value)
  }

    window.addEventListener('scroll', () => {  
      handleScroll()
    });

    useEffect(() => {
      function getFavorite() {
        const movieRef = ref(db, 'favorite/' + user.uid)
        onValue(movieRef, (snapshot) => {
          const data = snapshot.val()
          setUserFavorite(data)
          console.log(data)
        });
      }
    
        if(user){
          getFavorite()
        }
    }, [user])
  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      userFavorite
    }}>
    <div className="App">
      <Router>
        <Header className="header" isHide={isHide}/>
          <Switch>
          <Route exact path="/">
              <HomePage />
            </Route>
            <Route exact path="/movie/:id">
              <MovieDetailPage />
            </Route>
            <Route exact path="/search/genre/:id">
              <SearchGenrePage />
            </Route>
            <Route exact path="/search/movie/:query">
              <SearchPage />
            </Route>
            <Route exact path="/credit/:id">
              <CreditPage />
            </Route>
            <Route exact path="/login">
              {!user ? <LoginPage /> : <Redirect to="/" />}      
            </Route>
            <Route exact path="/register">
              <RegisterPage />
            </Route>
            <Route exact path="/member">
              <MemberPage />
            </Route>
            <Route exact path="/about">
              <AboutPage />
            </Route>
          </Switch>
          <Footer />
      </Router>
    </div>
    </AuthContext.Provider>

    
  );
}

export default App;
