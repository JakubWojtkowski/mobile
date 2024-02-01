import Image from "next/image";
import React from "react";

function Header() {
  return (
    <header>
      <Image
        src="https://logos-world.net/wp-content/uploads/2021/02/Trello-Emblem.png"
        width={300}
        height={100}
        alt="trello logo"
      />
    </header>
  );
}

export default Header;
