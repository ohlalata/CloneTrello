import React from "react";
import "./style.scss";
import logoTrello from "../../assets/images/logo/Trello-logo.png";
import logoGoogle from "../../assets/images/logo/Google-logo.png";
import logoMicrosoft from "../../assets/images/logo/Microsoft-logo.png";
import imageLeft from "../../assets/images/logo/image-login-left.png";
import imageRight from "../../assets/images/logo/image-login-right.png";

const SignupPages = () => {
  return (
    <React.Fragment>
      <div className="back-ground">
        <div className="background-signup">
          <section className="form-signup">
            <div className="d-flex flex-column">
              <div className="text-center">
                <img className="logo" alt="Logo" src={logoTrello} />
              </div>

              <div className="d-flex justify-content-center mt-4 mb-1">
                <h6>Sign up to continue</h6>
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
                <p className="a">
                  By signing up, I accept the Atlassian{" "}
                  <span style={{ color: "#0052cc" }}>
                    Cloud Terms of Service
                  </span>{" "}
                  and acknowledge the{" "}
                  <span style={{ color: "#0052cc" }}>Privacy Policy.</span>
                </p>
                <button
                  className="btn-email-signup"
                  type="submit"
                  id="login-submit"
                >
                  <span>Sign up</span>
                </button>
              </form>
            </div>
            <div className="mt-4 d-flex flex-column justify-content-center">
              <p className="text-center text-secondary fw-semibold">
                Or continue with:
              </p>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-center border border-dark-subtle rounded-1">
                  <button className="btn-signup-google d-flex justify-content-center">
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
                <div className="d-flex justify-content-center border border-dark-subtle rounded-1">
                  <button className="btn-signup-microsoft d-flex justify-content-center">
                    <span style={{ height: "40px", width: "40px" }}>
                      <img
                        src={logoMicrosoft}
                        className="logoMicrosoft"
                        alt="logo Google"
                      />
                    </span>
                    <span style={{ color: "#42526E" }}>Microsoft</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4 d-flex justify-content-center">
              <p>
                <a className="have-account">
                  Already have an Atlassian account? Log in
                </a>
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

export default SignupPages;
