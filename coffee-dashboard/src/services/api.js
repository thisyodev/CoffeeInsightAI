const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";
const TENANT_ID = "retail-enterprise-01";

export async function fetchDashboard(lang = "th", branch = "asoke-01") {
  try {
    const res = await fetch(
      `${API_BASE_URL}/dashboard?lang=${lang}&branch=${branch}&t=${Date.now()}`,
      {
        method: "GET",
        headers: {
          "x-tenant-id": TENANT_ID,
          "x-branch-id": branch,
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
        cache: "no-store",
      },
    );
    if (!res.ok) throw new Error(`Backend error: ${res.status}`);
    const data = await res.json();
    console.log("✅ Dashboard data fetched from backend:", data);
    return data;
  } catch (error) {
    console.error("❌ Dashboard fetch failed:", error);
    throw error;
  }
}

export async function fetchBranches() {
  try {
    const res = await fetch(`${API_BASE_URL}/branches?t=${Date.now()}`, {
      method: "GET",
      headers: {
        "x-tenant-id": TENANT_ID,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Failed to fetch branches: ${res.status}`);
    const data = await res.json();
    console.log("✅ Branches fetched from backend:", data.data?.length || 0, "branches");
    return data;
  } catch (error) {
    console.error("❌ Branches fetch failed:", error);
    throw error;
  }
}

export async function simulateScenarios(
  scenarios = ["07:00", "07:30", "08:00"],
  branch = "asoke-01",
) {
  try {
    const res = await fetch(`${API_BASE_URL}/simulate-multi?t=${Date.now()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-tenant-id": TENANT_ID,
        "x-branch-id": branch,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
      body: JSON.stringify({ scenarios, branchId: branch }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Simulation failed: ${res.status}`);
    const data = await res.json();
    console.log("✅ Simulation results from backend:", data.data?.scenarios?.length || 0, "scenarios");
    return data;
  } catch (error) {
    console.error("❌ Simulation fetch failed:", error);
    throw error;
  }
}

export async function analyzeLocation(lat, lng, name = "New Territory") {
  try {
    const res = await fetch(`${API_BASE_URL}/location/analyze?t=${Date.now()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-tenant-id": TENANT_ID,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
      body: JSON.stringify({ lat, lng, name }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Location analysis failed: ${res.status}`);
    const data = await res.json();
    console.log("✅ Location analysis from backend:", data.branch_id);
    return data;
  } catch (error) {
    console.error("❌ Location analysis failed:", error);
    throw error;
  }
}

export async function fetchSimulationHistory(branchId = "asoke-01") {
  try {
    const res = await fetch(`${API_BASE_URL}/simulations/${branchId}/history?t=${Date.now()}`, {
      method: "GET",
      headers: {
        "x-tenant-id": TENANT_ID,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`History fetch failed: ${res.status}`);
    const data = await res.json();
    console.log("✅ Simulation history from backend:", data.data?.length || 0, "records");
    return data;
  } catch (error) {
    console.error("❌ Simulation history fetch failed:", error);
    throw error;
  }
}
