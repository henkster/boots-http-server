export class BadRequesError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class AuthenticationError extends Error {
  constructor() {
    super("User not authenticated");
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message ?? "User not authorized");
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}