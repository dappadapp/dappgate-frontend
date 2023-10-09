import { Fragment } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faCheck } from "@fortawesome/free-solid-svg-icons";
import { Listbox, Transition } from "@headlessui/react";

type Props = {
  value: any;
  onChange: (value: any) => void;
  options: any[];
  searchValue: string;
  setSearchValue: (value: string) => void;
  optionRenderer?: (option: any, selected: boolean) => JSX.Element;
  className?: string;
};

const ListboxSourceMenu = ({
  value,
  onChange,
  options,
  searchValue,
  setSearchValue,
  optionRenderer = defaultOptionRenderer,
  className,
}: Props) => {
  return (
    <Listbox value={value} onChange={onChange} >
      <div className={`relative w-full sm:w-[36%] hover:text-black ${className}`}>
        <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white bg-opacity-5 py-4 px-4 text-left text-lg focus:outline-none hover:text-black">
          <div className="flex items-center gap-2">
            <Image
              src={`/chains/${value.image}`}
              alt={value.name}
              width={25}
              height={25}
              className="rounded-full"
            />
            <span className="block truncate text-xl font-medium">
              {value.name}
            </span>
          </div>
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
          <Listbox.Options className="absolute mt-1 z-20  max-h-60 w-full overflow-auto rounded-md bg-[#1f1f1f] py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="my-1 mx-4 w-5/6 px-3 py-2 rounded-md bg-gray-700"
              placeholder="Search"
            />
            {options.map((option, i) => (
              <Listbox.Option
                key={i}
                className={({ active }) =>
                `text-white relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                  active ? "text-black bg-gray-500 " : "text-white hover:text-black"
                }`
                }
                value={option}
              >
                {(props) => optionRenderer(option, props.selected)}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

const defaultOptionRenderer = (option: any, selected: any) => (
  <div className="flex items-center gap-2">
    {selected ? (
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black">
        <FontAwesomeIcon icon={faCheck} />
      </span>
    ) : null}
    <Image
      src={`/chains/${option.image}`}
      alt={option.name}
      width={25}
      height={25}
      className="rounded-full"
    />
    <span className="block truncate text-lg text-black">{option.name}</span>
  </div>
);

export default ListboxSourceMenu;
