export const USER_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  CAMPUS_ADMIN: "CAMPUS_ADMIN",
  USER: "USER",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
