import React, { useState, Dispatch, SetStateAction } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faCheck } from "@fortawesome/free-solid-svg-icons";
import Accordion from './Accordion';

type Props = {
  onCloseModal: any;
};


export default function FAQModal({ onCloseModal }: Props) {

  const [active, setActive] = useState([false, false, false, false, false]);

  const isSomeActive = active.some((element) => element);

  const handleClick = () => {
    isSomeActive ? setActive([false, false, false, false, false]) : setActive([true, true, true, true, true])
  }

  const questions = [
    {
      "idx": 1,
      "question": "What is Next.js?",
      "answer": "Next.js is an open-source, lightweight React.js framework that facilitates developers to build static and server-side rendering web applications."
    },
    {
      "idx": 2,
      "question": "Which types of websites most popularly use Next.js?",
      "answer": "• Static Websites \n • Desktop Websites\n • SEO Friendly Websites\n • Server Rendered Apps\n • Progressive Web Apps (PWA) etc."
    },
    {
      "idx": 3,
      "question": "Are Create-React-App and Next.js used for the same thing?",
      "answer": "The Create-React-App is basically React with an integrated build system. It acts like a good boilerplate, so we don't need to set up Webpack, Babel, and other dependent packages to run React. Other than that, if you require extra functionalities such as routing, server-side rendering, you just need to add packages on top of Create-React-App. On the other hand, The Next.js is an open-source, lightweight full-stack React framework that comes bundled with an efficient build system, server-side rendering, routing, API routing, and many other awesome features that make the production environment easy."
    },
    {
      "idx": 4,
      "question": "How can you configure the build-id in Next.js",
      "answer": "To configure the build-id in Next.js, we must configure a static ID between our builds. So, we have to provide the 'generateBuildId' function with the following configuration."
    },
    {
      "idx": 5,
      "question": "What is AMP in Next.js?",
      "answer": "The AMP-First Pages are served to the primary traffic of the website as well as traffic generated from the search engine."
    }
  ];

  return (
    <div
      className={
        "z-[999] absolute w-screen h-screen bg-black flex items-center justify-center backdrop-blur-2xl bg-opacity-25 top-0 left-0"
      }
    >
      <div
        className={
          "p-16 max-w-[50vw]  bg-white bg-opacity-[4%] border-white border-[2px] rounded-lg border-opacity-10"
        }
      >
        <div className="flex justify-between mb-2">
          <h1 className={"text-3xl"}>Frequently Asked Questions</h1>
          <div
            onClick={() => onCloseModal()}
            className="right-0 z-[9999] font-medium rounded-md flex justify-center items-center cursor-pointer border border-gray-400 w-8 h-8"
          >
            X
          </div>
        </div>

        <div className="shadow-lg rounded-lg overflow-hidden mt-5">
          <div className="overflow-x-auto overflow-y-auto max-h-90">


            {questions.map((el, i) => {
              return (
                <div className='w-full' key={"questions" + i}>
                  <Accordion
                    question={el.question}
                    answer={el.answer}
                    active={active}
                    setActive={setActive}
                    idx={el.idx}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}