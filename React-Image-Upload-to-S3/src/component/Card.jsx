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
    <div className="bg-gray-500 w-full h-fit  border border-default rounded-md shadow-xs">
      <img
        src={url}
        alt=""
        className="w-full rounded-md object-cover h-[10rem] sm:h-[14rem] lg:h-[18rem]"
      />
      <div className="p-4 text-center flex  flex-col gap-5">
        <h5 className="lg:text-2xl font-semibold tracking-tight text-heading">
          {name}
        </h5>
        <button
          onClick={deleteImage}
          className="bg-red-500 rounded-full px-6 py-2"
        >
          {" "}
          Delete{" "}
        </button>
      </div>
    </div>
  );
}

export default Card;
