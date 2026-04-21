"use client";

import { Suspense } from "react";
import CustomSearch from "../../components/search/search";

const SearchPage = () => {
  return (
    <Suspense fallback={<div style={{textAlign: "center" }}>Loading...</div>}>
      <CustomSearch />
    </Suspense>
  );
};

export default SearchPage;
