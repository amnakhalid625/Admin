import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAdminLogin } from "../api/internal";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { login as setAuth } from "../Store/authSlice";
import { useNavigate, useLocation } from "react-router-dom";

export default function ClassyShopLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);

    const { error, loading, adminLogin } = useAdminLogin();
    const authState = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect agar already logged in
    useEffect(() => {
        if (authState.id) {
            const from = location.state?.from?.pathname || "/dashboard";
            navigate(from, { replace: true });
        }
    }, [authState.id, navigate, location]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            return toast.error("Please fill all the fields!");
        }

        try {
            const data = await adminLogin(email, password);

            if (data && data.user) {
                dispatch(setAuth({
                    ...data.user,
                    role: data.user.role || 'admin'
                }));
                
                toast.success("Admin login successful!");
                
                // Redirect to intended page or dashboard
                const from = location.state?.from?.pathname || "/dashboard";
                navigate(from, { replace: true });
            }
        } catch (err) {
            console.error('Login error:', err);
            toast.error(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="min-h-max bg-gray-50">
            <main className="flex items-center justify-center px-4 py-16">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="mb-4">
                            <div className="inline-flex items-center gap-1 text-4xl mb-2">
                                <span className="w-3 h-3 bg-gray-700 rounded-full"></span>
                                <span className="w-3 h-3 bg-gray-700 rounded-full"></span>
                                <span className="w-3 h-3 bg-gray-700 rounded-full"></span>
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Admin Login
                        </h2>
                        <p className="text-xl text-gray-900">
                            Sign in with your admin credentials.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                                placeholder="admin@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember Me
                                </label>
                            </div>
                            <div className="text-sm">
                                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                    Forgot Password?
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Need an admin account?</span>
                            <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                                Sign Up
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-400"
                        >
                            {loading ? "Signing In..." : "ADMIN SIGN IN"}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}