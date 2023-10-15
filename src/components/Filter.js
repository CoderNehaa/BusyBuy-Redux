import React from "react";
import { applyFiltersAsync } from "../redux/reducers/filterReducer";
import { useDispatch, useSelector } from "react-redux";

function Filter () {
  // Getting data from filterReducer
  const { categories , filterPrice} = useSelector((state) => state.filterReducer);
  const dispatch = useDispatch();
  
  return (
    <div className="w-48 md:w-60 lg:w-72 px-2 py-1 md:pl-2 md:pt-6 md:pb-5 md:pr-8 bg-slate-200 text-left text-lg tracking-wide fixed right-1 top-36 md:top-60 md:left-0 dark:bg-slate-700 z-10">
      <div className="text-3xl font-bold text-center m-4 hidden md:block"> Filter </div>
      <div>
        <div className="text-xl font-semibold text-center m-1"> Price : {filterPrice} </div>
        <input className="w-44 cursor-pointer md:w-56 lg:w-60" type="range" min="1" max="1000" step="1" value={filterPrice} onChange={(e) => dispatch(applyFiltersAsync({category:null, filterPrice:e.target.value }))}/>
      </div>
        
      <h3 className="text-xl font-semibold md:text-center md:m-3 lg:text-2xl"> Category </h3>
      <div className="m-1 flex flex-col w-96">
      {categories.map((category, index) => {
        return (
          <label key={index} className="font-normal md:m-1 lg:text-xl"> <input className="cursor-pointer" type="checkbox" onClick={() => dispatch(applyFiltersAsync({ category, filterPrice}))}/> {category} </label>
        )
      })}
      </div>

    </div>
  )
}

export default Filter;

// If user enter wrong information, he should not navigate to home page.
// filter should turn off while going to another page, filter place also should be change.
