import React, { useContext, useState, useEffect, createContext } from "react";
import axios from 'axios';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    // const BASE_URL = "http://localhost:4000/api/v1/";
    const BASE_URL = "https://crm-project-l0k8.onrender.com";
    const [customers, setCustomers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [id, setId] = useState(() => {
        // Initialize state with value from localStorage, if available
        return localStorage.getItem("userId") || "";
    });
    const [success, setSuccess] = useState(false);

    // ,{ headers: {'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}`}}
    
    useEffect(() => {
        // Persist id to localStorage whenever it changes
        if (id) {
            localStorage.setItem("userId", id);
        } else {
            localStorage.removeItem("userId");
        }
    }, [id]); // Runs whenever `id` changes
    const [isAuthenticated, setIsAuthenticated] = useState(!!id);
    const addCustomer = async (customer) => {
        try {
            console.log(`the customer at a  dd is ${customer}`);
            const response = await axios.post(`${BASE_URL}customers-add`,{"customer":customer},{ headers: {'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}`}});
              getCustomers();
        } catch (err) {
            setError(err.response.data.message);
        }
    };
    const updateCustomer = async (customer) => {
        try {
            console.log(`customer at update is: ${customer}`);
            const response = await axios.post(`${BASE_URL}customers-update/:id`,{"customer":customer},{ headers: {'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}`}});
              getCustomers();
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    const getCustomers = async () => {
        const response = await axios.get(`${BASE_URL}customers-get`,{ headers: {'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}`}});
        setCustomers(response.data);
    };

    const getCustomerById = async (id) => {
        const response = await axios.get(`${BASE_URL}customers-get`,{"id":id},{ headers: {'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}`}});
        setCustomers(response.data);
    };

    const deleteCustomer = async (id) => {
        await axios.delete(`${BASE_URL}customers-delete/${id}`,{ headers: {'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}`}});
        getCustomers();
    };

    const totalCustomers = () => {
        return customers.data.length;
    };

    const addOrder = async (customer) => {
        try {
            await axios.post(`${BASE_URL}orders`,{ headers: {'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}`}}, customer);
            getOrders();
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    const getOrders = async () => {
        const response = await axios.get(`${BASE_URL}orders`,{ headers: {'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}`}});
        setOrders(response.data);
        console.log(response.data);
    };

    const deleteOrder = async (id) => {
        await axios.delete(`${BASE_URL}orders/${id}`,{ headers: {'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}`}});
        getOrders();
    };

    const totalOrders = () => {
        return orders.data.length;
    };

    const login = async (customer) => {
        try {
            const response = await axios.post(`${BASE_URL}auth/login`, customer);
            localStorage.setItem('token',response.data.customer.token);
            setSuccess(response.data.success);
            const userId = response.data.customer._id;
            setId(userId);
            console.log(response.data.customer.token);
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    const signup = async (customer) => {
        try {
            const response = await axios.post(`${BASE_URL}auth/signup`, customer);
            return response;
        } catch (err) {
            setError(err.response.data.message);
        }
    };
    // const id =localStorage.getItem("userId") || ""
    const logout = async (id) => {
        if (!id) {
            console.error("The id value passed is undefined");
            return false;
        }
    try {
            const response = await axios.post(`${BASE_URL}auth/logout`,{"id":id},{ headers: {'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}`}});
            console.log(response);
            setId(""); // Clear the id state
            return true;
        } catch (err) {
            console.log(err);
        }
    };
    
    return (
        <GlobalContext.Provider
            value={{
                addCustomer,
                getCustomers,
                customers,
                deleteCustomer,
                orders,
                totalCustomers,
                addOrder,
                getOrders,
                deleteOrder,
                totalOrders,
                error,
                setError,
                login,
                logout,
                signup,
                success,
                setSuccess,
                id,
                setId,
                BASE_URL,
                isAuthenticated,
                setIsAuthenticated
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(GlobalContext);
};