"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { saveAuth } from "@/lib/utils";
import AnimatedTags from "@/components/smoothui/ui/AnimatedTags";

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    age: "",
    standard: "",
    school: "",
    password: "",
  });
  const [subjects, setSubjects] = useState([]);
  const [subjectInput, setSubjectInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSubjectInputChange = (e) => {
    setSubjectInput(e.target.value);
  };
  
  const addSubjectTag = () => {
    const newSubject = subjectInput.trim();
    if (newSubject && !subjects.includes(newSubject)) {
      setSubjects([...subjects, newSubject]);
      setSubjectInput("");
    }
  };

  const removeSubjectTag = (subjectToRemove) => {
    setSubjects(subjects.filter((subject) => subject !== subjectToRemove));
  };
  
  const handleSubjectKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSubjectTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const dataToSend = {
      ...form,
      subjects: subjects, // Use the state-managed subjects array
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
        setErrorMessage(data.message || "Registration failed");
      }
    } catch (err) {
      setErrorMessage("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen">
      {/* Background Image Section */}
      <div
        className="hidden md:block md:w-1/2 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://www.21kschool.com/th/wp-content/uploads/sites/2/2022/08/How-to-Cultivate-Environmental-Awareness-in-Schools-1.png')`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>
      
      {/* Registration Tab Section */}
      <div className="relative z-10 w-full md:w-1/2 flex justify-center items-center py-12 px-6 bg-white">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 tracking-wide drop-shadow-sm bg-gradient-to-r from-green-400 to-sky-500 bg-clip-text text-transparent">
              PlanetZero
            </h1>
            <p className="text-gray-600 font-medium">Create your account to get started.</p>
          </div>
          <Card className="p-6 bg-gray-50 shadow-2xl rounded-3xl border border-gray-200">
            <CardHeader>
              <CardTitle className="text-center text-3xl font-bold text-gray-800">
                Register
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                {errorMessage && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative" role="alert">
                    <span className="block sm:inline">{errorMessage}</span>
                  </div>
                )}
                
                {/* User Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input placeholder="First Name" name="firstName" onChange={handleChange} required />
                  <Input placeholder="Last Name" name="lastName" onChange={handleChange} />
                </div>
                <Input placeholder="Username" name="username" onChange={handleChange} required />
                <Input type="email" placeholder="Email" name="email" onChange={handleChange} required />
                <Input type="number" placeholder="Age" name="age" onChange={handleChange} />
                <Input placeholder="Standard" name="standard" onChange={handleChange} />
                <Input placeholder="School" name="school" onChange={handleChange} />
                
                {/* Interactive Subjects Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Subjects</label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      placeholder="Add a subject and press Enter" 
                      value={subjectInput}
                      onChange={handleSubjectInputChange}
                      onKeyDown={handleSubjectKeyDown}
                      className="flex-grow"
                    />
                    <Button type="button" onClick={addSubjectTag} className="shrink-0 bg-sky-500 hover:bg-sky-600">Add</Button>
                  </div>
                  {subjects.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {subjects.map((tag, index) => (
                        <div key={index} className="flex items-center space-x-1 p-2 bg-gray-200 rounded-full text-sm">
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeSubjectTag(tag)}
                            className="p-1 rounded-full hover:bg-gray-300 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Input type="password" placeholder="Password" name="password" onChange={handleChange} required />
                
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-xl shadow-lg transition-colors duration-200" disabled={loading}>
                  {loading ? "Registering..." : "Register"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
