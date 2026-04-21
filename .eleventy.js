const fs = require("fs");
const path = require("path");

module.exports = function(eleventyConfig) {
  // Kopiuj pliki statyczne
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/content/interviews/img");
  eleventyConfig.addPassthroughCopy("src/content/jury/img");
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


