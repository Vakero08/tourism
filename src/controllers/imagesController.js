const axios = require("axios");
const cheerio = require("cheerio");
const downloadImage = require("./Apiutils");

const links = [
  `https://cayambeturismo.gob.ec/kayambi-nan`,
  `https://cayambeturismo.gob.ec/hospedaje`,
  "https://cayambeturismo.gob.ec/gastronomia",
];

const imagesController = async (req, res) => {
  console.log("Init Process");
  const data = getData(req, res);
};

const getData = async (req, res) => {
  const arrayData = [];
  const response = await getRequests();
  console.log(response);
  if (response?.length) {
    response.forEach((data, ind) => {
      const $ = cheerio.load(data);
      const sectionsDom = $(".elementor-cta");
      for (let index = 0; index < sectionsDom.length; index++) {
        let obj = {
          name: getParameter($, ".elementor-cta__title", index),
          description: getParameter($, ".elementor-cta__description", index),
          category: getCategory(links[ind], index),
          link: getLink($, ".elementor-cta__button-wrapper", index),
          image: getImage($, ".elementor-cta__bg", index, getParameter($, ".elementor-cta__title", index)),
          alt: "",
        };
        arrayData.push(obj);
      }
    });
    console.log(arrayData);
    res.status(200).send(JSON.stringify(arrayData));
  } else {
    res.status(403).send(JSON.stringify([]));
  }
};

const getRequests = async params => {
  const arrayRequest = [];
  const response = [];
  try {
    links.forEach((url, index) => {
      const req = axios.get(url);
      arrayRequest.push(req);
    });
    const resp = await Promise.allSettled(arrayRequest);
    resp.map(({ status, value }) => {
      if (status !== "fulfilled") response.push([]);
      if (status === "fulfilled") response.push(value.data);
    });
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};
const getCategory = (url, index) => {
  switch (url) {
    case `https://cayambeturismo.gob.ec/kayambi-nan`:
      if (index === 0) {
        return ["Senderismo", "Sitios turísticos"];
      }
      if (index === 1) {
        return ["Senderismo", "Cascadas", "Sitios turísticos"];
      }
      if (index === 2) {
        return ["Monumentos", "Senderismo", "Sitios turísticos"];
      }
      if (index === 3) {
        return ["Sitios turísticos"];
      }
      if (index === 4) {
        return ["Sitios turísticos", "Senderismo"];
      }
    case `https://cayambeturismo.gob.ec/hospedaje`:
      return ["Hospedaje", "Sitios turísticos"];
    case `https://cayambeturismo.gob.ec/gastronomia`:
      return ["Gastronomía", "Sitios turísticos"];
    default:
      return ["niguna"];
  }
};

const getParameter = ($, path, index) => {
  const paramenterDom = $(`.elementor-cta ${path}`);
  if (paramenterDom[index]) {
    const parameter = paramenterDom[index].children[0].data.trim();
    return parameter;
  } else {
    return "Ninguna";
  }
};
const getImage = ($, path, index, name) => {
  const paramenterDom = $(`.elementor-cta ${path}`);
  const img = paramenterDom[index].attribs.style;
  const parseimg = img.split("url")[1].replaceAll(/[();]/g, "");
  let nameParse = name.replaceAll(" ", "_").toLowerCase();
  downloadImage(parseimg, `./src/images/${nameParse}.png`);
  return "parseimg";
};
const getLink = ($, path, index) => {
  const paramenterDom = $(`.elementor-cta ${path}`);
  const href = paramenterDom[index].children[1].attribs.href;

  return href || null;
};

module.exports = imagesController;
