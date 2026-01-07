"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeDecimal = (obj) => {
  const serialized = { ...obj };
  if (obj.balance) {
    serialized.balance = obj.balance.toNumber();
  }
  if (obj.amount) {
    serialized.amount = obj.amount.toNumber();
  }
  return serialized;
};

export async function getAccountWithTransactions(accountId) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const account = await db.account.findUnique({
    where: {
      id: accountId,
      userId: user.id,
    },
    include: {
      transactions: {
        orderBy: { date: "desc" },
      },
      _count: {
        select: { transactions: true },
      },
    },
  });

  if (!account) return null;

  return {
    ...serializeDecimal(account),
    transactions: account.transactions.map(serializeDecimal),
  };
}

export async function bulkDeleteTransactions(transactionIds) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    // Get transactions to calculate balance changes
    const transactions = await db.transaction.findMany({
      where: {
        id: { in: transactionIds },
        userId: user.id,
      },
    });

    // Defensive: log types for debugging (remove in production)
    // console.log("Fetched transactions:", transactions.map(t => ({ id: t.id, amount: t.amount, type: t.type, accountId: t.accountId })));

    // Group transactions by account to update balances
    // Ensure we treat amounts as numbers
    const accountBalanceChanges = transactions.reduce((acc, transaction) => {
      // Convert amount to a plain JS number. For Prisma Decimal use .toNumber()
      // If transaction.amount is already a number, this is harmless.
      const amt =
        typeof transaction.amount === "object" && typeof transaction.amount.toNumber === "function"
          ? transaction.amount.toNumber()
          : Number(transaction.amount);

      if (Number.isNaN(amt)) {
        throw new Error(`Invalid transaction amount for id=${transaction.id}`);
      }

      // Deleting an EXPENSE should increase the account balance (refund),
      // deleting an INCOME should decrease the balance.
      const change = transaction.type === "EXPENSE" ? amt : -amt;

      acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;
      return acc;
    }, {});

    // Delete transactions and update account balances in a transaction
    await db.$transaction(async (tx) => {
      // Delete transactions
      await tx.transaction.deleteMany({
        where: {
          id: { in: transactionIds },
          userId: user.id,
        },
      });

      // Update account balances — pass numeric values to increment
      for (const [accountId, balanceChange] of Object.entries(accountBalanceChanges)) {
        // Defensive: ensure balanceChange is a number
        const numericChange = Number(balanceChange);
        if (Number.isNaN(numericChange)) {
          throw new Error(`Invalid balance change for account ${accountId}: ${balanceChange}`);
        }

        await tx.account.update({
          where: { id: accountId },
          data: {
            balance: {
              increment: numericChange,
            },
          },
        });

        // revalidate the exact account page cache (optional - you also do this after tx)
        revalidatePath(`/account/${accountId}`);
      }
    });

    // revalidate dashboard and account pages so UI picks up change
    revalidatePath("/dashboard");
    // Note: individual accounts already revalidated inside the loop above

    return { success: true, details: accountBalanceChanges };
  } catch (error) {
    console.error("Bulk delete error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateDefaultAccount(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // First, unset any existing default account
    await db.account.updateMany({
      where: {
        userId: user.id,
        isDefault: true,
      },
      data: { isDefault: false },
    });

    // Then set the new default account
    const account = await db.account.update({
      where: {
        id: accountId,
        userId: user.id,
      },
      data: { isDefault: true },
    });

    revalidatePath("/dashboard");
    return { success: true, data: serializeDecimal(account) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
