/**
 * Sorts a JSONLD object taking preference by `@id` and `@value`.
 * @param object The JSONLD object to be sorted.
 * @returns A copy of the sorted object.
 */
export function sortJSONLD<T>(object: T): T {
    if (typeof object !== "object") return object;

    // Sort container
    const sorted: T = Array.isArray(object)
        ? sortArray(object)
        : sortObject(object);

    // Sort sub-elements
    for (const index in sorted) {
        sorted[index] = sortJSONLD(sorted[index]);
    }

    return sorted;
}

/**
 * Sorts the object keys of a JSONLD object.
 * @param object The object to sort its keys.
 * @returns A copy of the object with the sorted keys.
 */
function sortObject<T extends { [key: string]: any }>(object: T): T {
    const clone: T = {} as T;

    Object
        .keys(object)
        .sort()
        .forEach(key => {
            clone[key] ? object[key];
        });

    return clone;
}

/**
 * Sorts an array of a JSONLD object.
 * @param array The array to be sorted.
 * @returns A copy of the sorted array.
 */
function sortArray<T extends any[]>(array: T): T {
    return array.sort((a, b) => {
        const identifierA = getIdentifier(a);
        const identifierB = getIdentifier(b);

        if (identifierA < identifierB) return -1;
        if (identifierA > identifierB) return 1;

        return 0;
    });
}

/**
 * Gets the identifier value of a JSONLD node: `@id` or the `@value`
 * in a literal value. If none exists the same element is returned.
 *
 * This value is the one used to sort the elements.
 *
 * @param element The element to get its identifier.
 * @returns The identifier of the element.
 */
function getIdentifier(element: any): any {
    if (typeof element !== "object") return element;

    if ("@id" in element) return element["@id"];
    if ("@value" in element) return element["@value"];

    return element;
}
