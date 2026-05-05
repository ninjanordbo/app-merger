const PROTECTED_ROUTES = ["/sonebygger", "/dashboard"];
const EXCEPTION_ROUTES = ["/login"];

export default defineNuxtRouteMiddleware(async (to) => {
  if (
    !PROTECTED_ROUTES.find((route) => to.path.includes(route)) ||
    EXCEPTION_ROUTES.find((exceptionRoute) => exceptionRoute === to.path)
  ) {
    return;
  }

  // Prototype mode: auto-authenticate as mock admin, no login required
  const auth = useAuth();
  if (!auth.authenticated) {
    const tokenCookie = useCookie("auth_token");
    tokenCookie.value = "mock_admin_token";
    auth.authenticated = true;
    auth.user = {
      id: "admin-id",
      username: "Nina",
      municipalities: [{ id: "0301", submitted: true }],
    };
  }
});
