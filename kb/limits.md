\# Card \& Amount Limits



\## Limits Exceeded



\### LIMIT\_EXCEEDED

\*\*Causes\*\*

\- Amount > issuer limit

\- Velocity rules



\*\*Resolution Steps\*\*

1\. Suggest ACH/Wire

2\. Split into partial payments if allowed

3\. Retry using an alternate method



\*\*Agent Script\*\*

> The amount exceeds the card’s limit. We can switch to ACH/Wire or split the payment.



