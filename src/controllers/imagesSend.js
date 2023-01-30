const imagesSend = (req, res) => {
  const { name } = req.params;
  res.sendFile(`${name}.png`, { root: "./src/images" });
};
module.exports = imagesSend;
