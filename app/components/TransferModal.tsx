import type {NextPage} from 'next';
import WidgetType from '@layerzerolabs/stargate-ui';
import dynamic from 'next/dynamic';

type Props = {
  onCloseModal: any;
};

const Widget =
  dynamic < typeof WidgetType > (() => import('@layerzerolabs/stargate-ui'), {ssr: false});

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
        <div className="flex justify-between mb-2">
          <h1 className={"text-3xl"}>Transfer</h1>
          <div
            onClick={() => onCloseModal()}
            className="right-0 z-[9999] font-medium rounded-md flex justify-center items-center cursor-pointer border border-gray-400 w-8 h-8"
          >
            X
          </div>
        </div>

        <div className="shadow-lg rounded-lg overflow-hidden mt-5">
          <Widget themeName='light' />
        </div>
      </div>
    </div>
  );
}

export default TransferModal;
