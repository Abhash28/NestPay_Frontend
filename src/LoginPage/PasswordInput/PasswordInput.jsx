import { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

function PasswordInputField({ formData, setformData }) {
  const [isVisible, setisVisible] = useState();

  return (
    <div className="space-y-2">
      <label
        htmlFor="Password"
        className="text-sm font-medium text-gray-700"
      ></label>

      <div className="relative">
        <input
          id="Password"
          type={isVisible ? "text" : "password"}
          placeholder="Enter password"
          value={formData.password}
          onChange={(e) =>
            setformData({ ...formData, password: e.target.value })
          }
          className="w-full px-4 py-3 pr-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Eye Icon */}
        <span
          onClick={() => setisVisible(!isVisible)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-indigo-600 transition"
        >
          {isVisible ? (
            <MdVisibility size={20} />
          ) : (
            <MdVisibilityOff size={20} />
          )}
        </span>
      </div>
    </div>
  );
}

export default PasswordInputField;
