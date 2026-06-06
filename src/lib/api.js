import { authClient } from "@/lib/auth-client";

const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getBetterAuthToken() {
    try {
        const { data, error } = await authClient.getSession();

        if (error || !data?.session) {
            return null;
        }

        const tokenResponse = await authClient.token();

        if (tokenResponse?.data?.token) {
            return tokenResponse.data.token;
        }

        return null;
    } catch (err) {
        console.error("Failed to get Better Auth JWT:", err);
        return null;
    }
}

export async function apiFetch(endpoint, options = {}) {
    const token = await getBetterAuthToken();

    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const config = {
        ...options,
        headers,
    };

    const response = await fetch(`${API_BASE}${endpoint}`, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({
            error: "An unexpected error occurred",
        }));
        throw new Error(
            errorData.error || `HTTP error: ${response.status}`
        );
    }

    return response.json();
}

export async function registerUserInDB(userData) {
    const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const err = await response
            .json()
            .catch(() => ({ error: "Registration failed" }));
        throw new Error(err.error || "Registration failed");
    }

    return response.json();
}

export async function getAllPets(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.set("search", params.search);
    if (params.species) searchParams.set("species", params.species);
    if (params.sort) searchParams.set("sort", params.sort);
    const queryString = searchParams.toString();
    const endpoint = `/api/pets${queryString ? `?${queryString}` : ""}`;
    return apiFetch(endpoint);
}

export async function getFeaturedPets() {
    return apiFetch("/api/pets/featured");
}

export async function getPetById(id) {
    return apiFetch(`/api/pets/${id}`);
}

export async function getOwnerPets(email) {
    return apiFetch(`/api/pets/owner/${encodeURIComponent(email)}`);
}

export async function addPet(petData) {
    return apiFetch("/api/pets", {
        method: "POST",
        body: JSON.stringify(petData),
    });
}

export async function updatePet(id, petData) {
    return apiFetch(`/api/pets/${id}`, {
        method: "PUT",
        body: JSON.stringify(petData),
    });
}

export async function deletePet(id) {
    return apiFetch(`/api/pets/${id}`, {
        method: "DELETE",
    });
}

export async function incrementPetView(id) {
    return apiFetch(`/api/pets/${id}/increment-view`, {
        method: "PATCH",
    });
}

export async function submitAdoptionRequest(requestData) {
    return apiFetch("/api/requests", {
        method: "POST",
        body: JSON.stringify(requestData),
    });
}

export async function getUserRequests(email) {
    return apiFetch(
        `/api/requests/user/${encodeURIComponent(email)}`
    );
}

export async function getPetRequests(petId) {
    return apiFetch(`/api/requests/pet/${petId}`);
}

export async function updateRequestStatus(requestId, status) {
    return apiFetch(`/api/requests/${requestId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    });
}

export async function cancelRequest(requestId) {
    return apiFetch(`/api/requests/${requestId}`, {
        method: "DELETE",
    });
}