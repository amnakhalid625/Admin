import { Link } from "react-router-dom";
import StatsCard from "../components/Dashboard/StatesCard";
import Charts from "../components/Dashboard/Chart.jsx";
import { toast } from "react-hot-toast";
import {
    FiUsers,
    FiShoppingCart,
    FiPackage,
    FiTag,
    FiPlus,
} from "react-icons/fi";
import ProductTable from "../components/Products/ProductsTable";
import useProducts from "../hooks/useProducts";
import { useGetAdminStats } from "../api/internal.jsx";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {
    const { getAdminStats, loading, error } = useGetAdminStats();
    const [stats, setStats] = useState(null);

    // ✅ FIX: Get auth state correctly according to your slice structure
    const authState = useSelector((state) => state.auth);
    const user = {
        id: authState.id,
        name: authState.name,
        email: authState.email,
        role: authState.role
    };

    const {
        data,
        globalFilter,
        setGlobalFilter,
        rowSelection,
        setRowSelection,
        handleEditProduct,
        handleDeleteProduct,
    } = useProducts();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                console.log('Fetching dashboard stats...');
                console.log('Current auth state:', authState);
                
                const data = await getAdminStats();
                console.log('Dashboard stats received:', data);
                setStats(data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
                toast.error(error.message || 'Failed to fetch dashboard stats');
                setStats({});
            }
        };

        fetchStats();
    }, [getAdminStats]);

    const dashboardstats = [
        {
            title: "Total Users",
            value: stats?.totalUsers || 0,
            icon: <FiUsers />,
            bgColor: "bg-green-500",
            trend: "+12%",
            trendUp: true,
        },
        {
            title: "Total Orders",
            value: stats?.totalOrders || 0,
            icon: <FiShoppingCart />,
            bgColor: "bg-blue-500",
            trend: "+8%",
            trendUp: true,
        },
        {
            title: "Total Products",
            value: stats?.totalProducts || 0,
            icon: <FiPackage />,
            bgColor: "bg-purple-500",
            trend: "+5%",
            trendUp: true,
        },
        {
            title: "Total Category",
            value: stats?.totalCategories || 0,
            icon: <FiTag />,
            bgColor: "bg-red-500",
            trend: "0%",
            trendUp: false,
        },
    ];

    // Show loading state
    if (loading && stats === null) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-lg text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    // Show error state if stats couldn't be fetched
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center bg-red-50 p-8 rounded-lg">
                    <div className="text-red-500 text-4xl mb-4">🚫</div>
                    <h2 className="text-xl font-semibold text-red-700 mb-2">Access Denied</h2>
                    <p className="text-red-600 mb-4">{error}</p>
                    <p className="text-sm text-gray-600">
                        Please make sure you're logged in as an admin. 
                        Current role: {user.role || 'Not logged in'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Welcome,{" "}
                            <span className="text-blue-600">
                                {user.name || user.email || 'Admin'}
                            </span>
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Role: <span className="font-semibold">{user.role || 'Unknown'}</span>
                        </p>
                        <p className="text-gray-600">
                            Here's what's happening on your store today.
                        </p>
                        <Link
                            to="/products/add"
                            className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <FiPlus size={20} />
                            Add Product
                        </Link>
                    </div>
                    <div className="hidden lg:block">
                        <img
                            src="/api/placeholder/300/200"
                            alt="Dashboard illustration"
                            className="w-64"
                        />
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardstats.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            {/* Debug Info */}
            {process.env.NODE_ENV === 'development' && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                <strong>Debug Info:</strong> 
                                {' '}User: {JSON.stringify(user)} | 
                                {' '}Authenticated: {authState.isAuthenticated ? 'Yes' : 'No'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Products Section */}
            <div className="bg-white rounded-lg shadow-sm">
                <ProductTable
                    data={data}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    rowSelection={rowSelection}
                    setRowSelection={setRowSelection}
                    onEditProduct={handleEditProduct}
                    onDeleteProduct={handleDeleteProduct}
                />
            </div>

            {/* Charts Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <Charts />
            </div>
        </div>
    );
};

export default Dashboard;