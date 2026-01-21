const API_BASE = "https://increased-jody-youssef-org-43ede976.koyeb.app";

export async function apiRequest(path, options = {}) {
    const token = localStorage.getItem("token");

    const res = await fetch(API_BASE + path, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Request failed");
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
