import React, { useEffect, useState } from "react";
import TabTitle from "../../shared/tab-title/TabTitle";
import * as EmailValidator from "email-validator";
import { forgotPassword } from "../../store/action/authAction";
import { useDispatch, useSelector } from "react-redux";
import { fetchFrontSetting } from "../../store/action/frontSettingAction";
import {
    getFormattedMessage,
    placeholderText,
} from "../../shared/sharedMethod";
import { Image } from "react-bootstrap-v5";
import { Link } from "react-router-dom";
import Spinner from "../../shared/components/loaders/Spinner";

const ForgotPassword = () => {
    const { loginUser, frontSetting } = useSelector((state) => state);
    const [disable, setDisable] = useState(true);
    const Dispatch = useDispatch();
    const [forgotValue, setForgotValue] = useState({ email: "" });
    const [errors, setErrors] = useState({ email: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        clearEmail();
        Dispatch(fetchFrontSetting());
        if (!loginUser.errorMessage) {
            if (loginUser) {
                setLoading(false);
                setForgotValue({ email: "" });
            }
        } else {
            setLoading(false);
        }
    }, [loginUser, forgotPassword]);

    const handleChange = (e) => {
        e.persist();
        setForgotValue((inputs) => ({
            ...inputs,
            [e.target.name]: e.target.value,
        }));
        setDisable(false);
        setErrors("");
    };

    const prepareFormData = () => {
        const formData = new FormData();
        formData.append("email", forgotValue.email);
        return formData;
    };

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        if (!EmailValidator.validate(forgotValue["email"])) {
            if (!forgotValue["email"]) {
                errorss["email"] = getFormattedMessage(
                    "globally.input.email.validate.label"
                );
            } else {
                errorss["email"] = getFormattedMessage(
                    "globally.input.email.valid.validate.label"
                );
            }
        } else {
            isValid = true;
        }
        setErrors(errorss);
        return isValid;
    };

    const clearEmail = () => {
        if (
            loginUser &&
            loginUser === "We have emailed your password reset link!"
        ) {
            setForgotValue({ email: "" });
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const valid = handleValidation();
        !valid && setLoading(false);
        if (valid) {
            Dispatch(forgotPassword(prepareFormData(forgotValue)));
            setDisable(true);
        }
    };

    return (
        <div className="d-flex flex-column flex-column-fluid align-items-center justify-content-center p-4">
            <TabTitle title="Forgot Password" />
            <div className="col-12 text-center align-items-center justify-content-center m-2">
                <Image
                    className="logo-height"
                    src={
                        frontSetting &&
                        frontSetting.value &&
                        frontSetting.value.logo
                    }
                />
            </div>
            <div className="bg-theme-white rounded-15 shadow-md width-540 px-5 px-sm-7 py-10 mx-auto">
                <form className="form w-100">
                    <div className="text-center mb-7">
                        <h1 className="text-dark mb-3">
                            {getFormattedMessage(
                                "login-form.forgot-password.label"
                            )}
                        </h1>
                    </div>
                    <div className="mb-10">
                        <div className="d-flex justify-content-between mt-n5">
                            <div className="d-flex justify-content-between w-100">
                                <label className="form-label">
                                    {getFormattedMessage(
                                        "globally.input.email.label"
                                    )}
                                    :
                                    <span className="required" />
                                </label>
                            </div>
                        </div>
                        <input
                            placeholder={placeholderText(
                                "globally.input.email.placeholder.label"
                            )}
                            required
                            value={forgotValue.email}
                            type="text"
                            name="email"
                            autoComplete="on"
                            className="form-control"
                            onChange={(e) => handleChange(e)}
                        />
                        <span className="text-danger d-block fw-400 fs-small mt-2">
                            {errors["email"] ? errors["email"] : null}
                        </span>
                    </div>
                    <div className="d-flex justify-content-center pb-lg-0">
                        <button
                            className="btn btn-primary"
                            type="submit"
                            onClick={(e) => onSubmit(e)}
                            disabled={disable}
                        >
                            {loading ? (
                                <span className="d-block">
                                    {getFormattedMessage(
                                        "globally.loading.label"
                                    )}
                                    <Spinner />
                                </span>
                            ) : (
                                <span>
                                    {getFormattedMessage(
                                        "forgot-password-form.reset-link-btn.label"
                                    )}
                                </span>
                            )}
                        </button>
                    </div>
                    <div className="d-flex justify-content-center m-3 pb-lg-0">
                        <Link
                            to="/login"
                            className="link-info fs-6 text-decoration-none"
                        >
                            {getFormattedMessage(
                                "login-form.go-to-sign-in.label"
                            )}
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
