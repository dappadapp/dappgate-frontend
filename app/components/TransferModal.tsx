import StargateWidget from "./StargateWidget";

type Props = {
  onCloseModal: any;
};

function TransferModal({ onCloseModal }: Props) {
  return (
    <div
      className={
        "z-[999] absolute w-screen h-screen bg-black flex items-center justify-center backdrop-blur-2xl bg-opacity-25 top-0 left-0"
      }
    >
      <div
        className={
          "p-16 max-w-[90vw] bg-white bg-opacity-[4%] border-white border-[2px] rounded-lg border-opacity-10"
        }
      >
        <div className="flex justify-end mb-5">

          <div
            onClick={() => onCloseModal()}
            className="right-0 z-[9999] font-medium rounded-md flex justify-center items-center cursor-pointer border border-gray-400 w-8 h-8"
          >
            X
          </div>
        </div>
        <StargateWidget />
        <div className="shadow-lg rounded-lg overflow-hidden mt-5"></div>
      </div>
    </div>
  );
}

export default TransferModal;
