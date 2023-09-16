import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord, faTwitter } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <div className={"mt-auto pb-16 flex justify-between items-center"}>
            <p className={"text-gray-400 font-light"}>
              DappGate by{" "}
              <a
                href={"https://dapplabs.tech/"}
                className={"text-white font-bold"}
              >
                DappLabs
              </a>
            </p>
            <div className={"flex gap-4 text-xl text-gray-400 "}>
              <a
                href="https://twitter.com/DappGate"
                target="_blank"
                className={"hover:text-gray-100 transition-all"}
              >
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a
                href={"https://discord.gg/HWvqJWKBvm"}
                target="_blank"
                className={"hover:text-gray-100 transition-all"}
              >
                <FontAwesomeIcon icon={faDiscord} />
              </a>
            </div>
          </div>
  )
}

export default Footer