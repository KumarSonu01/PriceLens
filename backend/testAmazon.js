const scrapeAmazonProduct =
  require(
    "./src/scrapers/amazonScraper"
  );

(async () => {
  const data =
    await scrapeAmazonProduct(
      "https://www.amazon.in/TURMS-Repellent-Collared-Stretchable-Available/dp/B0CVNCLT97/ref=sr_1_1_sspa?sr=8-1-spons&aref=2Bx4h7qKMC&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1"
    );

  console.log(data);
})();