import React from 'react'
import Header from "../Layout/Header/Header"
import SearchBar from "../Search/Search"
import Footer from "../Layout/Footer/Footer"
import Bilgi from "../FAQ/Bilgi"
import Comments from "../Comments/Comments"
import MainLayout from '../../layouts/MainLayout'
const HomePage = () => {
  return (
    <React.Fragment>

     <SearchBar/>
<Bilgi/>
<Comments/>

    </React.Fragment>
  )
}

export default HomePage