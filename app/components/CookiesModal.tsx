import React from 'react'

const CookiesModal = () => {
  const [showPopup, setShowPopup] = React.useState(true); // Popup'ın görünürlüğünü kontrol eder

  // Kullanıcının çerez tercihini localStorage'a kaydeder
  const setCookiePreference = (preference: any) => {
    window.localStorage.setItem('cookie-preference', preference);
    setShowPopup(false); // Popup'ı gizler
  };

  // Eğer kullanıcı çerez tercihini daha önce belirttiyse popup'ı gösterme
  if (window.localStorage.getItem('cookie-preference')) {
    return null;
  }

  return (
    showPopup && (
      <div className="z-[999] absolute w-screen h-screen bg-black flex items-center justify-center backdrop-blur-2xl bg-opacity-25 top-0 left-0">
        <div
          className={
            "p-10 max-w-[350px] bg-white bg-opacity-[4%] border-white border-[2px] rounded-lg border-opacity-10"
          }
        >
        <p className='text-center'>We use cookies to enhance your browsing experience, seerce personalized ads or content, and analyze our traffic. By clicking &quot;Accept All&quot;, you consent to our use of cookies.</p>
        <div className='mt-3 flex justify-around'>
        <button 
          className={
            "m-1 rounded-lg bg-white tracking-wider duration-150 hover:bg-black hover:text-white hover:outline-white outline transition px-2 py-1 sm:px-5 sm:py-2 lg:px-5 lg:py-3.5 text-black font-semibold select-none text-sm sm:text-base"
          }
          onClick={() => setCookiePreference('accept')}
          >
            Accept All
        </button>
        <button 
          className={
            "m-1 rounded-lg bg-white tracking-wider duration-150 hover:bg-black hover:text-white hover:outline-white outline transition px-2 py-1 sm:px-5 sm:py-2 lg:px-5 lg:py-3.5 text-black font-semibold select-none text-sm sm:text-base"
          }
          onClick={() => setCookiePreference('reject')}
          >
            Reject All
        </button>
        <button 
          className={
            "m-1 rounded-lg bg-white tracking-wider duration-150 hover:bg-black hover:text-white hover:outline-white outline transition px-2 py-1 sm:px-5 sm:py-2 lg:px-5 lg:py-3.5 text-black font-semibold select-none text-sm sm:text-base"
          }
          >
            Learn More
        </button>
        </div>
        </div>
      </div>
    )
  )
}

export default CookiesModal