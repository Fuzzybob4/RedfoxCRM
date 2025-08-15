import { supabase } from "./supabase"
import type { Role } from "./types"

export interface EmployeeManagementResult {
  success: boolean
  message: string
  data?: any
}

/**
 * Deactivate an employee's access to the organization
 */
export async function deactivateEmployee(orgId: string, userId: string): Promise<EmployeeManagementResult> {
  try {
    const { data: currentUser } = await supabase.auth.getUser()
    if (!currentUser.user) {
      return { success: false, message: "Not authenticated" }
    }

    // Call the database function to safely deactivate
    const { data, error } = await supabase.rpc("deactivate_employee", {
      p_org_id: orgId,
      p_user_id: userId,
      p_terminated_by: currentUser.user.id,
    })

    if (error) {
      return { success: false, message: error.message }
    }

    return {
      success: true,
      message: "Employee access has been deactivated successfully",
      data,
    }
  } catch (error) {
    console.error("Error deactivating employee:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

/**
 * Reactivate an employee's access to the organization
 */
export async function reactivateEmployee(orgId: string, userId: string): Promise<EmployeeManagementResult> {
  try {
    const { data: currentUser } = await supabase.auth.getUser()
    if (!currentUser.user) {
      return { success: false, message: "Not authenticated" }
    }

    // Call the database function to safely reactivate
    const { data, error } = await supabase.rpc("reactivate_employee", {
      p_org_id: orgId,
      p_user_id: userId,
      p_reactivated_by: currentUser.user.id,
    })

    if (error) {
      return { success: false, message: error.message }
    }

    return {
      success: true,
      message: "Employee access has been restored successfully",
      data,
    }
  } catch (error) {
    console.error("Error reactivating employee:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

/**
 * Get all employees for an organization
 */
export async function getOrganizationEmployees(orgId: string): Promise<EmployeeManagementResult> {
  try {
    const { data, error } = await supabase
      .from("memberships")
      .select(`
        *,
        profiles:user_id (
          id,
          email,
          full_name,
          avatar_url
        )
      `)
      .eq("org_id", orgId)
      .order("created_at", { ascending: false })

    if (error) {
      return { success: false, message: error.message }
    }

    return {
      success: true,
      message: "Employees retrieved successfully",
      data,
    }
  } catch (error) {
    console.error("Error getting employees:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

/**
 * Update employee role and permissions
 */
export async function updateEmployeeRole(
  orgId: string,
  userId: string,
  newRole: Role,
  department?: string,
  jobTitle?: string,
): Promise<EmployeeManagementResult> {
  try {
    const { data: currentUser } = await supabase.auth.getUser()
    if (!currentUser.user) {
      return { success: false, message: "Not authenticated" }
    }

    // Check if current user has permission to update roles
    const { data: currentMembership } = await supabase
      .from("memberships")
      .select("role")
      .eq("org_id", orgId)
      .eq("user_id", currentUser.user.id)
      .eq("is_active", true)
      .single()

    if (!currentMembership || !["owner", "admin"].includes(currentMembership.role)) {
      return { success: false, message: "Insufficient permissions to update employee roles" }
    }

    // Update the membership
    const { data, error } = await supabase
      .from("memberships")
      .update({
        role: newRole,
        department,
        job_title: jobTitle,
        updated_at: new Date().toISOString(),
      })
      .eq("org_id", orgId)
      .eq("user_id", userId)
      .select()
      .single()

    if (error) {
      return { success: false, message: error.message }
    }

    return {
      success: true,
      message: "Employee role updated successfully",
      data,
    }
  } catch (error) {
    console.error("Error updating employee role:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

/**
 * Get employee activity log
 */
export async function getEmployeeActivity(
  orgId: string,
  userId?: string,
  limit = 50,
): Promise<EmployeeManagementResult> {
  try {
    let query = supabase
      .from("activity_log")
      .select(`
        *,
        profiles:user_id (
          full_name,
          email
        )
      `)
      .eq("org_id", orgId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (userId) {
      query = query.eq("user_id", userId)
    }

    const { data, error } = await query

    if (error) {
      return { success: false, message: error.message }
    }

    return {
      success: true,
      message: "Activity log retrieved successfully",
      data,
    }
  } catch (error) {
    console.error("Error getting activity log:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}
