import React from "react";
import "./style.scss";
import logoTrello from "../../assets/images/logo/Trello-logo.png";
import logoGoogle from "../../assets/images/logo/Google-logo.png";
import logoMicrosoft from "../../assets/images/logo/Microsoft-logo.png";
import imageLeft from "../../assets/images/logo/image-login-left.png";
import imageRight from "../../assets/images/logo/image-login-right.png";

const LoginPages = () => {
  return (
    <React.Fragment>
      <div className="back-ground">
        <div className="background-login">
          <section className="form-login">
            <div className="d-flex flex-column">
              <div className="text-center">
                <img className="logo" alt="Logo" src={logoTrello} />
              </div>

              <div className="d-flex justify-content-center mt-4 mb-1">
                <h6>Log in to continue</h6>
              </div>
            </div>
            <div>
              <form>
                <div className="d-flex justify-content-center my-2 ">
                  <input
                    className="w-100 border border-2 p-2 rounded-1"
                    placeholder="Enter your email"
                  ></input>
                </div>
                <button
                  className="btn-email-submit"
                  type="submit"
                  id="login-submit"
                >
                  <span>Continue</span>
                </button>
              </form>
            </div>
            <div className="mt-4 d-flex flex-column justify-content-center">
              <p className="text-center text-secondary fw-semibold">
                Or continue with:
              </p>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-center border border-dark-subtle rounded-1">
                  <button className="btn-login-google d-flex justify-content-center">
                    <span style={{ height: "40px", width: "40px" }}>
                      <img
                        src={logoGoogle}
                        className="logoGoogle"
                        alt="logo Google"
                      />
                    </span>
                    <span style={{ color: "#42526E" }}>Google</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4 d-flex justify-content-center gap-2">
              <p>
                <a className="cant-login">Can't login?</a>
              </p>
              <p>•</p>
              <p>
                <a className="create-an-account">Create an account</a>
              </p>
            </div>
          </section>
        </div>

        <div className="d-flex justify-content-between z-3 position-absolute position-image">
          <div className="image-left">
            <img src={imageLeft} alt="image login left" />
          </div>
          <div className="image-right">
            <img src={imageRight} alt="image login right" />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default LoginPages;
