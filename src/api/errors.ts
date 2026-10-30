export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class AuthenticationError extends Error {
  constructor(message?: string) {
    super(message ?? "User not authenticated");
  }
}

export class AuthorizationError extends Error {
  constructor(message?: string) {
    super(message ?? "User not authorized");
  }
}

export class NotFoundError extends Error {
  constructor(message?: string) {
    super(message ?? "Not found"); // This isn't useful (what a 404 is); just here to do an optional param.
  }
}