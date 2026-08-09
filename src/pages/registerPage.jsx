import { useState } from "react";
import toast from "react-hot-toast";
import { BiKey } from "react-icons/bi";
import { BsGoogle } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useGoogleLogin } from "@react-oauth/google";

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const googleLogin = useGoogleLogin(
    {
      onSuccess: (response) => {

        console.log(response);

        api.post("/users/google-login", {
          accessToken: response.access_token
        }).then((res) => {

          console.log(res);
          localStorage.setItem("token", res.data.token)
          if (res.data.isAdmin) {
            navigate("/admin")
          } else {
            navigate("/")
          }

        }).catch((err) => {
          console.log(err);
        })
      },
      onError: (err) => {
        console.log(err);
      }
    }
  )



  async function handleRegister() {

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      await api.post("/users/", {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName
      })

      navigate("/login")

    } catch (err) {

      toast.error(err?.response?.data?.message || "Registration failed")

    }
    setLoading(false)
  }

  return (
    <div className="w-full h-full">
      <div className="w-full h-full bg-[url('/login-bg.jpg')] bg-cover bg-no-repeat flex justify-center items-center">

        <div className="w-[400px]  backdrop-blur-md shadow-2xl shadow-white rounded-xl flex flex-col p-4">

          <h1 className="w-full h-[80px] text-center text-3xl font-bold text-white">Register</h1>

          <div className="w-full ">
            <label className="text-white text-lg flex items-center  gap-2"><MdEmail /> Email</label>
            <input className="w-full h-[40px] rounded-md px-2 border border-white" type="email" placeholder="kasun@gmail.com"
              onChange={
                (e) => {
                  setEmail(e.target.value)
                }
              }
              value={email}
            />
          </div>
          <div className="w-full  mt-5 flex flex-row gap-2">
            <div className="w-1/2">
              <label className="text-white text-lg flex items-center  gap-2">First Name</label>
              <input className="w-full h-[40px] rounded-md px-2 border border-white" type="text" placeholder="Kasun"
                onChange={
                  (e) => {
                    setFirstName(e.target.value)
                  }
                }
                value={firstName}
              />
            </div>
            <div className="w-1/2">
              <label className="text-white text-lg flex items-center  gap-2">Last Name</label>
              <input className="w-full h-[40px] rounded-md px-2 border border-white" type="text" placeholder="Perera"
                onChange={
                  (e) => {
                    setLastName(e.target.value)
                  }
                }
                value={lastName}
              />
            </div>
          </div>
          <div className="w-full  mt-5">
            <label className="text-white text-lg flex items-center  gap-2"><BiKey /> Password</label>
            <input
              onChange={
                (e) => {
                  setPassword(e.target.value)
                }
              }
              type="password"
              value={password}
              className="w-full h-[40px] rounded-md px-2 border border-white" placeholder="•••••••••••" />
          </div>
          <div className="w-full  mt-5">
            <label className="text-white text-lg flex items-center  gap-2"><BiKey /> Confirm Password</label>
            <input
              onChange={
                (e) => {
                  setConfirmPassword(e.target.value)
                }
              }
              type="password"
              value={confirmPassword}
              className="w-full h-[40px] rounded-md px-2 border border-white" placeholder="•••••••••••" />
          </div>
          <button disabled={loading} className="w-full h-[50px] bg-accent mt-10 text-white rounded-lg" onClick={handleRegister}>
            {
              loading ? "Loading..." : "Register"
            }
          </button>
          <p className="w-full h-2 text-white text-right italic ">Already have an account? click <Link to="/login" className="font-bold text-accent">Here</Link> </p>
          <button onClick={googleLogin} className="w-full h-[50px] bg-secondary mt-5 text-white rounded-lg flex justify-center items-center gap-2"><BsGoogle /> Sign In with Google</button>
        </div>
      </div>
    </div>
  )
}
