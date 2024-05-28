import React from 'react'
import {BrowserRouter , Routes ,Route} from 'react-router-dom'
import Home from './assets/pages/Home'
import Signin from './assets/pages/Signin'
import Signup from './assets/pages/Signup'
import Profile from './assets/pages/Profile'
import About from './assets/pages/About'
import Header from './components/Header'
import {PrivateRoute} from './components/PrivateRoute'
import CreateListing from './assets/pages/CreateListing'
import UpdateListing from './assets/pages/UpdateListing'
import Listing from './assets/pages/Listing'
import SearchPage from './assets/pages/SearchPage'

export default function App() {
  return (
    <BrowserRouter>
      <Header/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/sign-in' element={<Signin/>}/>
      <Route path='/sign-up' element={<Signup/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/search' element={<SearchPage/>}/>
      <Route path='/listing/:listingId' element={<Listing/>}/>
      <Route element={<PrivateRoute/>}>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/create-listing' element={<CreateListing/>}/>
        <Route path='/update-listing/:listingId' element={<UpdateListing/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
  ) 
}
