import type { Api } from "~/utils/types";

export const useAuth = defineStore("auth", () => {
  const { pushNotification } = useNotifications();

  const authenticated = ref(false);
  const isDemo = ref(false);
  const loading = ref(false);
  const user = ref<{
    id: string;
    username: string;
    municipalities: { id: string; submitted: boolean }[];
  } | null>(null);

  const demoToken = ref<string | null>(null);
  const demoExp = ref(0);

  const selectedMunicipality = computed(() => user.value?.municipalities[0]);

  function enableDemo() {
    return new Promise((resolve, _reject) => {
      isDemo.value = true;
      authenticated.value = false;
      resolve(true);
    });
  }
  function disableDemo() {
    return new Promise((resolve, _reject) => {
      isDemo.value = false;
      demoToken.value = null;
      demoExp.value = 0;
      resolve(true);
    });
  }
  async function ensureDemoToken(skewSec = 10) {
    const now = Math.floor(Date.now() / 1000);
    if (!demoToken.value || demoExp.value - skewSec <= now) {
      const { token, exp } = await $fetch("/api/demoToken");
      demoToken.value = token;
      demoExp.value = exp;
    }
    return demoToken.value!;
  }

  async function getAuthorizationHeaders() {
    if (isDemo.value) {
      const demoToken = await ensureDemoToken();
      return { Authorization: `Bearer ${demoToken}` };
    }

    // Mock auth header for local admin
    const tokenCookie = useCookie("auth_token");
    if (tokenCookie.value === "mock_admin_token") {
      return { Authorization: "Bearer mock_admin_token" };
    }

    const { token } = await $apiRequest<Api.Response.Auth.Login>(
      "/auth/token",
      {
        method: "GET",
      },
    );

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async function authenticateUser(
    username: string,
    password: string,
    returnTo?: string,
  ) {
    // Mock login for local dev
    if (username === "admin" && password === "password") {
      loading.value = true;
      try {
        const tokenCookie = useCookie("auth_token");
        tokenCookie.value = "mock_admin_token";

        authenticated.value = true;
        user.value = {
          id: "admin-id",
          username: "admin",
          municipalities: [],
        };

        // Load mock municipalities
        await loadUserMunicipalities();

        pushNotification({
          type: "success",
          title: "Local Login Successful",
          message: "Welcome, admin (local)",
        });

        navigateTo(returnTo ?? "/");
        return;
      } finally {
        loading.value = false;
      }
    }

    try {
      loading.value = true;
      const { data } = await $apiRequest<Api.Response.Auth.Login>(
        "/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: {
            username,
            password,
          },
        },
      );

      authenticated.value = true;

      pushNotification({
        type: "success",
        title: "Autorisasjonen var vellykket",
        message: `Velkommen, ${data?.username ?? "user"}`,
      });

      navigateTo(returnTo ?? "/");
    } catch (error: any) {
      pushNotification({
        type: "error",
        title: "Autorisasjonsfeil",
        message: `${error.message}`,
      });
    } finally {
      loading.value = false;
    }
  }

  async function loadUserMunicipalities() {
    if (!user.value) return;
    const userMunicipalities = await fetchUserMunicipalities();
    if (!userMunicipalities?.length) return;
    user.value.municipalities = userMunicipalities.map((userMunicipality) => ({
      id: userMunicipality.municipality_id,
      submitted: userMunicipality.submitted,
    }));
  }

  async function fetchUserMunicipalities() {
    // Mock data for local admin
    const tokenCookie = useCookie("auth_token");
    if (tokenCookie.value === "mock_admin_token") {
      return [{ municipality_id: "0301", submitted: true }];
    }

    const authHeader = await getAuthorizationHeaders();
    const { data } =
      await $apiRequest<Api.Response.AreaData.UserMunicipalities>(
        "/area-data/user-municipalities",
        {
          method: "GET",
          headers: authHeader,
        },
      );

    return data;
  }

  async function getAuthUser() {
    try {
      if (isDemo.value) return false;

      // Restore session for local admin
      const tokenCookie = useCookie("auth_token");
      if (tokenCookie.value === "mock_admin_token") {
        authenticated.value = true;
        if (!user.value) {
          user.value = {
            id: "admin-id",
            username: "admin",
            municipalities: [],
          };
          await loadUserMunicipalities();
        }
        return true;
      }

      const authHeader = await getAuthorizationHeaders();

      const { data } = await $apiRequest<Api.Response.Auth.Login>(
        "/auth/user",
        {
          method: "GET",
          headers: authHeader,
        },
      );

      if (data) {
        user.value = {
          ...data,
          municipalities: [],
        };
        await loadUserMunicipalities();
        authenticated.value = true;
      } else if (authenticated.value) {
        logOut();
      }
    } catch (err) {
      if (authenticated.value) {
        logOut();
      }
    }

    return authenticated.value;
  }

  async function logOut(returnTo?: string) {
    await $apiRequest("/auth/logout", {
      method: "GET",
    });
    authenticated.value = false;
    user.value = null;
    pushNotification({
      type: "success",
      title: "Logg ut",
      message: "Du har logget ut",
    });
    navigateTo(returnTo || "/");
  }

  return {
    user,
    authenticated,
    isDemo,
    loading,

    selectedMunicipality,

    enableDemo,
    disableDemo,
    getAuthorizationHeaders,
    fetchUserMunicipalities,
    loadUserMunicipalities,
    authenticateUser,
    checkForToken: getAuthUser,
    logOut,
  };
});
