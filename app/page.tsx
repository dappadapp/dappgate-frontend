import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faDiscord } from "@fortawesome/free-brands-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

export default function Home() {
  return (
    <div className={"relative w-full h-[100vh] min-h-[800px]"}>
      <div className={"absolute z-[10] w-full h-full flex flex-col "}>
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
      <div className={"absolute z-[-1] w-full h-full"}>
        <div className={"bg-effect absolute z-1 w-full h-full"}></div>
        <div className={"absolute z-[-1] w-full h-full bg-pattern"}></div>
      </div>
    </div>
  );
}
