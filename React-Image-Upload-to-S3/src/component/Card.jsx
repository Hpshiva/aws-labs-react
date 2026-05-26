import React from "react";

function Card({ name, url, imageKey, fetchImages }) {
  const deleteImage = async () => {
    console.log(url);
    await fetch(
      `https://jfcw2te5tzny2c63y46wvo36m40iqpws.lambda-url.us-east-1.on.aws/?type=delete&key=${imageKey}`,
    );
    await fetchImages();
  };
  return (
    <div className="bg-white w-full h-fit  border border-default rounded-3xl md:rounded-3xl shadow-md">
      <img
        src={url}
        alt=""
        className="w-full rounded-tl-xl rounded-tr-xl md:rounded-tl-3xl md:rounded-tr-3xl object-cover h-[14rem] sm:h-[14rem] lg:h-[18rem]"
      />
      <div className="p-4 text-center flex  flex-col gap-3">
        <h5 className="lg:text-2xl font-semibold tracking-tight text-heading text-black">
          {name}
        </h5>
        <button
          onClick={deleteImage}
          className="hover:bg-red-500 border border-red-400 bg-red-100 rounded-xl px-6 py-2 text-red-500 hover:text-white font-bold"
        >
          {" "}
          Delete Assest{" "}
        </button>
      </div>
    </div>
  );
}

export default Card;
