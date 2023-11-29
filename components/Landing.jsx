import Navbar from "./Navbar";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./styles/bg.module.css";


export default function LandingComponents() {
  const router = useRouter();

  return (
    <div className={styles.gradientBackground}> {/* Added pt-4 for top padding */}
      <div className="row">
        <div className="col-lg-6 col-md-12">
          <div className="py-2 py-lg-4 text-black" style={{textAlign:'center',marginTop:'20%'}}>
            <h3 className="py-1 py-lg-2 text-white"
            style={{fontFamily:'Arial Black', backgroundColor:'Brown'}}
            >
              TUPC Water Dispenser Refill Alert System
            </h3>
            <p style={{fontFamily:'Constantia'}}>
              Stay Refreshed: TUPCians Check here the Water Dispenser's Status around Campus
            </p>
            <div className="d-flex flex-column align-items-center" style={{fontFamily:'Arial Black'}}>
                <h4 className="py-1 py-lg-2 text-black"></h4>
              <button
                className="btn btn-dark rounded-pill btn-lg w-50 mb-2"
                onClick={() => router.push(`/dashboard/wdras-main`)}
              >
                See Water Dispensers
              </button>
             
              <button
                className="btn btn-light rounded-pill btn-md w-25"
                onClick={() => router.push(`/auth/admin`)}
              >
                Log-in as admin
              </button>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-12 mt-lg-0 mt-3 d-flex align-items-center justify-content-center">
          <img style={{border:'5px solid brown'}}
            src="/waterdispenser.jpg"
            alt="Image Description"
            className="img-fluid"
          />
        </div>
      </div>
      <footer className="text-black text-center p-3 mt-5">
        <ul className="list-unstyled d-flex justify-content-center">
          <li className="mx-2">
            <a href="/#" className="text-black">
              About
            </a>
          </li>
          <li className="mx-2">
            <a href="/#" className="text-black">
              Contact
            </a>
          </li>
          <li className="mx-2">
            <a href="/#" className="text-black">
              Feedback
            </a>
          </li>
          <li className="mx-2">
            <a href="/#" className="text-black">
              Developers
            </a>
          </li>
        </ul>
        <div className="mt-2">
          &copy; {new Date().getFullYear()} TUPC Water Dispenser Refill Alert
          System
        </div>
      </footer>
    </div>
  );
}
