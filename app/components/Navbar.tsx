"use client";
import { User } from "@prisma/client";
import { Squash as Hamburger } from "hamburger-react";
import { useState } from "react";

import Link from "next/link";

interface navbarPros {
  currentUser?: User | null;
}

const Navbar: React.FC<navbarPros> = ({ currentUser }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="bg-gray-900 text-white py-4 px-6">
      <div className="mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">TradeIt</div>
        <div className="relative">
          <div
            className="rounded-full bg-gray-800 px-4 py-2 flex items-center cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {currentUser ? currentUser.name : "Login"}
            <Hamburger
              toggled={dropdownOpen}
              toggle={setDropdownOpen}
              size={20}
            />
          </div>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-900 text-white rounded shadow-xl">
              {currentUser ? (
                <>
                  <Link
                    href="/logout"
                    className="block px-4 py-2 hover:bg-gray-800"
                  >
                    Logout
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-800"
                  >
                    Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-4 py-2 hover:bg-gray-800"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="block px-4 py-2 hover:bg-gray-800"
                  >
                    Signup
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
