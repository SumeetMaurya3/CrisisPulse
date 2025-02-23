import React, { useRef, useState } from 'react';
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import "./sign-up.css";

export function SignUp() {
  const imgRef = useRef(null); // Ref for the img element
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    organizationName: "",
    organizationID: "",
  });
  const fileRef = useRef(null); // Ref for the file input element
  const uploadBtnRef = useRef(null); // Ref for the upload button element
  const [showManualForm, setShowManualForm] = useState(false); // State variable to control manual form visibility
  const [applyAsAuthority, setApplyAsAuthority] = useState(false); // State variable to control authority application

  // Function to handle mouse enter event
  const handleMouseEnter = () => {
    uploadBtnRef.current.style.display = "block";
  };

  const loginwithgoogle = ()=>{
    window.open("http://localhost:8080/auth/google/callback","_self")
}

  // Function to handle mouse leave event
  const handleMouseLeave = () => {
    uploadBtnRef.current.style.display = "none";
  };

  const handleRegister = async () => {
    if (formData.password === formData.confirmPassword) {
      try {
        const form = new FormData();
        form.append("email", formData.email);
        form.append("name", formData.name);
        form.append("password", formData.password);
        form.append("organizationName", formData.organizationName);
        form.append("organizationID", formData.organizationID);

        const avatarFile = fileRef.current.files[0];
        if (avatarFile) {
          form.append("avatar", avatarFile);
        }

        const response = await fetch("http://localhost:8080/auth/signup", {
          method: "POST",
          body: form,
        });

        if (response.ok) {
          console.log("Registration successful");
        } else {
          console.log("Registration failed");
        }
      } catch (error) {
        console.error("Error during registration:", error);
      }
    } else {
      console.log("Different Password and Confirm Password");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to handle file change event
  const handleFileChange = (event) => {
    const choosedFile = event.target.files[0];

    if (choosedFile) {
      const reader = new FileReader();
      
      reader.addEventListener('load', function(){
        imgRef.current.src = reader.result;
      });

      reader.readAsDataURL(choosedFile);
    }
  };

  return (
    <section className="m-8 flex">
      <div className="w-2/5 h-full hidden lg:block">
        <img
          ref={imgRef}
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Join Us Today</Typography>
        </div>
        {!showManualForm && (
          <div className="mb-4">
            <Button className="applymanual" onClick={() => setShowManualForm(true)}>Apply Manually</Button>
          </div>
        )}
        {showManualForm && (
          <form className="mt-2 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
            <div className="manualform">
              <div className="avatar">
                <div className="profile-pic-div" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  <img src="https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg" id="photo" ref={imgRef}/>
                  <input type="file" id="file" required ref={fileRef} onChange={handleFileChange}/>
                  <label htmlFor="file" id="uploadBtn" ref={uploadBtnRef}>Choose Photo</label>
                </div>
              </div>
              <div className="mb-1 mt-32 flex flex-col gap-6">
                <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                  Email
                </Typography>
                <Input
                  size="lg"
                  placeholder="name@mail.com"
                  name="email"
                  required 
                  onChange={(e)=>handleInputChange(e)}
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>
              <div className="mb-1 flex flex-col gap-6">
                <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                  Name
                </Typography>
                <Input
                  size="lg"
                  placeholder="Your Name"
                  name="name"
                  required
                  onChange={(e)=>handleInputChange(e)}
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>
              <div className="mb-1 flex flex-col gap-6">
                <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                  Password
                </Typography>
                <Input
                  size="lg"
                  placeholder="Your password"
                  name="password"
                  onChange={(e)=>handleInputChange(e)}
                  required
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>
              <div className="mb-1 flex flex-col gap-6">
                <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                  Confirm Password
                </Typography>
                <Input
                  size="lg"
                  name='confirmPassword'
                  placeholder="name@mail.com"
                  required
                  onChange={(e)=>handleInputChange(e)}
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>
              <Checkbox
                label={
                  <Typography
                    variant="small"
                    color="gray"
                    className="flex items-center justify-start font-medium"
                  >
                    Apply as an&nbsp;
                    <a
                      href="#"
                      className="font-normal text-black transition-colors hover:text-gray-900 underline"
                    >
                      Authority
                    </a>
                  </Typography>
                }
                containerProps={{ className: "-ml-2.5" }}
                checked={applyAsAuthority}
                onChange={() => setApplyAsAuthority(!applyAsAuthority)}
              />
              {applyAsAuthority && (
                <>
                  <div className="mb-1 flex flex-col gap-6">
                    <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                      Organization Name
                    </Typography>
                    <Input
                      size="lg"
                      placeholder="Organization Name"
                      onChange={(e)=>handleInputChange(e)}
                      name="organizationName"
                      required
                      className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                    />
                  </div>
                  <div className="mb-1 flex flex-col gap-6">
                    <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                      Organization ID
                    </Typography>
                    <Input
                      size="lg"
                      placeholder="Organization ID"
                      name="organizationID"
                      onChange={(e)=>handleInputChange(e)}
                      required
                      className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                    />
                  </div>
                </>
              )}
              <Button className="mt-6" fullWidth onClick={()=>handleRegister()}>
                Register Now
              </Button>
            </div>
          </form>
        )}
        <div className="space-y-4 mt-8">
          <Button size="lg" color="white" className="flex items-center gap-2 justify-center shadow-md" fullWidth>
            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_1156_824)">
                <path d="M16.3442 8.18429C16.3442 7.64047 16.3001 7.09371 16.206 6.55872H8.66016V9.63937H12.9813C12.802 10.6329 12.2258 11.5119 11.3822 12.0704V14.0693H13.9602C15.4741 12.6759 16.3442 10.6182 16.3442 8.18429Z" fill="#4285F4" />
                <path d="M8.65974 16.0006C10.8174 16.0006 12.637 15.2922 13.9627 14.0693L11.3847 12.0704C10.6675 12.5584 9.7415 12.8347 8.66268 12.8347C6.5756 12.8347 4.80598 11.4266 4.17104 9.53357H1.51074V11.5942C2.86882 14.2956 5.63494 16.0006 8.65974 16.0006Z" fill="#34A853" />
                <path d="M4.16852 9.53356C3.83341 8.53999 3.83341 7.46411 4.16852 6.47054V4.40991H1.51116C0.376489 6.67043 0.376489 9.33367 1.51116 11.5942L4.16852 9.53356Z" fill="#FBBC04" />
                <path d="M8.65974 3.16644C9.80029 3.1488 10.9026 3.57798 11.7286 4.36578L14.0127 2.08174C12.5664 0.72367 10.6469 -0.0229773 8.65974 0.000539111C5.63494 0.000539111 2.86882 1.70548 1.51074 4.40987L4.1681 6.4705C4.8001 4.57449 6.57266 3.16644 8.65974 3.16644Z" fill="#EA4335" />
              </g>
              <defs>
                <clipPath id="clip0_1156_824">
                  <rect width="16" height="16" fill="white" transform="translate(0.5)" />
                </clipPath>
              </defs>
            </svg>
            <span onClick={()=>loginwithgoogle()}>Sign in With Google</span>
          </Button>
        </div>
        <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
          Already have an account?
          <Link to="/auth/sign-in" className="text-gray-900 ml-1">Sign in</Link>
        </Typography>
      </div>
    </section>
  );
}

export default SignUp;
