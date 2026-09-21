import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma/client"
import { faker } from "@faker-js/faker"
import { hashPassword } from "better-auth/crypto"

const prisma = new PrismaClient()

const ROLES = ["ADMIN", "MEMBER", "GUEST"] as const
const TRANSACTION_STATUSES = ["PENDING", "COMPLETED", "FAILED", "REFUNDED"] as const
const CURRENCIES = ["INR", "USD", "EUR", "GBP"] as const
const AUDIT_ACTIONS = [
  "LOGIN",
  "LOGOUT",
  "CREATE_TRANSACTION",
  "UPDATE_PROFILE",
  "UPDATE_ROLE",
  "PASSWORD_RESET",
  "EMAIL_VERIFIED",
] as const

async function main() {
  console.log("🌱 Seeding database...")
  console.log("   Clearing existing data...")

  // Clear existing data in correct order (respecting FK constraints)
  await prisma.emailLog.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.verification.deleteMany()
  await prisma.user.deleteMany()

  console.log("   ✅ Cleared existing data")

  const hashedPassword = await hashPassword("password123")

  // 1. Create Admin User
  const adminUser = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      emailVerified: true,
      role: "ADMIN",
      accounts: {
        create: {
          accountId: "admin-account-1",
          providerId: "credential",
          password: hashedPassword,
        },
      },
    },
  })
  console.log("   👤 Created admin: admin@example.com")

  // 2. Create Regular Users
  const users = [adminUser]
  for (let i = 0; i < 14; i++) {
    const role = faker.helpers.arrayElement(ROLES)
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const name = `${firstName} ${lastName}`
    const email = faker.internet.email({ firstName, lastName }).toLowerCase()

    const user = await prisma.user.create({
      data: {
        name,
        email,
        emailVerified: faker.datatype.boolean(0.8),
        role,
        image: faker.image.avatar(),
        createdAt: faker.date.past({ years: 1 }),
        accounts: {
          create: {
            accountId: `account-${i + 2}`,
            providerId: "credential",
            password: hashedPassword,
          },
        },
      },
    })
    users.push(user)
  }
  console.log(`   ✅ Created ${users.length} users`)

  // 3. Create Transactions
  let transactionCount = 0
  for (const user of users) {
    const numTransactions = faker.number.int({ min: 2, max: 8 })
    for (let j = 0; j < numTransactions; j++) {
      await prisma.transaction.create({
        data: {
          userId: user.id,
          amount: parseFloat(faker.finance.amount({ min: 500, max: 45000, dec: 2 })),
          currency: faker.helpers.arrayElement(CURRENCIES),
          description: faker.commerce.productName(),
          status: faker.helpers.arrayElement(TRANSACTION_STATUSES),
          category: faker.helpers.arrayElement([
            "PURCHASE",
            "SUBSCRIPTION",
            "REFUND",
            "TRANSFER",
            "HARDWARE",
          ]),
          createdAt: faker.date.recent({ days: 90 }),
        },
      })
      transactionCount++
    }
  }
  console.log(`   ✅ Created ${transactionCount} transactions`)

  // 4. Create Audit Logs
  let auditLogCount = 0
  for (const user of users) {
    const numLogs = faker.number.int({ min: 3, max: 10 })
    for (let k = 0; k < numLogs; k++) {
      const action = faker.helpers.arrayElement(AUDIT_ACTIONS)
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action,
          target: action.includes("ROLE") ? `Role -> ${user.role}` : undefined,
          ipAddress: faker.internet.ip(),
          metadata: JSON.stringify({
            userAgent: faker.internet.userAgent(),
            timestamp: new Date().toISOString(),
          }),
          createdAt: faker.date.recent({ days: 60 }),
        },
      })
      auditLogCount++
    }
  }
  console.log(`   ✅ Created ${auditLogCount} audit logs`)

  // 5. Create Email Logs
  let emailLogCount = 0
  for (let m = 0; m < 30; m++) {
    const randomUser = faker.helpers.arrayElement(users)
    await prisma.emailLog.create({
      data: {
        recipient: randomUser.email,
        subject: faker.helpers.arrayElement([
          "Welcome to TechStore!",
          "Your Order Confirmation",
          "Account Security Alert",
          "Password Reset Request",
        ]),
        status: faker.helpers.arrayElement(["SENT", "DELIVERED", "BOUNCED"]),
        resendId: `msg_${faker.string.alphanumeric(16)}`,
        createdAt: faker.date.recent({ days: 30 }),
      },
    })
    emailLogCount++
  }
  console.log(`   ✅ Created ${emailLogCount} email logs`)

  console.log("\n🎉 Seeding complete!")
  console.log(`   Users:        ${users.length}`)
  console.log(`   Transactions: ${transactionCount}`)
  console.log(`   Audit Logs:   ${auditLogCount}`)
  console.log(`   Email Logs:   ${emailLogCount}`)
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
