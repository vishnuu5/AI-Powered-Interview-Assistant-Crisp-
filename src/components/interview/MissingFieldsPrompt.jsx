import { useDispatch, useSelector } from "react-redux";
import {
  selectSession,
  updateProfile,
  startInterview,
} from "../../store/slices/sessionSlice";
import { useEffect, useMemo, useState } from "react";

export default function MissingFieldsPrompt() {
  const { profile } = useSelector(selectSession);
  const dispatch = useDispatch();
  const [name, setName] = useState(profile.name || "");
  const [email, setEmail] = useState(profile.email || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [error, setError] = useState("");

  const missing = useMemo(() => {
    const list = [];
    if (!name.trim()) list.push("Name");
    if (!email.trim()) list.push("Email");
    if (!phone.trim()) list.push("Phone");
    return list;
  }, [name, email, phone]);

  useEffect(() => {
    dispatch(updateProfile({ name, email, phone }));
  }, [name, email, phone, dispatch]);

  function validate() {
    if (missing.length > 0) {
      setError(`Please provide: ${missing.join(", ")}`);
      return false;
    }
    // basic validation
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email.");
      return false;
    }
    if (!/^\+?[0-9()\-\s]{7,}$/.test(phone)) {
      setError("Please enter a valid phone number.");
      return false;
    }
    setError("");
    return true;
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">We need a few details before starting</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          className="border border-neutral-200 rounded-md px-3 py-2"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border border-neutral-200 rounded-md px-3 py-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border border-neutral-200 rounded-md px-3 py-2"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      {error ? <div className="text-sm text-red-600">{error}</div> : null}
      <button
        className="bg-primary text-white px-4 py-2 rounded-md"
        onClick={() => {
          if (validate()) dispatch(startInterview());
        }}
      >
        Start Interview
      </button>
    </div>
  );
}
