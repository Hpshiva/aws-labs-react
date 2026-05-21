import { useEffect, useState } from "react";
import "./index.css";
import Card from "./component/Card";

function App() {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imgSuccess, SetImgsuccess] = useState(false);

  //useEffect here to load images on every render/reload of the page
  // as before it's not getting load the images after upload only load the images
  const fetchImages = async () => {
    const imagesRes = await fetch(
      "https://jfcw2te5tzny2c63y46wvo36m40iqpws.lambda-url.us-east-1.on.aws/",
    );
    const imagesData = await imagesRes.json();
    setImages(imagesData);
    console.log(imagesData);
  };
  const getUploadUrl = async () => {
    if (!file) return;
    setLoading(true);
    // Step 1: Get signed URL
    const res = await fetch(
      "https://jfcw2te5tzny2c63y46wvo36m40iqpws.lambda-url.us-east-1.on.aws/?type=upload",
    );
    const data = await res.json();
    console.log(data);

    // Step 2: Upload image to S3
    await fetch(data.uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    SetImgsuccess(true);
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <>
      <div className="h-full w-full bg-gray-600 text-white flex flex-col gap-5  py-[5rem] items-center">
        <h1 className="text-4xl">S3 Upload App</h1>

        <div className="card rounded-md p-[3rem] border shadow-dm bg-gray-300 h-[5rem] w-fit flex justify-center items-center ">
          <input
            type="file"
            onChange={(event) => {
              console.log(event);
              setFile(event.target.files[0]);
            }}
            placeholder="Upload You File Here"
            className="text-black"
          />
        </div>

        <button
          onClick={getUploadUrl}
          disabled={loading}
          className="rounded-md px-4 py-2 border shadow-dm bg-green-300 text-black"
        >
          {loading ? "Uploading..." : "Upload Image.."}
        </button>
        {imgSuccess && (
          <p
            id="text-status"
            className=" text-green-900 font-bold bg-green-300 px-4 py-2 rounded-md"
          >
            Image Uploaded Successfully
          </p>
        )}

        <p>{file?.name}</p>

        <div className="w-[90%] bg-gray-400 rounded-md p-4 gap-5 grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
          {images.map((items) => {
            return <Card name={items.key} url={items.url} />;
          })}
        </div>
      </div>
    </>
  );
}

export default App;
