import { useEffect, useState } from "react";
import "./index.css";
import Card from "./component/Card";
import axios from "axios";
import { getImages } from "./services/api";

function App() {
  const [file, setFile] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imgSuccess, SetImgsuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState([]);

  //useEffect here to load images on every render/reload of the page
  // as before it's not getting load the images after upload only load the images
  // Fetch Images
  const fetchImages = async () => {
    const imagesData = await getImages();
    setImages(imagesData);
  };

  const getUploadUrl = async () => {
    if (file.length === 0) return;
    setLoading(true);

    const totalSize = file.reduce((accmuator, item) => {
      return accmuator + item.size;
    }, 0);
    let uploadedBytes = 0;
    try {
      const uploads = file.map(async (item) => {
        // Step 1: Get signed URL
        let previousLoaded = 0;
        const res = await fetch(
          "https://jfcw2te5tzny2c63y46wvo36m40iqpws.lambda-url.us-east-1.on.aws/?type=upload",
        );
        const data = await res.json();
        console.log(data);
        // console.log("Item size -", item.size);

        // Step 2: Upload file

        return await axios.put(data.uploadUrl, item, {
          headers: {
            "Content-Type": item.type,
          },
          onUploadProgress: (event) => {
            const difference = event.loaded - previousLoaded;
            uploadedBytes = uploadedBytes + difference;
            previousLoaded = event.loaded;
            const percentage = Math.round((uploadedBytes / totalSize) * 100);
            setProgress(percentage);
            // console.log("Uploaded %",
            //  percentage);
          },
        });
      });

      await Promise.all(uploads);
    } catch (error) {
      console.log(error);
    } finally {
      setFile([]);
    }

    // Step 2: Upload image to S3
    // await fetch(data.uploadUrl, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": file.type,
    //   },
    //   body: file,
    // });

    SetImgsuccess(true);
    setTimeout(() => {
      SetImgsuccess(false);
    }, 3000);

    setLoading(false);
    setPreview([]);

    setProgress(0);

    await fetchImages();
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <>
      <div className="min-h-screen w-full bg-gray-600 text-white flex flex-col gap-5  py-[5rem] items-center">
        <h1 className="text-4xl">S3 Upload App</h1>

        <div className="card rounded-md p-[2rem] border shadow-dm bg-gray-300 h-auto md:h-auto w-[90%]  gap-5 justify-between items-center ">
          <div className="grid grid-cols-5 w-full h-full gap-2">
            {preview.map((item, key) => (
              <div className="card rounded-md p-[.3rem]  shadow-dm bg-gray-500 h-full w-[100%] ">
                <img
                  src={item}
                  alt=""
                  className=" rounded-md object-cover w-full h-48"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <input
              multiple
              type="file"
              onChange={(event) => {
                const selectedFile = event.target.files;

                setFile(Array.from(selectedFile));

                const previewUrl = Array.from(selectedFile).map((item) =>
                  URL.createObjectURL(item),
                );

                setPreview(previewUrl);
              }}
              placeholder="Upload You File Here"
              className="text-black"
            />

            <button
              onClick={getUploadUrl}
              disabled={loading}
              className="rounded-md px-4 py-2 border shadow-dm bg-green-300 text-black disabled:bg-gray-300"
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
              <p className=" text-green-900 font-bold bg-green-300 px-4 py-2 rounded-md">
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
