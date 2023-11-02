import axios from "axios";

const TOKEN = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

export default axios.create({
  baseURL: "https://finnhub.io/api/v1",
  params: {
    token: TOKEN,
  },
});
