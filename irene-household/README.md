# Irene Household Collections — order landing page

Static order page for Meta ads ("Order now" button). Customers pick seat covers or BnB essentials, enter their details and the order is emailed to the shop.

- `config.js` — set `orderEmail` to the address that should receive orders. While it is empty, orders open WhatsApp (`whatsapp` number) instead.
- `app.js` — product catalogue (names, sizes, prices, colours) and page logic.
- Orders are sent with [FormSubmit](https://formsubmit.co). The first order sent to a new email triggers a one-time confirmation email that must be clicked before orders arrive.

Deep links for ads: `/#seat-covers`, `/#bnb`.
