import {
  createContext,
  useContext,
  useState,
} from "react";

const CompareContext =
  createContext();

export const CompareProvider =
  ({ children }) => {
    const [
      compareItems,
      setCompareItems,
    ] = useState([]);

    const addToCompare =
      (product) => {
        if (
          compareItems.find(
            (p) =>
              p._id ===
              product._id
          )
        ) {
          return;
        }

        if (
          compareItems.length >= 4
        ) {
          return;
        }

        setCompareItems([
          ...compareItems,
          product,
        ]);
      };

    const removeFromCompare =
      (id) => {
        setCompareItems(
          compareItems.filter(
            (p) =>
              p._id !== id
          )
        );
      };

    return (
      <CompareContext.Provider
        value={{
          compareItems,
          addToCompare,
          removeFromCompare,
        }}
      >
        {children}
      </CompareContext.Provider>
    );
  };

export const useCompare =
  () =>
    useContext(
      CompareContext
    );