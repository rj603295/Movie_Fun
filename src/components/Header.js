import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link, useLocation, useHistory } from 'react-router-dom'
import { getSearchData } from '../WebAPI'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { getAuth, signOut } from "firebase/auth"
import AuthContext from '../context'


const HeaderContainer = styled.div`
  align-items: center;
  height: 64px;
  background-color: white;
  width: 100%;
  padding-top: 20px;
  color: white;
  position: fixed;
  top: 0;
  z-index: 99;
  background: transparent;
  transition: top .4s ease-in-out;

`
const Brand = styled(Link)`
  display: block;
  font-size: 32px;
  font-weight: bold;
  text-decoration: none;
  color: white;
`
const NavbarList = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  color: white;
`
const Nav = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  box-sizing: border-box;
  width: 100px;
  cursor: pointer;
  color: white;
  text-decoration: none;
  ${(props) => props.$active &&
  `
    background: rgba(0, 0, 0, 0.1)
  `}
`
const Wrapper = styled.div`
  display: flex;
  max-width: 1000px;
  margin: 0 auto;
  justify-content: space-between;
  align-items: center;
`
const Search = styled.div`

  position: relative;
  width: 30%;
  input{
    display: block;
    height: 45px;
    border-radius: 30px;
    outline: none;
    padding: 10px 20px;
    position: relative;
    box-sizing: border-box;
    width: 100%;
  }
`
const SearchIcon = styled.button`
  font-size: 25px;
  position: absolute;
  right: 2%;
  top: 15%;
  background: transparent;
  border: none;
  cursor: pointer;S
`
function Header({ isHide }) {
  const location = useLocation()
  const history = useHistory()
  const [search, setSearch] = useState('')
  const { user, setUser } = useContext(AuthContext)

  const handleSearch = () => {
    getSearchData(search).then((res) => {
      history.push(`/search/movie/${search}`)
      console.log(res)
    })
  }
  const handleValueChange = (e) => {
    setSearch(e.target.value)
  }

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then((res) => {
      setUser(null)
      console.log('成功', res)
      // Sign-out successful.
    }).catch((error) => {
      console.log('失敗', error)
      // An error happened.
    });
  }
  return (
    <HeaderContainer style={{top: isHide ? '-80px' : '0px'}}>
      <Wrapper>
        <Brand to="/">Fun電影</Brand>
        <Search>
        <input placeholder="搜尋您想要的電影, 人物...." onChange={(e) => {handleValueChange(e)}}></input>
        <SearchIcon onClick={handleSearch}><FontAwesomeIcon icon={faSearch} /></SearchIcon>    
      </Search>
        <NavbarList>
          <Nav to="/about" $active={location.pathname === '/about'}>about</Nav>
          {!user && <Nav to="/login" >登入</Nav>}
          {user && <Nav to="/login" onClick={handleLogout}>登出</Nav>}
          <Nav to="/member" ><FontAwesomeIcon icon={faUserCircle} /></Nav>
        </NavbarList>
      </Wrapper> 
    </HeaderContainer>
  )
}

export default React.memo(Header, (prevProps, nextProps) => {

  if (prevProps.isHide !== nextProps.isHide) {
    return false //re-render
  }
  return true //不會 Re-render
});