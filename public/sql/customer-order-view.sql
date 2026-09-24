-- Run after northwind.sql and northwind-data.sql in MySQL Workbench.
USE northwind;

CREATE OR REPLACE VIEW customer_order_overview AS
SELECT
    c.id AS customer_id,
    c.company AS customer_company,
    o.id AS order_id,
    o.order_date AS order_date
FROM customers AS c
LEFT JOIN orders AS o
    ON o.customer_id = c.id;

SELECT customer_id, customer_company, order_id, order_date
FROM customer_order_overview
ORDER BY customer_id, order_id;
