import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

type Props = {
  question: string,
  answer: string,
  active: boolean[],
  setActive: Dispatch<SetStateAction<boolean[]>>,
  idx: number
}

const Accordion = ({question, answer, active, setActive, idx}: Props) => {

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
      if(contentRef.current){
          contentRef.current.style.maxHeight = active![idx] ? `${contentRef.current.scrollHeight}px`:"0px"
      }

  },[contentRef, active, idx])

  const toggleAccordion = () => {
      let newActive = [...active!]
      newActive[idx] = !newActive[idx]
      setActive!(newActive)
  }
return (
  <div className='flex flex-col items-center justify-center w-full px-2 text-lg pt-4 lg:text-base'>
    <button onClick={toggleAccordion}
     className={`bg-transparent px-5 shadow cursor-pointer w-full h-full ${active![idx]}`}>
      <div className='py-3'>
         <div className='flex items-center justify-between h-14 text-left'>
            <span className='ml-2 font-medium lg:font-semibold lg:text-xl text-sm'>{question}</span>
            <div>
             { active![idx] ? <FontAwesomeIcon icon={faMinus} width={20} height={20}/> :
              <FontAwesomeIcon icon={faPlus} width={20} height={20}/>}

            </div>
         </div>
         <div ref={contentRef} className='mx-4 overflow-hidden text-left transition-all duration-500 h-full'>
            <p className='py-1 font-normal leading-normal text-justify whitespace-pre-line text-xs lg:text-lg'>
              {answer}
            </p>
         </div>
      </div>
    </button>
  </div>
)
}

export default Accordion;