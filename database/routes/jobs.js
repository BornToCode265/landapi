const axios = require("axios");

const options = {
  method: "GET",
  url: "https://jsearch.p.rapidapi.com/search",
  params: {
    query: "remote",
    page: "1",
    num_pages: "1",
    date_posted: "all",
  },
  headers: {
    "x-rapidapi-key": "91d7f879b6msh51606d2d2873ca9p111853jsnada8fd6e5672",
    "x-rapidapi-host": "jsearch.p.rapidapi.com",
  },
};
const fetchJobs = async () => {
  try {
    const response = await axios.request(options);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
fetchJobs();
