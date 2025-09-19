"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { saveAuth } from "@/lib/utils";

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    age: "",
    standard: "",
    school: "",
    subjects: "", // New field for subjects, will be split into an array
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = {
      ...form,
      subjects: form.subjects.split(",").map(s => s.trim()).filter(Boolean), // Split subjects string into an array
    };

    try {
      const res = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const data = await res.json();
      if (res.ok) {
        saveAuth(data); // save token, username, email
        router.push("/dashboard"); // redirect after success
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input placeholder="First Name" name="firstName" onChange={handleChange} required />
            <Input placeholder="Last Name" name="lastName" onChange={handleChange} />
            <Input placeholder="Username" name="username" onChange={handleChange} required />
            <Input type="email" placeholder="Email" name="email" onChange={handleChange} required />
            <Input type="number" placeholder="Age" name="age" onChange={handleChange} />
            <Input placeholder="Standard" name="standard" onChange={handleChange} />
            <Input placeholder="School" name="school" onChange={handleChange} />
            <Input 
              placeholder="Subjects (e.g., Math, Science, History)" 
              name="subjects" 
              onChange={handleChange} 
            />
            <Input type="password" placeholder="Password" name="password" onChange={handleChange} required />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}