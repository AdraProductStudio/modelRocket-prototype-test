import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Component/Home";
import AuthPage from "./Component/AuthPage";
import ConsumerPreferenceLayout from "../src/Component/Reusables/ConsumerPreferenceLayout";
import { Toaster } from "react-hot-toast";
import ProductCategory from "./Component/Reusables/ProductCategory";
import AdminForm from "./Component/AdminForm";
import { DataProvider } from "./Component/CommonContext";
import AdminForm1 from "./Component/AdminForm1";

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <DataProvider>
        <Toaster />
        <Routes>
          <Route path="/" element={<AuthPage />}>
            <Route index exact element={<Home />} />
            <Route path="admin" element={<AdminForm1 />} />
            <Route path="consumer_preference" exact element={<ConsumerPreferenceLayout />} />
            <Route path="category" element={<ProductCategory />} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Route>
        </Routes>
      </DataProvider>
    </BrowserRouter>
  );
}

export default App;
