import { Link } from "react-router-dom";

import {
  useCompare,
} from "../../features/compare/CompareContext";

const CompareBar = () => {
  const {
    compareItems,
  } = useCompare();

  if (
    compareItems.length < 2
  ) {
    return null;
  }

  const ids =
    compareItems
      .map(
        (item) =>
          item._id
      )
      .join(",");

  return (
    <div className="fixed bottom-5 right-5 bg-white shadow-xl border rounded-xl p-4 z-50">
      <p className="font-bold mb-2">
        {compareItems.length} Products Selected
      </p>

      <Link
        to={`/compare?ids=${ids}`}
        className="bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        Compare Now
      </Link>
    </div>
  );
};

export default CompareBar;