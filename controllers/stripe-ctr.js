//const express = require("express");
//const Stripe = require("stripe");
const { Users } = require('../schema/users');
const { PlanObj } = require('../schema/stripe');
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
const stripe = require('stripe')(process.env.STRIPE_KEY);
// const stripe = require("stripe")("sk_test_51KLgfSCUdBOA2rvxogtALgypfQN69NCVDHyVcglZm2g5lyXq7EblhBjAA884sKc4u6XP0EnAHO1eSDUbZ7YNGMuF00oSag2iJx");
// const product_1 = "price_1LXl7UCUdBOA2rvx8UxGY9Lq"
// const product_2 = "price_1LXxOmCUdBOA2rvxUJhsWNYm";
// const product_3 = "price_1LY2tXCUdBOA2rvxBESduLyC";

//check out session example
//app.post("/create_checkout_session", express.json({ type: 'application/json' }),
const createCheckoutSession = async (req, res) => {
   const { name, product_id } = req.body;
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            metadata: { product_id, name },
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
    const { session_id } = req.body;
    //authToken in headers
    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        const { subscription, metadata, customer } = session;
        try {
            //find user with authToken
            let { current_period_end, current_period_start } = await stripe.subscriptions.retrieve(subscription);
            const billingDate = new Date(new Date().getTime() - (current_period_end - current_period_start));
        
            const newPlanObj = await PlanObj.create({
                customer,
                billingDate,
                name: metadata.name,
                product_id: metadata.product_id,
                subscription
            });
            //create user.plan with newPlanObject as user property in database 
            //change user.role to newPlanObj.name
            try {
                let user = await Users.updateOne({_id:session_id},{$set:{role:req.body.role}},{
                   new:true
                 })
                 console.log(req.body.role); 
               } catch (e) {
                 console.log(e)
               }
               
            res.send({data: newPlanObj});
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
        const newPlanObj = await PlanObj.create({
            customer,
            billingDate,
            name: metadata.name,
            product_id: metadata.product_id,
            subscription:id
        });
        //update user.plan in database
        try {
            let newPlan = await PlanObj.updateOne({_id:req.params.id},{$set:{newPlanObj:req.body.newPlanObj}},{
               new:true
             })
             console.log(req.body.newPlanObj); 
           } catch (e) {
             console.log(e)
           }
        //update user.role in database
        
        res.send({data: newPlanObj});
    } catch (err) {
        res.status(500).send({ message: 'Internal server error' });
    }
}

//app.post("/get_customer_card_details", express.json({ type: 'application/json' }), 
const customerCardDetails = async (req, res) => {
    const { customer } = req.body;
    try {
        const cards = await stripe.customers.listPaymentMethods(
            customer,
            { type: 'card' }
        );
        let pm = cards.data[0].id;
        try {
            const paymentMethod = await stripe.paymentMethods.retrieve(pm);
            console.log(paymentMethod, 'cards')
            const { exp_month, exp_year, last4, brand } = paymentMethod.card;
            res.json({
                brand,
                exp_month,
                exp_year,
                last4
            })
        } catch (err) {
            console.log(err, "err")
            res.status(500).send({ message: 'Internal server error' });
        }
    } catch (err) {
        console.log(err, "err")
        res.status(500).send({ message: 'Internal server error' });
    }
}

//app.post("/update_customer_card_details", express.json({ type: 'application/json' }), 
const updateCustomerCard = async (req, res) => {
    const { customer, number, exp_month, exp_year, cvc } = req.body;
    try {
        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: { number, exp_month, exp_year, cvc }
        });
        try {
            const attached = await stripe.paymentMethods.attach(
                paymentMethod.id,
                {customer}
              );
​
            const resp = await stripe.customers.update(
                customer,
                {
                    invoice_settings:
                        { default_payment_method: paymentMethod.id }
                }
            );
            const { exp_month, exp_year, last4, brand } = paymentMethod.card;
            res.json({
                brand,
                exp_month,
                exp_year,
                last4
            })
        } catch (err) {
            console.log(err, "err")
            res.status(500).send({ message: 'Internal server error' });
        }

    } catch (err) {
        console.log(err, "err")
        res.status(500).send({ message: 'Internal server error' });
    }
}



//app.post('/webhook', express.raw({ type: 'application/json' }),
const webhooksHandler =  (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    }
    catch (err) {
        console.log(`Unhandled event type ${type}`);
        res.sendStatus(200)
    }
    const { type, data } = event;
    let { previous_attributes, object } = data;

    if (type === 'customer.subscription.updated' &&
        (previous_attributes.status === 'active' &&
            object.status === 'past_due') ||
        (type === 'customer.subscription.deleted' &&
            object.status !== 'active')) {
        //change user role and plan back to initial statet
        res.sendStatus(200)
    } else {
        console.log(`Unhandled event type ${type}`);
        res.sendStatus(200)
    }
}





module.exports = {
    createCheckoutSession,
    setUserPlan,
    unsubscribe,
    resubscribe,
    updateUsersPlan,
    updateCustomerCard,
    customerCardDetails,
    webhooksHandler
}