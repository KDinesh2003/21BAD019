const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;
const windowSize = 10;

const accessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE5ODk1NzY1LCJpYXQiOjE3MTk4OTU0NjUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6Ijg3NzYwNzYxLTg5MmEtNDU3Ni05YzkwLTFlYzFmYWM5MDFhYyIsInN1YiI6ImRpbmVzaC4yMWFkQGtjdC5hYy5pbiJ9LCJjb21wYW55TmFtZSI6ImdlbmVzaXMiLCJjbGllbnRJRCI6Ijg3NzYwNzYxLTg5MmEtNDU3Ni05YzkwLTFlYzFmYWM5MDFhYyIsImNsaWVudFNlY3JldCI6IlRjV0tvWUNSaGpaRU9TZFIiLCJvd25lck5hbWUiOiJEaW5lc2giLCJvd25lckVtYWlsIjoiZGluZXNoLjIxYWRAa2N0LmFjLmluIiwicm9sbE5vIjoiMjFCQUQwMTkifQ.FJRfAmwls4AYb4NNv8G0VKx9M7zIirMVPfCzZd0dkx0";
//Cannot fetch data from api because invalid authorization token
const axiosInstance = axios.create({
  baseURL: "http://20.244.56.144/test/",
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

async function fetchNumbers(numberid) {
  try {
    let response;
    let numbers;

    switch (numberid) {
      case "p":
        response = await axiosInstance.get("/primes");
        numbers = response.data;
        break;
      case "f":
        response = await axiosInstance.get("/fibo");
        numbers = response.data;
        break;
      case "e":
        response = await axiosInstance.get("/even");
        numbers = response.data;
        break;
      case "r":
        response = await axiosInstance.get("/rand");
        numbers = response.data;
        break;
    }

    numbers = [...new Set(numbers)];

    if (numbers.length > windowSize) {
      numbers = numbers.slice(-windowSize);
    }

    numberWindows[numberid] = numbers;

    return numbers;
  } catch (error) {
    console.error("Error fetching numbers:", error);
    return [];
  }
}

app.get("/numbers/:numberid", async (req, res) => {
  const { numberid } = req.params;

  if (!["p", "f", "e", "r"].includes(numberid)) {
    return res.status(400).json({ error: "Invalid numberid" });
  }

  let numbers = numberWindows[numberid];

  if (numbers.length === 0) {
    numbers = await fetchNumbers(numberid);
  }

  const average = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;

  res.json({
    numberid,
    numbers,
    average,
  });
});

app.listen(port, () => {
  console.log(
    `Average calculator microservice listening at http://localhost:${port}`
  );
});
