-- AlterTable
-- Converte tipos Float para Decimal para valores monetários e distâncias

-- Category.price: Float -> Decimal(10,2)
ALTER TABLE "Category" ALTER COLUMN "price" TYPE DECIMAL(10,2);

-- Payment.amount: Float -> Decimal(10,2)
ALTER TABLE "Payment" ALTER COLUMN "amount" TYPE DECIMAL(10,2);

-- Result.distance: Float -> Decimal(10,2)
ALTER TABLE "Result" ALTER COLUMN "distance" TYPE DECIMAL(10,2);
