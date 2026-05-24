import { useEffect, useState } from "react";
import "./index.css";
import Card from "./component/Card";
import axios from "axios";

function App() {
  const [file, setFile] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imgSuccess, SetImgsuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState("");

  //useEffect here to load images on every render/reload of the page
  // as before it's not getting load the images after upload only load the images
  const fetchImages = async () => {
    const imagesRes = await fetch(
      "https://jfcw2te5tzny2c63y46wvo36m40iqpws.lambda-url.us-east-1.on.aws/",
    );
    const imagesData = await imagesRes.json();
    setImages(imagesData);
    // console.log(imagesData);
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

    await axios.put(data.uploadUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
      onUploadProgress: (event) => {
        const percentage = Math.round((event.loaded / event.total) * 100);
        setProgress(percentage);
        // console.log(percentage);
      },
    });

    // Step 2: Upload image to S3
    // await fetch(data.uploadUrl, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": file.type,
    //   },
    //   body: file,
    // });

    SetImgsuccess(true);
    setLoading(false);

    await fetchImages();
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <>
      <div className="h-full w-full bg-gray-600 text-white flex flex-col gap-5  py-[5rem] items-center">
        <h1 className="text-4xl">S3 Upload App</h1>

        <div className="card rounded-md p-[2rem] border shadow-dm bg-gray-300 h-auto md:h-[20rem] w-[60%] md:flex gap-5 justify-between items-center ">
          <div className="card rounded-md p-[1rem] shadow-dm bg-gray-500 h-[14rem] md:h-full w-[100%] ">
            <img
              src={preview}
              alt=""
              className="h-full rounded-md object-cover w-full"
            />
          </div>
          <div className="flex flex-col gap-4">
            <input
              multiple
              type="file"
              onChange={(event) => {
                console.log(event);
                console.log(event.target.files);

                setFile(event.target.files);
                console.log("file",file);
                const selectedFile = event.target.files;
                // console.log(URL.createObjectURL(selectedFile));
                const previewUrl = [];
                for (let i = 0; i <= selectedFile.length; i++) {
                  previewUrl[i] = URL.createObjectURL(selectedFile[i]);
                }

                setPreview(previewUrl);
              }}
              placeholder="Upload You File Here"
              className="text-black"
            />

            <button
              onClick={getUploadUrl}
              disabled={loading}
              className="rounded-md px-4 py-2 border shadow-dm bg-green-300 text-black"
            >
              {loading ? "Uploading..." : "Choose Image..."}
            </button>

            {loading && (
              <p className=" text-green-900 font-bold bg-yellow-300 px-4 py-2 text-center rounded-md">
                {progress}%
              </p>
            )}
            {loading && (
              <div className="outter h-[1rem] bg-gray-500 w-full md:w-[26rem] rounded-md">
                <div
                  className="inner h-[100%] rounded-md bg-green-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}

            {imgSuccess && (
              <p
                id="text-status"
                className=" text-green-900 font-bold bg-green-300 px-4 py-2 rounded-md"
              >
                Image Uploaded Successfully
              </p>
            )}
          </div>
        </div>

        <p>{file?.name}</p>

        <div className="w-[90%] bg-gray-400 rounded-md p-4 gap-5 grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
          {images.map((items) => {
            return (
              <Card
                key={items.key}
                name={items.key}
                url={items.url}
                imageKey={items.key}
                fetchImages={fetchImages}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

export default App;
