import arrowRightIcon from "../assets/arrow_right_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.png"
import CardWrapper from "./components/Card"

const temp = () => {

    return (
        <main className="main-layout">

        <div className="header header-md">
          <img src="../assets/strikelogo.webp" alt="Strike logo"/>
        </div>

        <div className="content-layout content-layout-md">

          <div className="left-section left-section-md">
            <div className={styles.shape} />
            <p className={`${lusitana.className} welcome-text welcome-text-md`}>
              <strong>Welcome to a Strike API app.</strong> 
              <a href="https://strike.me/" className="text-blue-500">
                Strike
              </a>
              , brought to you by Dielawn.
            </p>
  
            <a
              href="/login"
              className="login-link login-link-md"
            >
              <span>Log in</span>
              <img src={arrowRightIcon} className="w-5 md:w-6" />
            </a>
          </div>
  
          <div className="right-section right-section-md">
            {/* relevant list */}
            <CardWrapper />
          </div>

        </div>
      </main>
    )
}