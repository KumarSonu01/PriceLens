const normalizeProduct = (
  specifications = {}
) => {
  const normalized = {};

  Object.entries(
    specifications
  ).forEach(
    ([key, value]) => {
      const k =
        key.toLowerCase().trim();

      if (
        k ===
          "cpu model number" ||
        k ===
          "cpu model" ||
        k ===
          "processor brand"
      ) {
        normalized.Processor =
          value;
      }

      else if (
        k ===
          "ram memory installed size" ||
        k ===
          "ram"
      ) {
        normalized.RAM =
          value;
      }

      else if (
        k ===
          "hard drive size" ||
        k ===
          "storage"
      ) {
        normalized.Storage =
          value;
      }

      else if (
        k ===
          "graphics card description" ||
        k ===
          "graphics coprocessor"
      ) {
        normalized.Graphics =
          value;
      }

      else if (
        k ===
          "screen size" ||
        k ===
          "display"
      ) {
        normalized.Display =
          value;
      }

      else if (
        k ===
          "battery average life"
      ) {
        normalized.Battery =
          value;
      }

      else if (
        k.includes("camera")
      ) {
        normalized.Camera =
          value;
      }
    }
  );

  return normalized;
};

module.exports =
  normalizeProduct;