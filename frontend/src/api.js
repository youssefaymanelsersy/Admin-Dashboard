const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000").replace(/\/$/, "");

export async function apiRequest(path, options = {}) {
    const token = localStorage.getItem("token");
    const url = `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;

    let res;

    try {
        res = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...options.headers,
            },
        });
    } catch (err) {
        throw new Error("Network error: unable to reach API " + err.message);
    }

    let data = null;
    try {
        data = await res.json();
    } catch (err) {
        // Non-JSON response, leave data as null
        throw new Error("Invalid JSON response from API" + err.message);
    }

    if (!res.ok) {
        throw new Error((data && data.error) || `Request failed (${res.status})`);
    }

    return data;
}

export async function toggleUserActive(userId, isActive) {
    return apiRequest(`/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify({ is_active: !isActive }),
    });
}

export async function fetchActivityLogs() {
    return apiRequest("/logs");
}
