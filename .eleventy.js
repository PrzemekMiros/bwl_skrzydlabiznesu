const fs = require("fs");
const path = require("path");
const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    extensions: "html",
    formats: ["webp", "jpeg"],
    widths: ["auto"],
    urlPath: "/assets/optimized/",
    failOnError: false
  });

  // Kopiuj pliki statyczne
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/content/interviews/img");
  eleventyConfig.addPassthroughCopy("src/content/jury/img");
  eleventyConfig.addPassthroughCopy("src/content/nominowane-osobistosci/img");
  eleventyConfig.addPassthroughCopy("src/content/nominowane-firmy/img");
  eleventyConfig.addPassthroughCopy("src/content/partners/img");
  eleventyConfig.addPassthroughCopy("src/content/media");
  eleventyConfig.addPassthroughCopy({
    "src/content/gallery/img": "assets/gallery",
    "src/content/place/img": "assets/place"
  });

  eleventyConfig.addGlobalData("galleryImages", () => {
    const galleryDir = path.join(__dirname, "src/content/gallery/img");
    const allowedExt = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

    if (!fs.existsSync(galleryDir)) {
      return [];
    }

    return fs
      .readdirSync(galleryDir, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => allowedExt.has(path.extname(name).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, "pl", { sensitivity: "base" }))
      .map((name) => ({
        src: `/assets/gallery/${encodeURIComponent(name)}`,
        alt: path.parse(name).name.replace(/[-_]+/g, " ")
      }));
  });

  eleventyConfig.addGlobalData("placeImages", () => {
    const placeDir = path.join(__dirname, "src/content/place/img");
    const allowedExt = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

    if (!fs.existsSync(placeDir)) {
      return [];
    }

    return fs
      .readdirSync(placeDir, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => allowedExt.has(path.extname(name).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, "pl", { sensitivity: "base" }))
      .map((name) => ({
        src: `/assets/place/${encodeURIComponent(name)}`,
        alt: path.parse(name).name.replace(/[-_]+/g, " ")
      }));
  });

  eleventyConfig.addGlobalData("interviewImagesBySlug", {
    default: "/content/interviews/img/Profilowe-300x300-1.jpeg",
    "bartlomiej-annusewicz-wspolzalozyciel-i-dyrektor-zarzadzajacy-lions-estate": "/content/interviews/img/Bartlomiej-Annusiewicz.jpg",
    "klasyka-ze-szczypta-nowoczesnosci": "/content/interviews/img/Jacek-Santorski_.jpg",
    "kobieta-bardzo-skuteczna": "/content/interviews/img/skuteczna.jpg",
    "kryzys-to-zagrozenie-ale-tez-szansa": "/content/interviews/img/Grzesiak1.jpg",
    "maciej-orlos-dziennikarz-prezenter-szkoleniowiec": "/content/interviews/img/MaciejOrlos.jpg",
    "michal-seider-prezes-mcm-project-mcm-fotowoltaika-tutore-music-more-dream-givers": "/content/interviews/img/Michal-Seider-1.jpg",
    "mozna-przegrac-lecz-nigdy-nie-wolno-sie-poddac": "/content/interviews/img/Pawel-Kowalewski.jpg",
    "przemyslaw-hermanki-wspolwlasciciel-spek-sp-z-o-o": "/content/interviews/img/hernanski.jpg",
    "rozbudzila-kobiecosc-w-polskich-kobietach-poznajcie-lee-m-pyc-leszczuk-czyli-swiadoma-boginie-znana-z-programu-rowni-sobie": "/content/interviews/img/Maja-Bohosiewicz_.jpeg",
    "sanplast-s-a-prezes-robert-dziak-o-pierwszym-roku-za-sterami-grupy-bedacej-liderem-na-polskim-rynku-wyposazenia-lazienek": "/content/interviews/img/Robert-Dziak.jpg",
    "tworzyc-strategie-firmy-czy-nie": "/content/interviews/img/Lukasz-Ochwat.jpg",
    "zbudowalam-najwieksza-w-polsce-firme-medyczna-beata-drzazga-prezes-betamed-s-a": "/content/interviews/img/Beata-Drzazga_.jpeg"
  });

  eleventyConfig.addGlobalData("nominatedCompanyImagesBySlug", {
    default: "/content/nominowane-firmy/img/amica.png",
    "amica-905": "/content/nominowane-firmy/img/amica.png",
    "bialy-kamien-918": "/content/nominowane-firmy/img/bialykamien.jpg",
    "fjordd-908": "/content/nominowane-firmy/img/fjordd.jpg",
    "jabra-911": "/content/nominowane-firmy/img/jabra.png",
    "revers-cosmetics-902": "/content/nominowane-firmy/img/revers.png",
    "techniprot-922": "/content/nominowane-firmy/img/techniprot.jpg",
    "villahus-915": "/content/nominowane-firmy/img/villahus.png"
  });

  // Wlasny typ wpisow: interviews
  eleventyConfig.addCollection("interviewsCollection", function(collectionApi) {
    const items = collectionApi
      .getAll()
      .filter((item) => {
        const normalized = item.inputPath.replace(/\\/g, "/");
        return normalized.includes("src/content/interviews/") && normalized.endsWith(".md");
      })
      .sort((a, b) => b.date - a.date);
    return items;
  });

  // Wlasny typ wpisow: nominowane osobistosci
  eleventyConfig.addCollection("nominatedPersonalities", function(collectionApi) {
    const items = collectionApi
      .getAll()
      .filter((item) => {
        const normalized = item.inputPath.replace(/\\/g, "/");
        return normalized.includes("src/content/nominowane-osobistosci/") && normalized.endsWith(".md");
      })
      .sort((a, b) => b.date - a.date);
    return items;
  });

  // Wlasny typ wpisow: nominowane firmy
  eleventyConfig.addCollection("nominatedCompanies", function(collectionApi) {
    const items = collectionApi
      .getAll()
      .filter((item) => {
        const normalized = item.inputPath.replace(/\\/g, "/");
        return normalized.includes("src/content/nominowane-firmy/") && normalized.endsWith(".md");
      })
      .sort((a, b) => b.date - a.date);
    return items;
  });

  // Ustawienia obserwowania plikow
  eleventyConfig.setWatchThrottleWaitTime(100);

  // Konfiguracja katalogow
  return {
    dir: {
      input: "src",
      output: "public",
      includes: "includes",
      data: "data",
      layouts: "layouts"
    },
    pathPrefix: "/",
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};
