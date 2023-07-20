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
      "question": "What is DappGate?",
      "answer": "DappGate - Pioneering #LayerZero to bridge ONFTs and OFTs across networks. Empowering seamless cross-chain interactions and control of your digital future."
    },
    {
      "idx": 2,
      "question": "How can I trace my transaction?",
      "answer": `There are a few ways for you to track your transactions:
      - On DappGate application history,
      - On your wallet activity,
      - On each network where each transaction occurred`
    },

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