import { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthContext } from "../../Context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logInUser, googleSignIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const from = location.state?.from?.pathname || "/";

  // Helper: Save user to backend without overwriting admin role
  const saveUser = async (user) => {
    try {
      // Check if user exists
      const existingRes = await fetch(`${import.meta.env.VITE_API_URL}/users/${user.email}`);
      const existingData = await existingRes.json();

      let roleToSave = "user";
      if (existingData.success && existingData.user.role === "admin") {
        roleToSave = "admin"; // preserve admin
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.displayName || user.name,
          email: user.email,
          photoURL: user.photoURL || "",
          role: roleToSave,
        }),
      });

      const data = await res.json();
      if (!data.success) console.error("❌ Failed to save user:", data.message);
    } catch (err) {
      console.error("❌ Error saving user:", err);
    }
  };

  // Handle email/password login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const result = await logInUser(email, password);
      const user = result.user;
      console.log("✅ Logged in:", user);

      // Save user to backend and preserve role
      await saveUser(user);

      form.reset();
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error.message);
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const result = await googleSignIn();
      const user = result.user;
      console.log("✅ Google login:", user);

      // Save user to backend and preserve role
      await saveUser(user);

      navigate(from, { replace: true });
    } catch (error) {
      console.error(error.message);
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-10 px-4">
      <div className="card bg-base-100 w-full max-w-sm shadow-xl">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center mb-6">Login Now</h1>

          {errorMsg && <p className="text-red-500 text-sm mb-2">{errorMsg}</p>}

          <form onSubmit={handleLogin} className="form-control w-full space-y-3">
            <div>
              <label className="label font-medium">Email</label>
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                className="input border border-[#8A4771] w-full"
              />
            </div>

            <div>
              <label className="label font-medium">Password</label>
              <input
                type="password"
                name="password"
                required
                placeholder="Enter your password"
                className="input border border-[#8A4771] w-full"
              />
            </div>

            <div className="text-right">
              <a href="#" className="text-sm text-red-500 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-block bg-white text-[#5F2DED] font-bold border border-[#5F2DED] hover:bg-[#5F2DED] hover:text-white transition duration-200"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

            <p className="text-sm text-center">
              New to this site?{" "}
              <Link
                to="/register"
                className="text-[#5F2DED] font-semibold underline hover:no-underline"
              >
                Register here
              </Link>
            </p>
          </form>

          <div className="divider">OR</div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="btn btn-block bg-white text-black border border-[#e5e5e5] hover:shadow-md transition duration-200"
          >
            <svg
              aria-label="Google logo"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <g>
                <path d="M0 0H512V512H0" fill="#fff" />
                <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341" />
                <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57" />
                <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73" />
                <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55" />
              </g>
            </svg>
            <span className="ml-2">{loading ? "Logging in..." : "Login with Google"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
