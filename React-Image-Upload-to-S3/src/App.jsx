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
      <div
        className="bg-[#0b0c10] min-h-screen w-full  text-white flex flex-col gap-5 py-[3rem] md:py-[5rem] items-center"
        style={{
          backgroundColor: "#f8fafc",
          backgroundImage: `
    radial-gradient(
      at 0% 0%,
      rgba(96, 165, 250, 0.22) 0px,
      transparent 45%
    ),
    radial-gradient(
      at 100% 100%,
      rgba(244, 114, 182, 0.18) 0px,
      transparent 45%
    ),
    radial-gradient(
      at 100% 0%,
      rgba(168, 85, 247, 0.18) 0px,
      transparent 40%
    ),
    radial-gradient(
      at 50% 50%,
      rgba(255, 255, 255, 0.9) 0px,
      transparent 60%
    )
  `,
          backgroundAttachment: "fixed",
        }}
      >
        <h1 className="text-4xl text-black font-bold ">S3 Upload App</h1>

        <div className="card rounded-2xl md:rounded-4xl p-[1rem] md:p-[2rem] mt-4 border shadow-md bg-gray-300 h-auto md:h-auto w-[90%]  gap-5 justify-between items-center bg-white/40 backdrop-blur-2xl border border-white/50 rounded-3xl p-8 shadow-[0_8px_32px_rgba(31,38,135,0.12)] ">
          <div className="grid grid-cols-3 md:grid-cols-5 w-full h-full gap-2">
            {preview.map((item, key) => (
              <div className="card rounded-xl p-[.2rem]  shadow-dm bg-gray-300 h-full w-[100%] ">
                <img
                  src={item}
                  alt=""
                  className=" rounded-xl object-cover w-full h-24 md:h-48"
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

                setFile(
                  Array.from(selectedFile).filter(
                    (item) =>
                      item.type.startsWith("image/") &&
                      item.size < 10 * 1024 * 2024,
                  ),
                );

                const previewUrl = Array.from(selectedFile)
                  .filter((item) => item.type.startsWith("image/"))
                  .map((item) => URL.createObjectURL(item));
                setPreview(previewUrl);
              }}
              placeholder="Upload You File Here"
              className="text-black rounded-2xl mt-3"
            />

            <button
              onClick={getUploadUrl}
              disabled={loading}
              className="
    rounded-xl
    px-5 py-2.5
bg-gradient-to-r from-emerald-400 to-teal-600
    text-white
    font-semibold
    shadow-lg
    transition-all duration-300
    
  
    
    disabled:opacity-50
    disabled:cursor-not-allowed
  "
            >
              {loading ? "Uploading..." : "Choose Image..."}
            </button>

            {loading && (
              <p className="text-white font-semibold bg-gradient-to-r from-emerald-400 to-teal-500 px-4 py-2 text-center rounded-xl shadow-md">
                {progress}%
              </p>
            )}
            {loading && (
              <div className="outter h-[.5rem] bg-gray-500 w-full w-full rounded-md">
                <div
                  className="inner h-full rounded-md bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 transition-all duration-300"
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

        <div className="w-[90%] bg-gray-400 rounded-2xl md:rounded-4xl p-[1rem] md:p-[2rem] p-4 gap-5 grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 bg-white/40 backdrop-blur-2xl border border-white/50  shadow-[0_8px_32px_rgba(31,38,135,0.12)] ">
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
