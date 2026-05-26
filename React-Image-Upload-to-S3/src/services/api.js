const API_URL = import.meta.env.VITE_API_URL;

export const getImages = async () => {
  const res = await fetch(API_URL);

  const data = await res.json();

  return data;
};
