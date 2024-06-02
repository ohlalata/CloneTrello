import React, { useState } from "react";
import "./style.scss";
import registerServices from "../../api/Services/register.services";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import * as constant from "../../shared/constants";
import loginServices from "../../api/Services/login.Services";

const RegisterPages = () => {
  const navigate = useNavigate();

  const [formVisible, setFormVisible] = useState(true);
  const [emailRegister, setEmailRegister] = useState("");
  const [passwordRegister, setPasswordRegister] = useState("");
  const [nameRegister, setNameRegister] = useState("");

  const tempRegister = (event) => {
    event.preventDefault();

    setFormVisible(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await registerServices.Register(
        emailRegister,
        passwordRegister,
        nameRegister
      );
      if (response.data.code == 201) {
        console.log("Register successfull!");
        toast.success("Register Successfully!");
        let accessToken;
        try {
          const response = await loginServices.login(
            emailRegister,
            passwordRegister
          );
          if (response.data.code == 200) {
            console.log("Bearer: " + response.data.bearer);
            accessToken = response.data.bearer;
            if (accessToken) {
              localStorage.setItem("accessToken", accessToken);
              toast.success("Login Successfully!");
              console.log("login throught register successfull!");
              navigate("/home");
            }
          }
        } catch (error) {
          console.error(error);
          console.log("login throught register fail!");
        }
      }
    } catch (error) {
      console.error(error);
      toast.success("Register Failed!");
    }
  };

  return (
    <React.Fragment>
      <div className="register__wrapper">
        <div className="register__container">
          <section className="register__section">
            <div className="d-flex flex-column">
              <div className="text-center">
                <img
                  className="image__logo"
                  alt="Logo"
                  src={constant.LOGO_TRELLO}
                />
              </div>

              <div className="d-flex justify-content-center mt-4 mb-1">
                <h6>Sign up to continue</h6>
              </div>
            </div>
            <div>
              <form>
                {formVisible ? (
                  <div className="d-flex justify-content-center my-2 ">
                    <input
                      name="email"
                      value={emailRegister}
                      onChange={(e) => setEmailRegister(e.target.value)}
                      className="w-100 border border-2 p-2 rounded-1"
                      placeholder="Enter your email"
                    ></input>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-1">
                    <div className="d-flex flex-column mb-2">
                      <p className="mb-1 text-body-tertiary email__label">
                        Email address
                      </p>
                      <span className="fw-bold form__email">
                        {emailRegister}
                      </span>
                    </div>
                    <div>
                      <p className="mb-0 fw-semibold full-name__label">
                        Full name <span className="text-danger">*</span>
                      </p>
                      <div className="d-flex justify-content-center my-1 ">
                        <input
                          name="full-name"
                          value={nameRegister}
                          onChange={(e) => setNameRegister(e.target.value)}
                          className="w-100 border border-2 p-2 rounded-1"
                          placeholder="Enter full name"
                        ></input>
                      </div>
                    </div>

                    <div>
                      <p className="mb-0 fw-semibold password__label">
                        Password <span className="text-danger">*</span>
                      </p>
                      <div className="d-flex justify-content-center my-1 ">
                        <input
                          name="password"
                          type="password"
                          value={passwordRegister}
                          onChange={(e) => setPasswordRegister(e.target.value)}
                          className="w-100 border border-2 p-2 rounded-1"
                          placeholder="Create password"
                        ></input>
                      </div>
                    </div>
                  </div>
                )}

                <p className="form__description">
                  By signing up, I accept the Atlassian{" "}
                  <span style={{ color: "#0052cc" }}>
                    Cloud Terms of Service
                  </span>{" "}
                  and acknowledge the{" "}
                  <span style={{ color: "#0052cc" }}>Privacy Policy.</span>
                </p>

                {formVisible ? (
                  <button
                    className="btn__email__register"
                    id="register__temp-submit"
                    onClick={tempRegister}
                  >
                    <span>Sign up</span>
                  </button>
                ) : (
                  <button
                    onClick={handleRegister}
                    className="btn__email__register"
                    id="sign__submit"
                  >
                    <span>Continue</span>
                  </button>
                )}
              </form>
            </div>
            <div className="mt-4 d-flex flex-column justify-content-center">
              <p className="text-center text-secondary fw-semibold">
                Or continue with:
              </p>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-center border border-dark-subtle rounded-1">
                  <button className="btn__register-google d-flex justify-content-center">
                    <span style={{ height: "40px", width: "40px" }}>
                      <img
                        src={constant.LOGO_GOOGLE}
                        className="image__logo-Google"
                        alt="logo Google"
                      />
                    </span>
                    <span style={{ color: "#42526E" }}>Google</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4 d-flex justify-content-center">
              <p>
                <a className="have-account" href="/login">
                  Already have an Atlassian account? Log in
                </a>
              </p>
            </div>
          </section>
        </div>

        <div className="d-flex justify-content-between z-3 position-absolute block__position-image">
          <div className="image__image-background-left">
            <img src={constant.BACKGROUND_LEFT} alt="image login left" />
          </div>
          <div className="image__image-background-right">
            <img src={constant.BACKGROUND_RIGHT} alt="image login right" />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default RegisterPages;
