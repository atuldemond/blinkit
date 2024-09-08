const express = require("express");
const { paymentModel } = require("../models/payment");
const router = express.Router();

router.get("/:orderid/:paymentid/:signature", async (req, res) => {
  let paymentDetails = await paymentModel.findOne({
    orderId: req.params.orderid,
  });

  console.log(req.params.orderid);
  console.log(paymentDetails);

  if (paymentDetails) {
    res.send(`
        <html>
          <head>
            <script>
              setTimeout(function() {
                window.location.href = '/';
              }, 4000);
            </script>
          </head>
          <body>
            <h1>Payment Successful! Redirecting to the home page...</h1>
          </body>
        </html>
      `);
  } else {
    res.send("Payment Failed");
  }
});

module.exports = router;
