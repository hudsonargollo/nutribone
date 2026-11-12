-- Guest checkout now links orders to passwordless customer accounts; they
-- sign in with the magic link emailed after the order and set a password later.
ALTER TABLE "Customer" ALTER COLUMN "passwordHash" DROP NOT NULL;
