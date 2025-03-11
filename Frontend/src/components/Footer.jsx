import { Link } from 'react-router-dom'

export const Footer = () => {
  return (
    <footer className='bg-blue-950 text-white text-center p-4  w-full'>
      <div className='mb-2'>
        <Link>Home</Link>
        <Link>About</Link>
        <Link>Contact</Link>
      </div>

      <p>&copy; {new Date().getFullYear()} All Rights Reserved</p>
    </footer>
  )
}
