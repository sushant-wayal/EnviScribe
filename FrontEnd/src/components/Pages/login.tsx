import { domain, tokenKey } from "@/constants";
import axios from "axios";
import { useState } from "react";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data : { accessToken } } = await axios.post(`${domain}/api/v1/users/login`, { username, password });
    localStorage.setItem(tokenKey, accessToken);
  }
  return (
    <form>
      <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
      <button onClick={handleSubmit} type="submit">Login</button>
    </form>>
  );
};

export default LoginPage;