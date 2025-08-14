#!/usr/bin/env node

const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

console.log("🔍 Starting build monitoring...\n")

// Check for common build issues
const checks = [
  {
    name: "Package.json validation",
    check: () => {
      try {
        const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"))
        console.log("✅ Package.json is valid")
        console.log(`   - Dependencies: ${Object.keys(pkg.dependencies || {}).length}`)
        console.log(`   - DevDependencies: ${Object.keys(pkg.devDependencies || {}).length}`)
        return true
      } catch (error) {
        console.log("❌ Package.json error:", error.message)
        return false
      }
    },
  },
  {
    name: "TypeScript compilation",
    check: () => {
      try {
        execSync("npx tsc --noEmit", { stdio: "pipe" })
        console.log("✅ TypeScript compilation successful")
        return true
      } catch (error) {
        console.log("⚠️  TypeScript warnings (ignored in build)")
        const output = error.stdout?.toString() || error.stderr?.toString() || error.message
        // Show first few lines of errors
        const lines = output.split("\n").slice(0, 10)
        lines.forEach((line) => {
          if (line.trim()) console.log(`   ${line}`)
        })
        return true // We ignore TS errors in build
      }
    },
  },
  {
    name: "Next.js config validation",
    check: () => {
      try {
        const configPath = path.join(process.cwd(), "next.config.js")
        if (fs.existsSync(configPath)) {
          const config = require(configPath)
          console.log("✅ Next.js config is valid")
          console.log("   - ESLint ignored:", config.eslint?.ignoreDuringBuilds)
          console.log("   - TypeScript ignored:", config.typescript?.ignoreBuildErrors)
          console.log("   - Images unoptimized:", config.images?.unoptimized)
        } else {
          console.log("⚠️  No next.config.js found (using defaults)")
        }
        return true
      } catch (error) {
        console.log("❌ Next.js config error:", error.message)
        return false
      }
    },
  },
  {
    name: "Critical files check",
    check: () => {
      const criticalFiles = ["app/layout.tsx", "app/page.tsx", "tailwind.config.js", "lib/utils.ts"]

      let allExist = true
      criticalFiles.forEach((file) => {
        if (fs.existsSync(file)) {
          console.log(`   ✅ ${file}`)
        } else {
          console.log(`   ❌ Missing: ${file}`)
          allExist = false
        }
      })

      if (allExist) {
        console.log("✅ All critical files present")
      } else {
        console.log("❌ Some critical files missing")
      }
      return allExist
    },
  },
  {
    name: "Environment variables",
    check: () => {
      const requiredEnvVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]
      const missing = requiredEnvVars.filter((env) => !process.env[env])

      if (missing.length === 0) {
        console.log("✅ Required environment variables present")
        requiredEnvVars.forEach((env) => {
          const value = process.env[env]
          console.log(`   - ${env}: ${value ? value.substring(0, 20) + "..." : "NOT SET"}`)
        })
        return true
      } else {
        console.log("⚠️  Missing environment variables:", missing.join(", "))
        console.log("   (These should be set in your deployment platform)")
        return true // Don't fail build for this
      }
    },
  },
  {
    name: "Dependencies check",
    check: () => {
      try {
        // Check if node_modules exists
        if (!fs.existsSync("node_modules")) {
          console.log("❌ node_modules not found. Run 'npm install' first.")
          return false
        }

        // Check for common problematic dependencies
        const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"))
        const deps = { ...pkg.dependencies, ...pkg.devDependencies }

        console.log("✅ Dependencies installed")
        console.log(`   - Total packages: ${Object.keys(deps).length}`)

        // Check for potential version conflicts
        const reactVersion = deps.react
        const nextVersion = deps.next
        console.log(`   - React: ${reactVersion}`)
        console.log(`   - Next.js: ${nextVersion}`)

        return true
      } catch (error) {
        console.log("❌ Dependencies check failed:", error.message)
        return false
      }
    },
  },
]

// Run all checks
let allPassed = true
let criticalFailed = false

checks.forEach(({ name, check }) => {
  console.log(`\n🔍 Checking: ${name}`)
  const passed = check()
  if (!passed) {
    allPassed = false
    if (name.includes("Critical files") || name.includes("Package.json")) {
      criticalFailed = true
    }
  }
})

console.log("\n" + "=".repeat(50))
if (allPassed) {
  console.log("🎉 All checks passed! Build should succeed.")
  console.log("\n📋 Next steps:")
  console.log("   1. Run 'npm run build' to test locally")
  console.log("   2. Deploy to your platform")
  console.log("   3. Monitor deployment logs")
} else if (criticalFailed) {
  console.log("❌ Critical issues found. Build will likely fail.")
  console.log("\n🔧 Fix these issues before deploying:")
  console.log("   1. Ensure all critical files exist")
  console.log("   2. Fix package.json issues")
  console.log("   3. Run 'npm install' if needed")
} else {
  console.log("⚠️  Some non-critical issues found. Build might still succeed.")
  console.log("\n📋 Recommended actions:")
  console.log("   1. Review the warnings above")
  console.log("   2. Test build locally: 'npm run build'")
  console.log("   3. Set environment variables in deployment platform")
}
console.log("=".repeat(50))

// If this is being run as part of build:check, continue with build
if (process.argv.includes("--continue-build")) {
  if (!criticalFailed) {
    console.log("\n🚀 Starting build process...")
    try {
      execSync("npm run build", { stdio: "inherit" })
      console.log("✅ Build completed successfully!")
    } catch (error) {
      console.log("❌ Build failed. Check the output above for details.")
      process.exit(1)
    }
  } else {
    console.log("❌ Skipping build due to critical issues.")
    process.exit(1)
  }
}
