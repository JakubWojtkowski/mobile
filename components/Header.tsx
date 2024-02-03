"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React from "react";
import Avatar from "react-avatar";

function Header() {
  return (
    <header>
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10">
        <Image
          src="https://1000logos.net/wp-content/uploads/2021/05/Trello-Logo-2011.png"
          width={300}
          height={100}
          alt="trello logo"
          className="w-44 md:w-56 pb-10 md:pb-0 object-contain"
        />

        <div className="">
          <form
            className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1
        md:flex-initial"
          >
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            <input
              type="text"
              name="search"
              placeholder="Search..."
              className="flex-1"
            />
            <button hidden type="submit">
              Search
            </button>
          </form>

          {/* <Avatar name="Jakub Wojtkowski" /> */}
        </div>
      </div>
    </header>
  );
}

export default Header;
