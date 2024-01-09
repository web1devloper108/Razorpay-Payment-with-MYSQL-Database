# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.


#### Integrate With Node.js SDK
#Create a Razorpay account
#Log in to the Razorpay Dashboard and generate the API keys 
# Build Integration
 npm i razorpay



# config- 
1 config.env  -
PORT ,RAZORPAY_API_KEY,RAZORPAY_APT_SECRET,MONGO_URI
2 database.js-
const connection, export const "connectDB"

# app.js
aap

## Razorpay Instance
# server.js

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_APT_SECRET,
});

connectDB();
app.listen



## Create an Order in Server
#For generate orders on server-side :
# controller- paymentController.js
#Order creation-
import { instance } from "../server.js";
import crypto from "crypto";
import { Payment } from "../models/paymentModel.js";
export const checkout = async (req, res) => {
  const options = {
    amount: Number(req.body.amount * 100),
   
    currency: "INR",
  };
  const order = await instance.orders.create(options);
console.log(order)
  res.status(200).json({
    success: true, 
    order, 
  });
}; 
# routes paymentRoutes.js
import express from "express";
import {
  checkout,
  paymentVerification,
} from "../controllers/paymentController.js";
const router = express.Router();
router.route("/checkout").post(checkout);
export default router; 

---------------------------------------------------------------
# frontend 

#Home.js 

    1 const checkoutHandler = async (amount) => {
        const { data: { key } } = await axios.get("http://www.localhost:7000/api/getkey")
        const { data: { order } } = await axios.post("http://localhost:7000/api/checkout", { 
            amount
        })}
        2
    return (
        <Box>
            <Stack h={"100vh"} alignItems="center" justifyContent="center" direction={["column", "row"]}>
                <Card amount={5000} img={"https://cdn.shopify.com/s/files/1/1684/4603/products/MacBookPro13_Mid2012_NonRetina_Silver.png"} checkoutHandler={checkoutHandler} />
                <Card amount={3000} img={"http://i1.adis.ws/i/canon/eos-r5_front_rf24-105mmf4lisusm_32c26ad194234d42b3cd9e582a21c99b"} checkoutHandler={checkoutHandler} />
            </Stack> 
        </Box> )
#Card.jsx
const Card = ({ amount, img, checkoutHandler }) => {
    <!-- return (
        <VStack>
            <Image src={img} boxSize={"64"} objectFit="cover" />
            <Text>₹{amount}</Text>
            <Button onClick={() => checkoutHandler(amount)}>Buy Now</Button>
        </VStack>
    ) -->

## Add Checkout Options
# paymentController 

Note- public-index.html - add this - 
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script> 

#home.jsx , 
# Handler Function (JS) Checkout Code-

        const options = {
            key,
            amount: order.amount,
            currency: "INR",
            name: "name",
            description: "for RazorPay", 
            image: "https://avatars.githubusercontent.com/u/25058652?v=4",  
            order_id: order.id,
            callback_url: "http://localhost:7000/api/paymentverification",
            prefill: {
                name: "Raj", 
                email: "raj.as@gmail.com",
                contact: "9636456789"
            }, 
            notes: {
                "address": "Razorpay Corporate Office"
            },
            theme: {
                "color": "#121212"
            }
        };
        const razor = new window.Razorpay(options); 
        razor.open();
    } 

## Handle Payment Success and Failure
1 On Payment Success 2 On Payment Failure

# On Payment Success
#Success/Failure Handling Code (Checkout with Handler Function)
(send)
"handler": function (response){
    alert(response.razorpay_payment_id);
    alert(response.razorpay_order_id);
    alert(response.razorpay_signature)}

# Store Fields in Server
(store /recive)
{
 "razorpay_payment_id": "pay_29QQoUBi66xm2f",
 "razorpay_order_id": "order_9A33XWu170gUtm",
  "razorpay_signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
}
1 razorpay_payment_id - string Unique identifier for the payment returned by Checkout only for successful payments.
2 razorpay_order_id - string Unique identifier for the order returned by Checkout.
3 razorpay_signature string Signature returned by the Checkout. This is used to verify the payment.

## Verify Payment Signature
 1Create a signature in your server using the following attributes:
order_---Retrieve the order_id from your server. Do not use the razorpay_order_id returned by checkout.
razorpay_payment_id	---Returned during checkout.
key_secret	--- Available in your server. The key_secret that was generated from the Razorpay Dashboard .

 export const paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
    .update(body.toString()) 
    .digest("hex");  

  const isAuthentic = expectedSignature === razorpay_signature;       
           
  if (isAuthentic) {
    // Database comes here

    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    res.redirect(
      `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
    );
  } else { 
    res.status(400).json({ 
      success: false, 
    });
  }
};

# 
If the signature you generate on your server matches the razorpay_signature returned to you by the checkout, the payment received is from an authentic source.

## frontend 
# PaymentSuccess.js

const PaymentSuccess = () => {

    const seachQuery = useSearchParams()[0]

    const referenceNum = seachQuery.get("reference")
    return (
        <Box>
            <VStack h="100vh" justifyContent={"center"}>

                <Heading textTransform={"uppercase"}> Order Successfull</Heading>

                <Text>
                    Reference No.{referenceNum}
                </Text>

            </VStack>
        </Box>
    )
}

### frontend dependencies are

npm install  
   "@chakra-ui/react": "^2.8.2",
    "@emotion/react": "^11.11.3",
    "@emotion/styled": "^11.11.0",
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^1.6.2",
    "framer-motion": "^10.16.16",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.1", 
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"  

###  backend / serverside dependencies are 

    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "mongoose": "^8.0.3",
    "nodemon": "^3.0.2",
    "razorpay": "^2.9.2" 

    
















<!-- # Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify) -->
