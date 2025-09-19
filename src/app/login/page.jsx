"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Save token, username, email to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("email", data.user.email);

        // Optional: save everything as a single object too
        localStorage.setItem(
          "auth",
          JSON.stringify({
            token: data.token,
            username: data.user.username,
            email: data.user.email,
          })
        );

        // ✅ Redirect to dashboard
        router.push("/dashboard");
      } else {
        setErrorMessage(data.message || "Login failed");
      }
    } catch (err) {
      setErrorMessage("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col md:flex-row min-h-screen">
      {/* Background Image Section (70% on large screens) */}
      <div
        className="relative flex-grow-0 md:flex-grow w-full md:w-[70%] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://www.21kschool.com/th/wp-content/uploads/sites/2/2022/08/How-to-Cultivate-Environmental-Awareness-in-Schools-1.png')`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      
      {/* Login Tab Section (30% on large screens) */}
      <div className="relative z-10 w-full md:w-[30%] flex justify-center items-center py-12 px-6 bg-white/10 backdrop-blur-md">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 tracking-wide drop-shadow-lg bg-gradient-to-r from-green-400 to-sky-500 bg-clip-text text-transparent">
              PlanetZero
            </h1>
          </div>
          <Card className="p-6 bg-white shadow-2xl rounded-3xl border border-gray-200">
            <CardHeader>
              <CardTitle className="text-center text-3xl font-bold text-gray-800">
                Login
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                {errorMessage && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative" role="alert">
                    <span className="block sm:inline">{errorMessage}</span>
                  </div>
                )}
                <p className="text-center text-gray-600 font-medium">
                  Please enter your login information below.
                </p>
                <Input
                  placeholder="Username or Email"
                  name="identifier"
                  onChange={handleChange}
                  required
                  className="placeholder:text-gray-600 text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={handleChange}
                  required
                  className="placeholder:text-gray-600 text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
                />
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl shadow-lg transition-colors duration-200" 
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
