import { describe, it, expect, beforeAll } from "vitest";
import { extractBearerToken, makeJWT, validateJWT } from "./auth.js";
import { hashPassword, checkPasswordHash } from "./auth.js";
import { AuthenticationError, BadRequestError } from "../api/errors.js";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });
});

describe("JWT creation and validation", () => {
  const userId = "123";
  const rightSecret = "right secret";
  const wrongSecret = "wrong secret";
  const expires = 10;
  let jwtString: string;

  it("should create a valid JWT", async () => {
    jwtString = makeJWT(userId, expires, rightSecret);
    expect(jwtString).not.toBeNull();
  });

  it("should return user ID", async () => {
    jwtString = makeJWT(userId, expires, rightSecret);
    const result = validateJWT(jwtString, rightSecret);
    expect(result).toEqual(userId);
  });

  it("should throw error on wrong secret", async () => {
    jwtString = makeJWT(userId, expires, rightSecret);
    expect(() => validateJWT(jwtString, wrongSecret)).toThrow(AuthenticationError);
  });

  it("should throw error on expired JWT", async () => {
    jwtString = makeJWT(userId, 0, rightSecret);
    expect(() => validateJWT(jwtString, rightSecret)).toThrow(AuthenticationError);
  });
});

describe("Bearer Extraction", () => {
  it("should return simple token string", async () => {
    const result = extractBearerToken("Bearer 123");
    expect(result).toBe("123");
  });

  it("should throw bad request error on empty string", async () => {
    expect(() => extractBearerToken("")).toThrow(BadRequestError);
  });

  it("should throw bad request error on missing token", async () => {
    expect(() => extractBearerToken("Bearer")).toThrow(BadRequestError);
  });

  it("should throw bad request error on missing Bearer", async () => {
    expect(() => extractBearerToken("123")).toThrow(BadRequestError);
  });

  it("should return token string despite spaces", async () => {
    const result = extractBearerToken(" Bearer    123  ");
    expect(result).toBe("123");
  });

  it("should return token string despite casing", async () => {
    const result = extractBearerToken("beAReR 123");
    expect(result).toBe("123");
  });
});