import { Link } from '@remix-run/react'
import { useOptionalUser } from '~/utils';

export default function Index() {
  const user = useOptionalUser();
  return (
    <div className="mx-auto px-4 sm:px-6 flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10 ">
    <div className="flex space-x-10">
      <Link 
        to="/"
        className="text-base font-medium text-gray-500 hover:text-gray-900"
      >
        Tables
      </Link>
      {user ? <Link 
        to="/notes"
        className="text-base font-medium text-gray-500 hover:text-gray-900"
      >
        Orders
      </Link> : null}
    </div>
    {user ? null : <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
      <Link to="/login" className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
        Sign in
      </Link>
      <Link
        to="/join"
        className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Sign up
      </Link>
    </div>}
  </div>
  )
}
