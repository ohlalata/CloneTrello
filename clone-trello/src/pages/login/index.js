import React, { useState } from "react";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import loginService from "../../api/Services/login";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import * as constants from "../../shared/constants";

const LoginPages = () => {
  const navigate = useNavigate();

  const [enterEmail, setEnterEmail] = useState(true);
  const [enterConinue, setEnterConinue] = useState(true);

  const [enterPassword, setEnterPassword] = useState(false);
  const [enterSubmit, setEnterSubmit] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const tempEnter = (event) => {
    event.preventDefault();
    setEnterConinue(false);
    setEnterEmail(false);
    setEnterPassword(true);
    setEnterSubmit(true);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginService.login(email, password);
      if (response.data.code == 200) {
        toast.success("Login Successfully!");
        navigate("/home");
      }
    } catch (error) {
      toast.error("Login Failed!");
      console.error(error);
    }
  };

  return (
    <React.Fragment>
      <div className="login__wrapper">
        <div className="login__container">
          <section className="login__section">
            <div className="d-flex flex-column">
              <div className="text-center">
                <img
                  className="logo"
                  alt="Logo"
                  src={constants.LOGO_TRELLO_URL}
                />
              </div>

              <div className="d-flex justify-content-center mt-4 mb-1">
                <h6>Log in to continue</h6>
              </div>
            </div>
            <div>
              <form>
                {enterEmail && (
                  <div className="d-flex justify-content-center my-2 ">
                    <input
                      value={email}
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-100 border border-2 p-2 rounded-1"
                      placeholder="Enter your email"
                    ></input>
                  </div>
                )}

                {enterPassword && (
                  <div>
                    <div className="d-flex justify-content-between px-1">
                      <span>{email}</span>

                      <FontAwesomeIcon icon={faPen} />
                    </div>
                    <div className="d-flex justify-content-center my-2 ">
                      <input
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-100 border border-2 p-2 rounded-1"
                        placeholder="Enter password"
                      ></input>
                    </div>
                  </div>
                )}
                {enterConinue && (
                  <button
                    className="btn__email-submit"
                    id="login-continue"
                    onClick={tempEnter}
                  >
                    <span>Continue</span>
                  </button>
                )}

                {enterSubmit && (
                  <button
                    className="btn__email-submit"
                    id="login-submit"
                    onClick={handleLogin}
                  >
                    <span>Log In</span>
                  </button>
                )}
              </form>
            </div>
            {/* <div className="mt-4 d-flex flex-column justify-content-center">
              <p className="text-center text-secondary fw-semibold">
                Or continue with:
              </p>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-center border border-dark-subtle rounded-1">
                  <button className="btn__login-google d-flex justify-content-center">
                    <span style={{ height: "40px", width: "40px" }}>
                      <img
                        src={constants.LOGO_GOOGLE_URL}
                        className="image__logo-Google"
                        alt="logo Google"
                      />
                    </span>
                    <span style={{ color: "#42526E" }}>Google</span>
                  </button>
                </div>
              </div>
            </div> */}
            <div className="mt-4 d-flex justify-content-center gap-2">
              <p>
                <a className="link__cant-login" href="/register">
                  Can't login?
                </a>
              </p>
              <p>•</p>
              <p>
                <a className="link__create-account" href="/register">
                  Create an account
                </a>
              </p>
            </div>
          </section>
        </div>

        <div className="d-flex justify-content-between z-3 position-absolute block__position-image">
          <div className="block__image-left">
            <img src={constants.BACKGROUND_LEFT_URL} alt="image login left" />
          </div>
          <div className="block__image-right">
            <img src={constants.BACKGROUND_RIGHT_URL} alt="image login right" />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default LoginPages;
