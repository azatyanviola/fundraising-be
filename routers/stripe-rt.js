const stripeRouter = require('express').Router();
const {
       createCheckoutSession,
       setUserPlan,
       unsubscribe,
       resubscribe,
       updateUsersPlan,
       customerCardDetails,
       updateCustomerCard,
       webhooksHandler } = require('../controllers/stripe-ctr');


stripeRouter.post('/create_checkout_session', createCheckoutSession);
stripeRouter.post('/set_user_plan', setUserPlan);
stripeRouter.put('/unsubscribe', unsubscribe);
stripeRouter.delete('/resubscribe', resubscribe);
stripeRouter.put('/update_user_plan', updateUsersPlan);
stripeRouter.post('/webhook', webhooksHandler);
stripeRouter.get('/get_customer_card_details', customerCardDetails);
stripeRouter.put('/update_customer_card_details', updateCustomerCard);



module.exports = stripeRouter;
