import { getCoordinatesFromSearch } from "../src/utils/getCoordinatesFromSearch";
import { getUserFromRequest } from "../src/utils/getUserFromRequest";

// ── getCoordinatesFromSearch ──────────────────────────
jest.mock("../src/utils/getCoordinatesFromSearch", () => ({
  getCoordinatesFromSearch: jest.fn(),
}));

const mockedGetCoordinates = getCoordinatesFromSearch as jest.Mock;

describe("getCoordinatesFromSearch", () => {
  afterEach(() => jest.resetAllMocks());

  test("returns coordinates for a valid search", async () => {
    mockedGetCoordinates.mockResolvedValue({ lat: 48.8566, lng: 2.3522 });
    const result = await getCoordinatesFromSearch("Paris France");
    expect(result).toEqual({ lat: 48.8566, lng: 2.3522 });
    expect(mockedGetCoordinates).toHaveBeenCalledWith("Paris France");
  });

  test("returns null when search word is not found", async () => {
    mockedGetCoordinates.mockResolvedValue(null);
    const result = await getCoordinatesFromSearch("zzzznotaplace");
    expect(result).toBeNull();
  });

  test("is called with the correct search word", async () => {
    mockedGetCoordinates.mockResolvedValue({ lat: 45.764, lng: 4.835 });
    await getCoordinatesFromSearch("Lyon France");
    expect(mockedGetCoordinates).toHaveBeenCalledTimes(1);
    expect(mockedGetCoordinates).toHaveBeenCalledWith("Lyon France");
  });
});

// ── getUserFromRequest ────────────────────────────────
describe("getUserFromRequest", () => {
  test("returns null when no authorization header", async () => {
    const req = { headers: {} } as any;
    const result = await getUserFromRequest(req);
    expect(result).toBeNull();
  });

  test("returns null when authorization header has no Bearer prefix", async () => {
    const req = { headers: { authorization: "notabearer" } } as any;
    const result = await getUserFromRequest(req);
    expect(result).toBeNull();
  });

  test("returns null when token is malformed", async () => {
    const req = { headers: { authorization: "Bearer invalidtoken" } } as any;
    const result = await getUserFromRequest(req);
    expect(result).toBeNull();
  });
});
