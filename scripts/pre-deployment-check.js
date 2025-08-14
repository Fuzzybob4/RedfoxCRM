#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

console.log("🚀 Pre-Deployment Check for RedFox CRM\n")

const checks = [
  {
    name: "Supabase Configuration",
    check: () => {
      const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
      const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      console.log(`   - Supabase URL: ${hasUrl ? "✅ Set" : "❌ Missing"}`)
      console.log(`   - Anon Key: ${hasAnonKey ? "✅ Set" : "❌ Missing"}`)

      if (hasUrl && hasAnonKey) {
        console.log(`   - URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30)}...`)
        console.log("✅ Supabase configuration complete")
        return true
      }

      console.log("❌ Supabase configuration incomplete")
      return false
    },
  },
  {
    name: "Authentication Flow Files",
    check: () => {
      const authFiles = [
        "app/login/page.tsx",
        "app/login/login-form.tsx",
        "app/signup/page.tsx",
        "app/signup/SignUpForm.tsx",
        "app/components/auth-provider.tsx",
        "middleware.ts",
        "lib/supabase.ts",
      ]

      let allExist = true
      authFiles.forEach((file) => {
        if (fs.existsSync(file)) {
          console.log(`   ✅ ${file}`)
        } else {
          console.log(`   ❌ Missing: ${file}`)
          allExist = false
        }
      })

      if (allExist) {
        console.log("✅ All authentication files present")
      }
      return allExist
    },
  },
  {
    name: "Dashboard Pages",
    check: () => {
      const dashboardPages = [
        "app/dashboard/page.tsx",
        "app/dashboard/[userId]/page.tsx",
        "app/customers/page.tsx",
        "app/sales/page.tsx",
        "app/invoices/page.tsx",
        "app/estimates/page.tsx",
        "app/projects/page.tsx",
      ]

      let allExist = true
      dashboardPages.forEach((file) => {
        if (fs.existsSync(file)) {
          console.log(`   ✅ ${file}`)
        } else {
          console.log(`   ❌ Missing: ${file}`)
          allExist = false
        }
      })

      if (allExist) {
        console.log("✅ All dashboard pages present")
      }
      return allExist
    },
  },
  {
    name: "Core Components",
    check: () => {
      const coreComponents = [
        "app/components/header.tsx",
        "app/components/footer.tsx",
        "app/components/side-menu.tsx",
        "app/layout.tsx",
        "app/page.tsx",
      ]

      let allExist = true
      coreComponents.forEach((file) => {
        if (fs.existsSync(file)) {
          console.log(`   ✅ ${file}`)
        } else {
          console.log(`   ❌ Missing: ${file}`)
          allExist = false
        }
      })

      if (allExist) {
        console.log("✅ All core components present")
      }
      return allExist
    },
  },
  {
    name: "Configuration Files",
    check: () => {
      const configFiles = ["next.config.js", "tailwind.config.js", "tsconfig.json", "package.json"]

      let allExist = true
      configFiles.forEach((file) => {
        if (fs.existsSync(file)) {
          console.log(`   ✅ ${file}`)
        } else {
          console.log(`   ❌ Missing: ${file}`)
          allExist = false
        }
      })

      if (allExist) {
        console.log("✅ All configuration files present")
      }
      return allExist
    },
  },
  {
    name: "Dependencies Check",
    check: () => {
      try {
        const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"))
        const deps = pkg.dependencies || {}

        const criticalDeps = [
          "next",
          "react",
          "react-dom",
          "@supabase/supabase-js",
          "@supabase/auth-helpers-nextjs",
          "tailwindcss",
          "lucide-react",
        ]

        let allPresent = true
        criticalDeps.forEach((dep) => {
          if (deps[dep]) {
            console.log(`   ✅ ${dep}: ${deps[dep]}`)
          } else {
            console.log(`   ❌ Missing: ${dep}`)
            allPresent = false
          }
        })

        if (allPresent) {
          console.log("✅ All critical dependencies present")
        }
        return allPresent
      } catch (error) {
        console.log("❌ Error reading package.json:", error.message)
        return false
      }
    },
  },
  {
    name: "Database Tables Required",
    check: () => {
      const requiredTables = ["profiles", "customers", "invoices", "estimates", "projects", "company_profiles"]

      console.log("   📋 Required Supabase tables:")
      requiredTables.forEach((table) => {
        console.log(`   - ${table}`)
      })

      console.log("   ⚠️  Please verify these exist in your Supabase dashboard")
      console.log("   💡 Tables should have RLS policies enabled")
      return true
    },
  },
  {
    name: "Build Test",
    check: () => {
      try {
        console.log("   🔨 Testing build process...")
        const { execSync } = require("child_process")

        // Check if node_modules exists
        if (!fs.existsSync("node_modules")) {
          console.log("   ⚠️  node_modules not found, running npm install...")
          execSync("npm install", { stdio: "inherit" })
        }

        // Test the build
        execSync("npm run build", { stdio: "pipe" })
        console.log("✅ Build successful")
        return true
      } catch (error) {
        console.log("❌ Build failed")
        const errorOutput = error.stdout?.toString() || error.stderr?.toString() || error.message
        console.log("   Error details:", errorOutput.substring(0, 300) + "...")
        return false
      }
    },
  },
]

// Run checks
let allPassed = true
let criticalFailed = false

checks.forEach(({ name, check }) => {
  console.log(`\n🔍 ${name}:`)
  try {
    const passed = check()
    if (!passed) {
      allPassed = false
      if (name.includes("Configuration") || name.includes("Dependencies") || name.includes("Build")) {
        criticalFailed = true
      }
    }
  } catch (error) {
    console.log(`   ❌ Check failed: ${error.message}`)
    allPassed = false
  }
})

console.log("\n" + "=".repeat(60))
if (allPassed) {
  console.log("🎉 Ready for deployment!")
  console.log("\n📋 Next steps:")
  console.log("   1. Commit and push to GitHub")
  console.log("   2. Connect repository to Vercel")
  console.log("   3. Set environment variables in Vercel:")
  console.log("      - NEXT_PUBLIC_SUPABASE_URL")
  console.log("      - NEXT_PUBLIC_SUPABASE_ANON_KEY")
  console.log("      - SUPABASE_SERVICE_ROLE_KEY (optional)")
  console.log("      - SUPABASE_JWT_SECRET (optional)")
  console.log("   4. Deploy and test authentication flow")
  console.log("\n🧪 After deployment, test:")
  console.log("   - Sign up new user")
  console.log("   - Login/logout")
  console.log("   - Dashboard navigation")
  console.log("   - All protected pages")
} else if (criticalFailed) {
  console.log("❌ Critical issues found - must fix before deploying")
  console.log("\n🔧 Priority fixes needed:")
  console.log("   1. Ensure all configuration files exist")
  console.log("   2. Install missing dependencies")
  console.log("   3. Fix build errors")
  console.log("   4. Set environment variables")
} else {
  console.log("⚠️  Some non-critical issues found")
  console.log("   Build might still succeed, but review warnings above")
}

console.log("=".repeat(60))

// Exit with appropriate code
process.exit(criticalFailed ? 1 : 0)
