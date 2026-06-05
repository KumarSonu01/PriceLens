const normalizeProduct = (
  specifications = {}
) => {
  const normalized = {};

  Object.entries(
    specifications
  ).forEach(
    ([key, value]) => {
      const k =
        key
          .toLowerCase()
          .trim();

      const v =
        String(value).trim();

      /* Processor */

      if (
        k.includes(
          "processor"
        ) ||
        k.includes("cpu") ||
        k.includes(
          "chipset"
        )
      ) {
        if (
          !normalized.Processor
        ) {
          normalized.Processor =
            v;
        }
      }

      /* RAM */

      else if (
        k ===
          "ram memory installed size" ||
        k === "ram" ||
        k.includes(
          "ram"
        )
      ) {
        normalized.RAM =
          v;
      }

      /* Storage */

      else if (
        k ===
          "memory storage capacity" ||
        k ===
          "hard drive size" ||
        k ===
          "storage" ||
        k === "rom" ||
        k.includes(
          "storage"
        ) ||
        k.includes(
          "hard drive"
        ) ||
        k.includes(
          "ssd"
        )
      ) {
        normalized.Storage =
          v;
      }

      /* Display */

      else if (
        k ===
          "screen size" ||
        k.includes(
          "display"
        )
      ) {
        if (
          !normalized.Display
        ) {
          normalized.Display =
            v;
        }
      }

      /* Battery */

      else if (
        k ===
          "battery capacity" ||
        k ===
          "battery average life" ||
        k ===
          "battery power rating" ||
        k.includes(
          "battery"
        )
      ) {
        normalized.Battery =
          v;
      }

      /* Camera */

      else if (
        k.includes(
          "rear camera"
        ) ||
        k.includes(
          "front camera"
        )
      ) {
        if (
          !normalized.Camera &&
          value !== "1"
        ) {
          normalized.Camera =
            value;
        }
      }

      /* Graphics */

      else if (
        k.includes(
          "graphics"
        ) ||
        k.includes(
          "gpu"
        )
      ) {
        normalized.Graphics =
          v;
      }

      /* OS */

      else if (
        k ===
          "operating system" ||
        k === "os"
      ) {
        normalized.OS =
          v;
      }

      /* Color */

      else if (
        k === "colour" ||
        k === "color"
      ) {
        normalized.Color =
          v;
      }

      /* Connectivity */

      else if (
        k.includes(
          "connectivity"
        ) ||
        k.includes(
          "network"
        ) ||
        k.includes(
          "wifi"
        ) ||
        k.includes(
          "bluetooth"
        )
      ) {
        normalized.Connectivity =
          v;
      }
    }
  );

  /* Cleanup */

  if (
    normalized.Battery &&
    /^\d+$/.test(
      normalized.Battery
    )
  ) {
    normalized.Battery =
      `${normalized.Battery} mAh`;
  }

  if (
    normalized.Color
  ) {
    normalized.Color =
      normalized.Color
        .charAt(0)
        .toUpperCase() +
      normalized.Color.slice(
        1
      );
  }

  return normalized;
};

module.exports =
  normalizeProduct;