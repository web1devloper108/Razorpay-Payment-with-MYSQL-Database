import React from 'react'
import { Box, Stack } from "@chakra-ui/react"
import Card from './Card'
import axios from "axios";


const Home = () => {

    const checkoutHandler = async (amount) => {
        const { data: { key } } = await axios.get("http://www.localhost:7000/api/getkey")
        const { data: { order } } = await axios.post("http://localhost:7000/api/checkout", { 
            amount
        })
        // console.log(data)    
        const options = {
            key,
            amount: order.amount,
            currency: "INR",
            name: "Payment",
            description: "for RazorPay", 
            order_id: order.id,
            callback_url: "http://localhost:7000/api/paymentverification", 
            prefill: {
                name: "Abc",  
                email: "abc@gmail.com",   
                contact: "------"
            }, 
            notes: {
                "address": "Razorpay Corporate Office"
            }, 
            theme: {
                "color": "#a36c4d"
            }
        };
        const razor = new window.Razorpay(options); 
        razor.open();
    } 
    // console.log(window)  
    return (
        <Box>
            <Stack h={"100vh"} alignItems="center" justifyContent="center" direction={["column", "row"]}>
                <Card amount={3000} img={"/product1.png"} checkoutHandler={checkoutHandler} />
                <Card amount={5000} img={"/product2.png"} checkoutHandler={checkoutHandler} />
            </Stack> 
        </Box>  
    )
}

export default Home