"use client";
import React, { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faCheck } from "@fortawesome/free-solid-svg-icons";
import { faTwitter, faDiscord } from "@fortawesome/free-brands-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

const from = [
  { name: "test1" },
  { name: "test2" },
  { name: "test3" },
  { name: "test4" },
  { name: "test5" },
  { name: "test6" },
  { name: "test7" },
  { name: "test8" },
  { name: "test9" },
  { name: "test10" },
  { name: "test11" },
];
const to = [
  { name: "test1" },
  { name: "test2" },
  { name: "test3" },
  { name: "test4" },
  { name: "test5" },
  { name: "test6" },
  { name: "test7" },
  { name: "test8" },
  { name: "test9" },
  { name: "test10" },
  { name: "test11" },
];

export default function Home() {
  const [selected, setSelected] = useState(from[0]);
  const [selected2, setSelected2] = useState(to[0]);
  return (
    <div className={"relative w-full h-[100vh] min-h-[800px] overflow-hidden"}>
      <div className={"absolute z-10 w-full h-full flex flex-col "}>
        <div className={"container mx-auto h-full flex flex-col"}>
          <div className={"w-full flex items-center justify-between mt-16"}>
            <h1 className={"text-4xl font-bold select-none"}>DappGate</h1>
            <button
              className={
                "rounded-lg bg-white tracking-wider duration-150 hover:bg-black hover:text-white hover:outline-white outline transition px-10 py-3.5 text-black font-semibold select-none"
              }
            >
              Connect Wallet
            </button>
          </div>
          <div
            className={
              "h-full w-full min-h-fit py-16  flex flex-col items-center justify-center"
            }
          >
            <div
              className={
                "w-full max-w-[800px] bg-white bg-opacity-5 backdrop-blur-[3px] border-white border-[2px] border-opacity-10 h-fit p-16 rounded-2xl flex flex-col"
              }
            >
              <h1 className={"text-3xl font-semibold"}>Bridge</h1>
              <div className={"flex justify-between items-center mt-16"}>
                <Listbox
                  value={selected}
                  onChange={setSelected}
                  className={"w-[36%]"}
                >
                  <div className="relative">
                    <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white bg-opacity-5 py-3 px-4 text-left text-lg focus:outline-none ">
                      <span className="block truncate">{selected.name}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                        <FontAwesomeIcon icon={faAngleDown} />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white bg-opacity-20 backdrop-blur-[3px]  py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {from.map((person, personIdx) => (
                          <Listbox.Option
                            key={personIdx}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active ? "bg-white text-black" : "text-gray-300"
                              }`
                            }
                            value={person}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-bold" : "font-normal"
                                  }`}
                                >
                                  {person.name}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black ">
                                    <FontAwesomeIcon icon={faCheck} />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
                <svg
                  width="58"
                  height="45"
                  viewBox="0 0 48 35"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="17.4"
                    cy="17.4"
                    r="16.4"
                    stroke="white"
                    stroke-width="2"
                  />
                  <circle
                    cx="30.6031"
                    cy="17.4"
                    r="16.4"
                    stroke="white"
                    stroke-width="2"
                  />
                </svg>

                <Listbox
                  value={selected2}
                  onChange={setSelected2}
                  className={"w-[36%]"}
                >
                  <div className="relative">
                    <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white bg-opacity-5 py-3 px-4 text-left text-lg focus:outline-none ">
                      <span className="block truncate">{selected2.name}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                        <FontAwesomeIcon icon={faAngleDown} />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white bg-opacity-20 backdrop-blur-[3px]  py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {to.map((person, personIdx) => (
                          <Listbox.Option
                            key={personIdx}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active ? "bg-white text-black" : "text-gray-300"
                              }`
                            }
                            value={person}
                          >
                            {({ selected2 }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected2 ? "font-bold" : "font-normal"
                                  }`}
                                >
                                  {person.name}
                                </span>
                                {selected2 ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black ">
                                    <FontAwesomeIcon icon={faCheck} />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>
              <div
                className={
                  "flex justify-center items-center gap-8 w-full mt-28 select-none"
                }
              >
                <button className={""}>asd</button>
                <span>or</span>
                <button>asd</button>
              </div>
            </div>
          </div>
          <div className={"mt-auto mb-16 flex justify-between items-center"}>
            <p className={"text-gray-400 font-light"}>
              DappGate by{" "}
              <a href={"/"} className={"text-white font-bold"}>
                DappLabs
              </a>
            </p>
            <div className={"flex gap-4 text-xl text-gray-400 "}>
              <a href="/" className={"hover:text-gray-100 transition-all"}>
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href={"/"} className={"hover:text-gray-100 transition-all"}>
                <FontAwesomeIcon icon={faDiscord} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className={"relative w-full h-full"}>
        <div className={"absolute z-[4] bg-effect w-full h-full"}></div>
        <div className={"absolute z-[3] w-full h-full bg-pattern"}></div>
        <div className={"absolute z-[2] w-full h-full"}>
          <div
            className={
              "container relative mx-auto h-full flex justify-center items-center text-white bg-blur"
            }
          >
            <div
              className={
                "absolute z-[-12] h-[800px] aspect-square blur-[140px] left-[-40%] bg-red-500 rounded-full"
              }
            ></div>
            <div
              className={
                "absolute z-[-12] h-[800px] aspect-square blur-[140px] right-[-40%] bg-blue-500 rounded-full"
              }
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
