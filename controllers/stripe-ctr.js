const express = require("express");
const Stripe = require("stripe");
const { Users } = require('../schema/stripe.js');


require("dotenv").config();

const stripe = Stripe(process.env.STRIPE_KEY);
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;



//const stripe = require("stripe")("sk_test_51KLgfSCUdBOA2rvxogtALgypfQN69NCVDHyVcglZm2g5lyXq7EblhBjAA884sKc4u6XP0EnAHO1eSDUbZ7YNGMuF00oSag2iJx");
// const product_1 = "price_1LXl7UCUdBOA2rvx8UxGY9Lq"
// const product_2 = "price_1LXxOmCUdBOA2rvxUJhsWNYm";
// const product_3 = "price_1LY2tXCUdBOA2rvxBESduLyC";

//check out session example
//app.post("/create_checkout_session", express.json({ type: 'application/json' }),
const createCheckoutSession = async (req, res) => {
    console.log("fires", req?.body)
    if (!req.body) res.status(500).json({ error: "No body" });

    const { title, product_id } = req.body
    // const title = "bronze"
    // const product_id = product_;
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "subscription",
            metadata: { product_id, title },
            line_items: [{
                price: product_id,
                quantity: 1,
            }],
            success_url: `${process.env.CLIENT_URL}/settings?session_id={CHECKOUT_SESSION_ID}&tab=plan`,
            cancel_url: `${process.env.CLIENT_URL}/settings?tab=plan`
        })
        return res.send({ url: session.url });
    } catch (err) {
        res.status(422).send(`Payment creation error: ${err.message}`);
    }
}

// update user plan according to authToken and sessionId

//app.post("/set_user_plan", express.json({ type: 'application/json' }), 
const setUserPlan = async (req, res) => {
    // console.log(req.body, "reqest body")
    const { session_id } = req.body;
    //authToken in headers
    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        const { subscription, metadata, customer } = session;
        //find user by authToken
        try {
            //find user with authToken
            let { current_period_end, current_period_start } = await stripe.subscriptions.retrieve(subscription);
            const billingDate = new Date(new Date().getTime() - (current_period_end - current_period_start));
        
            const newPlanObj = await Users.create({
                customer,
                billingDate,
                name: metadata.name,
                product_id: metadata.product_id,
                subscription
            });
            //create user.plan with newPlanObject as user property in database 
            //change user.role to newPlanObj.name
            res.json(newPlanObj)
        } catch (error) {
            res.status(500).send({ message: 'Internal server error' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Internal server error' });
    }
}

//app.put("/unsubscribe", express.json({ type: 'application/json' }), 
const unsubscribe = async (req, res) => {
    const { subscription } = req.body;
    //authToken in headers
    try {
        let status = await stripe.subscriptions.update(subscription, {
            cancel_at_period_end: true,
        });
        //add canceled: true to user.plan
        res.json(status)
    } catch (err) {
        res.status(500).send({ message: 'Internal server error' });
    }
}
 
//app.delete("/resubscribe",  express.json({ type: 'application/json' }), 
const resubscribe = async (req, res) => {
    const { subscription } = req.body;
    //authToken in headers
    try {
        let status = await stripe.subscriptions.update(subscription, {
            cancel_at_period_end: false,
        });
        //remove canceled: true from user.plan
        return res.json(status)
    } catch (err) {
        res.status(500).send({ message: 'Internal server error' });
    }
}

//app.put("/update_user_plan",  express.json({ type: 'application/json' }),
const  updateUsersPlan = async (req, res) => {
    const { subscription, name, product_id } = req.body;
    //authToken in headers
    try {
        const subscriptionObj = await stripe.subscriptions.retrieve(subscription);
        let response = await stripe.subscriptions.update(subscription, {
            metadata: { name, product_id },
            items: [{
                id: subscriptionObj.items.data[0].id,
                price: product_id,
            }]
        });
​
        let { current_period_end, current_period_start, metadata, customer, id } = response;
        const billingDate = new Date(new Date().getTime() - (current_period_end - current_period_start));
        const newPlanObj = await Users.create({
            customer,
            billingDate,
            name: metadata.name,
            product_id: metadata.product_id,
            subscription:id
        });
        //update user.plan in database
        //update user.role in database
        res.json(newPlanObj)
    } catch (err) {
        res.status(500).send({ message: 'Internal server error' });
    }
}


// const updateSubscription = async () => {
//     const session_id = "cs_test_a1zpzNXDAG2bDefawoEzFPGqutjqaBRalW6nqdRyBJg5bA5AuGJbSoS8w8";
//     const session = await stripe.checkout.sessions.retrieve(session_id);
//     const { subscription } = session;
// }

// updateSubscription();


//app.post('/webhook', express.raw({ type: 'application/json' }),
const webhooksHandler =  (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    }
    catch (err) {
    }
    const { type, data } = event;
    let { previous_attributes, object } = data
    if (type === "customer.subscription.updated") {
        let customer_id = object.customer;
        let product_id = object.plan.product;
        console.log(customer_id, "customer", product_id, "product_ID")
        if (previous_attributes.status === 'active' &&
            object.status === 'past_due') {
            const subId = object.id;
            console.log(subId + " is past due date");
            console.log(customer_id, "customer_id", product_id, "product-id");
        }
        res.sendStatus(200)
    } else {
        console.log(`Unhandled event type ${type}`);
        res.sendStatus(200)
    }

}


// const getCardDetails = async () => {
    //update card details
    // const cards = await stripe.customers.listSources(
    //     "cus_MGUjxAmcLoaT0I",
    //     { object: 'card', limit: 3 }
    // );
    // const card = await stripe.customers.updateSource(
    //     customer,
    //     {name: 'Jenny Rosen'}
    //   );
    //   console.log(card, "card")
// }




module.exports = {
    createCheckoutSession,
    setUserPlan,
    unsubscribe,
    resubscribe,
    updateUsersPlan,
    webhooksHandler
}