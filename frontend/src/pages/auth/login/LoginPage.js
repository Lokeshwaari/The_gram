import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
//import XSvg from "../../../components/svgs/X";

import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import {baseUrl} from "../../../constant/url.js";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "../../../components/common/LoadingSpinner.js";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const queryClient = useQueryClient();

	const {
		mutate: loginMutation,
		isPending,
		isError,
		error,
	} = useMutation({
		mutationFn: async ({ username, password }) => {
			try {
				const res = await fetch(`${baseUrl}/api/auth/login`, {
					method: "POST",
					credentials : "include",
					headers: {
						"Content-Type": "application/json",
					
						"Accept" : "application/json"
					},
					body: JSON.stringify({ username, password }),
				});

				const data = await res.json();

				if (!res.ok) 
					throw new Error(data.error || "Something went wrong");
					localStorage.setItem("token", data?.token)
				
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			// refetch the authUser
			toast.success("Login Successfully");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		loginMutation(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const buttonStyle = {
		backgroundColor: "blue",
		color: "white",
		padding: "10px 20px",
		border: "none",
		borderRadius: "5px",
		cursor: "pointer",
	  };


	return (
		<div className='max-w-screen-xl mx-auto flex h-screen'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				
			</div>
			
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
				
				
					<h1 className='text-4xl font-extrabold text-black'>The Gram</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
					<FaUser />
						<input
							type='text'
							className='grow'
							placeholder='username'
							name='username'
							onChange={handleInputChange}
							value={formData.username}
						/>
					</label>

					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<button style={buttonStyle} className='btn rounded-full  text-white'  >
						{isPending ? <LoadingSpinner /> : "Login"}
					</button>
					{isError && <p className='text-red-500'>{error.message}</p>}
				</form>
				<div className='flex flex-col gap-2 mt-4'>
					<p style={{color: "black" }} > Don't have an account </p>
					<Link to='/signup'>
						<button style={buttonStyle} className='btn rounded-full text-white btn-outline w-full' >Sign up</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;