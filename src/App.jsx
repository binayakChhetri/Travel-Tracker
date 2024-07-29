import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import Homepage from "./pages/Homepage";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import AppLayout from "./pages/AppLayout";
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";

import { CitiesProvider, useCities } from "./contexts/CitiesContext";
import { AuthProvider } from "./contexts/FakeAuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";

function App() {
  // Defining route in our JSX
  return (
    <AuthProvider>
      <CitiesProvider>
        {/* WRAPPING THE APPLICATION INSIDE THE ROUTER */}
        <BrowserRouter>
          <Routes>
            <Route index element={<Homepage />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="product" element={<Product />} />
            <Route path="login" element={<Login />} />
            {/* NESTED ROUTING */}
            <Route
              path="app"
              // Here we will protect the route(Feature of Fake authentication)
              // Users without login won't be able to visit the the site and will be redirect to the root
              // Simple put, if they try to directly visit this link with no login "http://localhost:5173/app/countries"
              // then we will redirect them to the root/homepage
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate replace to="cities" />} />
              <Route path="cities" element={<CityList />} />
              {/* DYNAMIC ROUTING */}
              <Route path="cities/:id" element={<City />} />
              <Route path="countries" element={<CountryList />} />
              <Route path="form" element={<Form />} />
            </Route>

            {/*   
          path="*" => This will basically catch all the routes that does not match the one of above 3's
        */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}

export default App;
