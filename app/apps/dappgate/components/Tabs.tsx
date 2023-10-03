import React, { Fragment } from "react";
import { Tab } from "@headlessui/react";

type Props = {
  tabIndex: number;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
};

export const tabsConfig = [
  "zkONFT Bridge",
  "ONFT Bridge",
  "ONFT HyperBridge",
  "Gas Refuel",
  "OFT Bridge",
  "OFT HyperBridge",


];

const Tabs: React.FC<Props> = ({ tabIndex, setTabIndex }) => {
  const tabs = tabsConfig.map((title,index) => (
    <Tab as={Fragment} key={title} >
      {({ selected }) => (
        
        <button
          className={`px-2 sm:px-4 py-1 sm:py-2.5 rounded-lg text-white text-sm sm:text-base w-full sm:w-auto   ${
            selected ? "bg-white bg-opacity-[1%] backdrop-blur-[3px] outline-none" : "bg-transparent"
          }`}
        >

          {title === "zkONFT Bridge" && (
            <span className="relative inline-block dot">
               <span
                className={`absolute dot  h-2 w-2 bg-green-400 rounded-full `}
              />
            
            </span>
          )}
        
        {title === "Gas Refuel" && (
            <span className="relative inline-block dot">
               <span
                className={`absolute dot  h-2 w-2 bg-green-400 rounded-full `}
              />
            
            </span>
          )}

          {title === "ONFT HyperBridge" && (
            <span className="relative inline-block dot">
               <span
                className={`absolute dot  h-2 w-2 bg-green-400 rounded-full `}
              />
            
            </span>
          )}
      
      {title}
        </button>
      )}
    </Tab>
  ));
  return (
    <Tab.Group onChange={setTabIndex} selectedIndex={tabIndex}>
  
      <Tab.List className="p-1 sm:p-2.5 bg-white bg-opacity-10 backdrop-blur-[3px] rounded-xl">{tabs}</Tab.List>
    </Tab.Group>
  );
};

export default Tabs;