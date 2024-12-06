type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

const BASE_URL = "http://localhost:3000";

async function refreshToken() {
  try {
    const response = await fetch(`${BASE_URL}/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: sessionStorage.getItem("rt"),
      }),
    });

    if (!response.ok) throw new Error("Refresh failed");

    const data = await response.json();
    sessionStorage.setItem("at", data.accessToken);
    sessionStorage.setItem("attime", data.accessTokenExpiry);

    return data.accessToken;
  } catch (error) {
    sessionStorage.clear();
    window.location.href = "/login";
    throw error;
  }
}

async function fetchWithAuth(
  url: string,
  method: RequestMethod = "GET",
  body?: any
) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // 토큰 만료 체크
  const tokenExpiry = sessionStorage.getItem("attime");
  if (tokenExpiry && new Date(tokenExpiry) <= new Date()) {
    await refreshToken();
  }

  // 액세스 토큰 추가
  const accessToken = sessionStorage.getItem("at");
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      method,
      headers,
      ...(body && { body: JSON.stringify(body) }),
    });

    // 401 에러시 토큰 리프레시 후 재시도
    if (response.status === 401) {
      await refreshToken();
      // 재시도
      return fetch(`${BASE_URL}${url}`, {
        method,
        headers: {
          ...headers,
          Authorization: `Bearer ${sessionStorage.getItem("at")}`,
        },
        ...(body && { body: JSON.stringify(body) }),
      });
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export const fetchClient = {
  get: (url: string) => fetchWithAuth(url, "GET"),
  post: (url: string, body: any) => fetchWithAuth(url, "POST", body),
  put: (url: string, body: any) => fetchWithAuth(url, "PUT", body),
  delete: (url: string) => fetchWithAuth(url, "DELETE"),
};
