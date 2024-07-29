import { createContext, useContext, useEffect, useReducer } from "react";

const BASE_URL = "http://localhost:3000";

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
      break;

    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
      break;

    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
      break;

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
      break;

    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };
      break;

    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
      break;

    default:
      throw new Error("Unknown action type");
      break;
  }
}

// 1.) Creating a Context
const CitiesContext = createContext();

// 2.) Creating our own provider context
function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading data...",
        });
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    console.log(currentCity.id, id);
    if (Number(currentCity.id) === Number(id)) return;
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
      // setCurrentCity(data);
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was problem fetching the datas.",
      });
    }
  }
  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        // Create a POST request to an API or sending some data to an API
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "city/created", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was a problem while creating the city",
      });
    }
  }
  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        // Deleting the city item from the cities.json file based on the given id
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was problem while removing the city.",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        error,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

// 3.) Creating own context hooks
function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CityContext was used outside of the CityProvider");
  return context;
}

// 4.) Exporting the provider and hook

export { CitiesProvider, useCities };
