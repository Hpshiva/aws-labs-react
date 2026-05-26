import React from "react";

function Skeleton() {
  return (
    <div className="animate-pulse bg-gray-300 w-full h-fit  border border-default rounded-3xl md:rounded-3xl shadow-md">
      <div className="w-full rounded-tl-xl bg-gray-200 rounded-tr-xl md:rounded-tl-3xl md:rounded-tr-3xl  h-[14rem] sm:h-[14rem] lg:h-[18rem] "></div>
      <div className="p-4 text-center flex  flex-col gap-3">
        <h5 className="lg:text-2xl  h-[32px] bg-gray-400 rounded-md "></h5>
        <button className=" border border-gray-500 bg-gray-400 rounded-xl px-6 py-2  h-[42px]"></button>
      </div>
    </div>
  );
}

export default Skeleton;
