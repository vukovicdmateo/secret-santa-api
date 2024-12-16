const express = require("express");
const cors = require("cors");
const fs = require("fs");

function getRandomNumber(max) {
  return Math.floor(Math.random() * (max + 1));
}

const app = express();

app.use(cors());

// Parse JSON
app.use(express.json());

app.post("/submit", (req, res) => {
  const name = req.body.name;

  const data = fs.readFileSync("./names.json", "utf-8");
  const namesWithFriend = JSON.parse(data);

  const selectedObject = namesWithFriend.find(
    (item) => item.name.toLowerCase() === name.toLowerCase()
  );

  if (!selectedObject) {
    return res.json({
      error: "NOT FOUND",
    });
  }

  if (selectedObject?.friend) {
    return res.json({
      error: "COMPLETED",
    });
  }

  const allNames = namesWithFriend.map((item) => item.name);
  const alreadySelectedNames = namesWithFriend
    .filter((item) => item.friend)
    .map((item) => item.friend)
    .map((item) => item.toLowerCase());

  const leftNames = allNames.filter(
    (item) =>
      !alreadySelectedNames.includes(item.toLowerCase()) &&
      item.toLowerCase() !== name.toLowerCase()
  );

  const friendName = leftNames[getRandomNumber(leftNames.length - 1)];

  selectedObject.friend = friendName;

  fs.writeFileSync("./names.json", JSON.stringify(namesWithFriend));

  res.json({
    friend: friendName,
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
