import { describe, it, expect } from "vitest";
import { calculateStopFromColor } from "./helpers";
import {
  BASELINE_LINEAR_PALETTE_1E70F6_STOP500,
  BASELINE_PERCEIVED_PALETTE_1E70F6_STOP500,
} from "./testHelpers";

describe("calculateStopFromColor", () => {
  it("should calculate correct stop in linear mode", () => {
    const stop50 = BASELINE_LINEAR_PALETTE_1E70F6_STOP500.find(
      (s) => s.stop === 50,
    );
    const stop500 = BASELINE_LINEAR_PALETTE_1E70F6_STOP500.find(
      (s) => s.stop === 500,
    );
    const stop950 = BASELINE_LINEAR_PALETTE_1E70F6_STOP500.find(
      (s) => s.stop === 950,
    );

    if (!stop50 || !stop500 || !stop950) {
      throw new Error("Stop not found");
    }

    // Test with baseline colors
    expect(calculateStopFromColor(stop50.hex, "linear")).toBe(50); // Lightest
    expect(calculateStopFromColor(stop500.hex, "linear")).toBe(500); // Input color
    expect(calculateStopFromColor(stop950.hex, "linear")).toBe(950); // Darkest

    // Test with intermediate colors
    const stop300 = BASELINE_LINEAR_PALETTE_1E70F6_STOP500.find(
      (s) => s.stop === 300,
    );
    const stop700 = BASELINE_LINEAR_PALETTE_1E70F6_STOP500.find(
      (s) => s.stop === 700,
    );
    if (!stop300 || !stop700) {
      throw new Error("Stop not found");
    }
    expect(calculateStopFromColor(stop300.hex, "linear")).toBe(300);
    expect(calculateStopFromColor(stop700.hex, "linear")).toBe(700);
  });

  it("should calculate correct stop in perceived mode", () => {
    const stop50 = BASELINE_PERCEIVED_PALETTE_1E70F6_STOP500.find(
      (s) => s.stop === 50,
    );
    const stop500 = BASELINE_PERCEIVED_PALETTE_1E70F6_STOP500.find(
      (s) => s.stop === 500,
    );
    const stop950 = BASELINE_PERCEIVED_PALETTE_1E70F6_STOP500.find(
      (s) => s.stop === 950,
    );

    if (!stop50 || !stop500 || !stop950) {
      throw new Error("Stop not found");
    }

    // Test with baseline colors
    expect(calculateStopFromColor(stop50.hex, "perceived")).toBe(50); // Lightest
    expect(calculateStopFromColor(stop500.hex, "perceived")).toBe(500); // Input color
    expect(calculateStopFromColor(stop950.hex, "perceived")).toBe(950); // Darkest

    // Test with intermediate colors
    const stop300 = BASELINE_PERCEIVED_PALETTE_1E70F6_STOP500.find(
      (s) => s.stop === 300,
    );
    const stop700 = BASELINE_PERCEIVED_PALETTE_1E70F6_STOP500.find(
      (s) => s.stop === 700,
    );
    if (!stop300 || !stop700) {
      throw new Error("Stop not found");
    }
    expect(calculateStopFromColor(stop300.hex, "perceived")).toBe(300);
    expect(calculateStopFromColor(stop700.hex, "perceived")).toBe(700);
  });

  it("should handle colors with or without # prefix", () => {
    expect(calculateStopFromColor("#FFFFFF", "linear")).toBe(
      calculateStopFromColor("FFFFFF", "linear"),
    );
    expect(calculateStopFromColor("#000000", "perceived")).toBe(
      calculateStopFromColor("000000", "perceived"),
    );
  });

  it("should round to nearest available stop", () => {
    // Test colors that should round to specific stops
    const testCases: Array<{
      color: string;
      mode: "linear" | "perceived";
      expectedStop: number;
    }> = [
      { color: "#E8F0FE", mode: "linear", expectedStop: 50 }, // Very light blue
      { color: "#D3E3FD", mode: "linear", expectedStop: 100 }, // Light blue
      { color: "#A7C7FB", mode: "linear", expectedStop: 200 }, // Medium-light blue
      { color: "#76A8FA", mode: "linear", expectedStop: 300 }, // Medium blue
      { color: "#4A8CF8", mode: "linear", expectedStop: 400 }, // Medium-dark blue
      { color: "#1E70F6", mode: "linear", expectedStop: 500 }, // Base blue
      { color: "#0856D3", mode: "linear", expectedStop: 600 }, // Dark blue
      { color: "#06409D", mode: "linear", expectedStop: 700 }, // Darker blue
      { color: "#042C6C", mode: "linear", expectedStop: 800 }, // Very dark blue
      { color: "#021636", mode: "linear", expectedStop: 900 }, // Almost black blue
      { color: "#010A19", mode: "linear", expectedStop: 950 }, // Nearly black blue
    ];

    testCases.forEach(({ color, mode, expectedStop }) => {
      expect(calculateStopFromColor(color, mode)).toBe(expectedStop);
    });
  });
});
