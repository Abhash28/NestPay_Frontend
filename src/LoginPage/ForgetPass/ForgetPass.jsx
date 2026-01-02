import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PasswordInputField from "../PasswordInput/PasswordInput";

function ForgetPass() {
  const [formData, setFormData] = useState({ mobileNo: "", password: "" });
  const [foundUser, setFoundUser] = useState(false);
  const [error, seterror] = useState("");
  //navigate
  const navigate = useNavigate();
  /*find user for update pass use 2 api because first find user if user exist then pass input box show */
  const handleFindUser = async () => {
    try {
      const response = await axios.post(
        "https://nestpay.onrender.com/api/auth/check-user",
        { mobileNo: formData.mobileNo }
      );
      if (response.data.success) {
        setFoundUser(true);
        seterror("");
      } else {
        setFoundUser(false);
        seterror("User Not found");
      }
    } catch (error) {
      if (error.response) {
        seterror(error.response.data.message);
      } else {
        seterror("Server not responding");
      }
    }
  };
  /*change password api */
  const handleChangePass = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://nestpay.onrender.com/api/auth/change-pass",
        { mobileNo: formData.mobileNo, password: formData.password }
      );
      alert(response.data.message);
      setFormData({ mobileNo: "", password: "" });
      //navigate to login page
      navigate("/");
    } catch (error) {
      if (error.response) {
        seterror(error.response.data.message);
      } else {
        seterror("Server not responding");
      }
    }
  };
  return (
    <div>
      <form onSubmit={handleChangePass}>
        <h1>Change Password</h1>
        {/*error */}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <label htmlFor="MobileNo">Mobile No : </label>
        <input
          id="MobileNo"
          type="text"
          placeholder="Enter Mobile No"
          onChange={(e) => {
            setFormData({ ...formData, mobileNo: e.target.value });
          }}
        />
        {!foundUser && (
          <button type="button" onClick={handleFindUser}>
            Find user
          </button>
        )}

        {foundUser && (
          <div>
            <PasswordInputField formData={formData} setformData={setFormData} />
            <button type="submit">Change password</button>
          </div>
        )}
      </form>
    </div>
  );
}

export default ForgetPass;
