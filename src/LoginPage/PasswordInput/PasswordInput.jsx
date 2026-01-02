import { useState } from "react";
import { MdVisibility } from "react-icons/md";
import { MdVisibilityOff } from "react-icons/md";
function PasswordInputField({ formData, setformData }) {
  const [isVisible, setisVisible] = useState();
  return (
    <>
      <label htmlFor="Password">Password : </label>
      <input
        id="Password"
        type={isVisible ? "text" : "password"}
        placeholder="Enter Password"
        value={formData.password}
        onChange={(e) => setformData({ ...formData, password: e.target.value })}
      ></input>{" "}
      <span
        onClick={() => {
          setisVisible(!isVisible);
        }}
      >
        {isVisible ? <MdVisibility /> : <MdVisibilityOff />}
      </span>
    </>
  );
}
export default PasswordInputField;
