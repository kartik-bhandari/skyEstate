import {useState, useEffect } from 'react'
import {FaSearch} from 'react-icons/fa'
import {Link, useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux'

function Header() {
  const {currentUser} = useSelector(state => state.user)
  const [searchTerm , setSearchTerm] = useState('')
  const navigate = useNavigate()
  // console.log(currentUser)

  const handleSubmit = (e) =>{
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('searchTerm' , searchTerm);
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get('searchTerm')
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl);
    }
  },[location.search]);

  return (
    <header className='bg-[#181818] fixed z-20 w-full shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to="/">
        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-200'>sky</span>
            <span className='text-slate-600'>Estate</span>
        </h1>
        </Link>
        <form onSubmit={handleSubmit} className='bg-slate-100 p-3 flex items-center rounded-full'>
            <input type="text" placeholder='Search...' className='bg-transparent text-[0.6rem] mx-auto sm:text-sm focus:outline-none w-26 h-2 sm:w-80 sm:h-5' onChange={(e)=>setSearchTerm(e.target.value)}/>
            <button>
            <FaSearch className='text-slate-500'/>
            </button>
            </form>
            <ul className='flex sm:gap-4 gap-0 items-center m-1'>
              <Link to="/">
              <li className='hidden sm:text-md sm:inline text-white hover:opacity-90'>Home</li>
              </Link>
              <Link to="/profile">
              {currentUser ? (<img className='rounded-full h-9 w-9 hover:opacity-90 object-cover' src={currentUser.avatar} alt="profile"/>) :
              <li className='text-white text-[0.7rem] sm:text-[1rem] hover:opacity-90'>Sign In</li>}
              </Link>
            </ul>
        
      </div>
    </header>
  )
}

export default Header