import React from "react";

function Card({ name, url }) {
  return (
    <div className="bg-gray-500 w-full h-fit  border border-default rounded-md shadow-xs">
      <img
        src={url}
        alt=""
        className="w-full rounded-md object-cover h-[10rem] sm:h-[14rem] lg:h-[18rem]"
      />
      <div className="p-3 text-center">
        <h5 className="my-4 lg:text-2xl font-semibold tracking-tight text-heading">
          {name}
        </h5>
      </div>
    </div>
  );
}

export default Card;
