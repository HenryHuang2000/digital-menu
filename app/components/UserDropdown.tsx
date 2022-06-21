import { Link } from "@remix-run/react";
import { useState } from "react";
import { useOptionalUser } from "~/utils";

/**
 * This component renders the user avatar with a dropdown menu.
 */
export function UserDropdown() {
  const user = useOptionalUser();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen((isOpen) => !isOpen)} className="block">
        <div className="relative w-10 h-10 overflow-hidden bg-gray-500 rounded-full ">
          <svg className="absolute w-12 h-12 text-gray-100 -left-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
        </div>
      </button>

      {isOpen &&
        <>
          {/* Overlay to detect outside clicks  */}
          <button 
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 h-full w-full cursor-default" 
          />
          <div className="absolute right-0 w-48 py-2 mt-2 bg-white border rounded-lg shadow-lg">
            {user ? 
              (
                <Link onClick={() => setIsOpen(false)} to="/logout" className="block px-4 py-2 hover:bg-gray-100">
                  Sign out
                </Link>
              ) :
              (
                <>
                  <Link onClick={() => setIsOpen(false)} to="/join" className="block px-4 py-2 hover:bg-gray-100">
                    Sign up
                  </Link>
                  <Link onClick={() => setIsOpen(false)} to="/login" className="block px-4 py-2 hover:bg-gray-100">
                    Log in
                  </Link>
                </>
              )
            }
          </div>
        </>
      }
    </div>
  )
};