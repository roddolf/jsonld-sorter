import { sortJSONLD } from "./index";

describe("sortJSONLD", () => {
    test("should return number", () => {
        const returned = sortJSONLD(10);
        expect(returned).toBe(10);
    });

    test("should return string", () => {
        const returned = sortJSONLD("string");
        expect(returned).toBe("string");
    });

    test("should order array of strings", () => {
        const returned = sortJSONLD(["string 1", "string 0", "string 3"]);
        expect(returned).toEqual(["string 0", "string 1", "string 3"]);
    });

    test("should order object keys", () => {
        const returned = sortJSONLD({
            key1: "value",
            key0: "value",
            key3: "value",
        });
        const keys = Object.keys(returned);
        expect(keys).toEqual(["key0", "key1", "key3"]);
    });

    test("should order array of JSONLD nodes", () => {
        const returned = sortJSONLD([
            { "@id": "http://example.com/resource-1/" },
            { "@id": "http://example.com/resource-0/" },
            { "@id": "http://example.com/resource-3/" },
        ]);
        expect(returned).toEqual([
            { "@id": "http://example.com/resource-0/" },
            { "@id": "http://example.com/resource-1/" },
            { "@id": "http://example.com/resource-3/" },
        ]);
    });

    test("should order array of JSONLD values", () => {
        const returned = sortJSONLD([
            { "@value": "Value 1" },
            { "@value": "Value 0" },
            { "@value": "Value 3" },
            { "@value": "Value 1" },
        ]);
        expect(returned).toEqual([
            { "@value": "Value 0" },
            { "@value": "Value 1" },
            { "@value": "Value 1" },
            { "@value": "Value 3" },
        ]);
    });

    test("should order sub-elements", () => {
        const returned = sortJSONLD([
            {
                "@id": "https://example.com/resource-1/",
                "@graph": [
                    { "@id": "https://example.com/resource-1/#named-fragment" },
                    { "@id": "https://example.com/resource-1/" },
                    { "@id": "_:blank-node-1" },
                ],
            },
            {
                "@id": "https://example.com/resource-0/",
                "@graph": [
                    { "@id": "_:blank-node-0" },
                    { "@id": "https://example.com/resource-0/#named-fragment" },
                    { "@id": "https://example.com/resource-0/" },
                ],
            },
            {
                "@graph": [
                    { "@id": "https://example.com/resource-3/#named-fragment" },
                    { "@id": "_:blank-node-3" },
                    { "@id": "https://example.com/resource-3/" },
                ],
            },
        ]);
        expect(returned).toEqual([
            {
                "@id": "https://example.com/resource-0/",
                "@graph": [
                    { "@id": "_:blank-node-0" },
                    { "@id": "https://example.com/resource-0/" },
                    { "@id": "https://example.com/resource-0/#named-fragment" },
                ],
            },
            {
                "@id": "https://example.com/resource-1/",
                "@graph": [
                    { "@id": "_:blank-node-1" },
                    { "@id": "https://example.com/resource-1/" },
                    { "@id": "https://example.com/resource-1/#named-fragment" },
                ],
            },
            {
                "@graph": [
                    { "@id": "_:blank-node-3" },
                    { "@id": "https://example.com/resource-3/" },
                    { "@id": "https://example.com/resource-3/#named-fragment" },
                ],
            },
        ]);
    });
});
