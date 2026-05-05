export function getErrorMessage(error: any) {
  return "message" in error && typeof error.message === "string"
    ? error.message
    : `An error occurred: ${error}`;
}
