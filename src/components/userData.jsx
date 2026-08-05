import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { CiLogin } from "react-icons/ci";

export default function UserData() {

    const [user, setUser] = useState(null);

    const [selectedOption, setSelectedOption] = useState("me");

    const navigate = useNavigate();

    useEffect(
        () => {
            const token = localStorage.getItem("token");

            if (token != null) {

                api.get("/users/me", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }).then((res) => {
                    setUser(res.data);
                }).catch((err) => {
                    console.log(err);
                    setUser(null);
                });

            }
        }
        , []
    )

    return (
        <>
            {
                user == null ? <div className="lg:flex ">
                    <Link to="/login" className="text-white hidden lg:block hover:text-gray-500">Login</Link>
                    <span className="text-white hidden lg:block"> | </span>
                    <Link to="/register" className="text-white hidden lg:block hover:text-gray-500">Register</Link>
                    <Link to="/login" className="h-full lg:hidden flex flex-col  justify-center items-center text-accent text-3xl  ">
                        <CiLogin />
                        <span className="text-sm text-accent">Login</span>
                    </Link>
                </div> :
                    <div className="text-white flex flex-col lg:flex-row justify-center items-center gap-2 lg:gap-4">
                        <img src={user.image} className="w-6 h-6 rounded-full inline-block mr-2" />
                        {/* <span className=" lg:hidden text-accent text-sm">{user.firstName}</span> */}
                        <select className="bg-transparent  text-sm text-accent lg:text-white text-center" value={selectedOption} onChange={
                            (e) => {
                                setSelectedOption(e.target.value);
                                if (e.target.value === "settings") {
                                    navigate("/settings");
                                }
                                if (e.target.value === "my-orders") {
                                    navigate("/my-orders");
                                }
                                if (e.target.value === "logout") {
                                    localStorage.removeItem("token");
                                    setUser(null);
                                    navigate("/");
                                }
                                setSelectedOption("me");
                            }
                        }>
                            <option value="me">{user.firstName}</option>
                            <option className="bg-accent text-white" value="settings">Settings</option>
                            <option className="bg-accent text-white" value="my-orders">My Orders</option>
                            <option className="bg-accent text-white" value="logout">Logout</option>
                        </select>
                    </div>
            }
        </>
    )
}