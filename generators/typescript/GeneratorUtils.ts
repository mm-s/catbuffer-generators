/**
 * Generator utility class.
 */
export class GeneratorUtils {

    /**
     * Convert a UInt8Array input into BigInt.
     * @param {Uint8Array} input A uint8 array.
     * @returns {BigInt} The BigInt representation of the input.
     */
    public static bufferToBigInt(input: Uint8Array): BigInt {
        if (8 !== input.length) {
            throw Error(`byte array has unexpected size '${input.length}'`);
        }
        input = input.reverse();
        const Nibble_To_Char_Map = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
        let s = '';
        for (const byte of input) {
            s += Nibble_To_Char_Map[byte >> 4];
            s += Nibble_To_Char_Map[byte & 0x0F];
        }

        return BigInt(s);
    }
    /**
     * Read 4 bytes as a uint32 value from buffer bytes starting at given index.
     * @param {Uint8Array} bytes A uint8 array.
     * @param {number} index Index.
     * @returns {number} 32bits integer.
     */
    public static readUint32At(bytes: Uint8Array, index: number): number {
        return (bytes[index] + (bytes[index + 1] << 8) + (bytes[index + 2] << 16) + (bytes[index + 3] << 24)) >>> 0;
    }

    /**
     * Convert uint value into buffer
     * @param {number} uintValue A uint8 array.
     * @param {number} bufferSize Buffer size.
     * @returns {Uint8Array}
     */
    public static uintToBuffer(uintValue: number, bufferSize: number): Uint8Array {
        const buffer = new ArrayBuffer(bufferSize);
		const dataView = new DataView(buffer);
		try {
			if (1 === bufferSize) {
				dataView.setUint8(0, uintValue);
			} else if (2 === bufferSize) {
				dataView.setUint16(0, uintValue, true);
			} else if (4 === bufferSize) {
				dataView.setUint32(0, uintValue, true);
			} else {
				throw new Error('Unexpected bufferSize');
			}
			return new Uint8Array(buffer);
		}
		catch (e) {
			throw new Error(`Converting uint value ${uintValue} into buffer with error: ${e}`);
		}
    }

    /**
     * Convert uint8 array buffer into number
     * @param {Uint8Array} buffer A uint8 array.
     * @returns {number}
     */
    public static bufferToUint(buffer: Uint8Array): number {
		const dataView = new DataView(buffer.buffer);
		try {
			if (1 === buffer.byteLength) {
				return dataView.getUint8(0);
			} else if (2 === buffer.byteLength) {
				return dataView.getUint16(0, true);
			} else if (4 === buffer.byteLength) {
				return dataView.getUint32(0, true);
			}
			throw new Error('Unexpected buffer size');
		}
		catch (e) {
			throw new Error(`Converting buffer into number with error: ${e}`);
		}
    }

    /**
     * Convert BigInt into buffer
     * @param {BigInt} input bigint value.
     * @returns {Uint8Array}
     */
    public static bigIntToBuffer(input: BigInt): Uint8Array {
        const hex = input.toString(16).padStart(16, '0');
        const len = hex.length / 2;
        const uint8 = new Uint8Array(len);

        let i = 0;
        let j = 0;
        while (i < len) {
            uint8[i] = parseInt(hex.slice(j, j + 2), 16);
            i += 1;
            j += 2;
        }
        return uint8;
    }

    /**
     * Concatenate two arrays
     * @param {Uint8Array} array1 A Uint8Array.
     * @param {Uint8Array} array2 A Uint8Array.
     * @returns {Uint8Array}
     */
    public static concatTypedArrays(array1: Uint8Array, array2: Uint8Array): Uint8Array {
        const newArray = new Uint8Array(array1.length + array2.length);
        newArray.set(array1);
        newArray.set(array2, array1.length);
        return newArray;
    }

    /** Converts an unsigned byte to a signed byte with the same binary representation.
     * @param {number} input An unsigned byte.
     * @returns {number} A signed byte with the same binary representation as the input.
     *
     */
    public static uint8ToInt8 = (input: number): number => {
        if (0xFF < input) {
            throw Error(`input '${input}' is out of range`);
        }
        return input << 24 >> 24;
    }

    /** Get bytes by given sub array size.
     * @param {Uint8Array} binary Binary bytes array.
     * @param {number} size Subarray size.
     * @returns {Uint8Array}
     *
     */
    public static getBytes(binary: Uint8Array, size: number): Uint8Array {
        if (size > binary.length) {
            throw new RangeError();
        }
        const bytes = binary.slice(0, size);
        return bytes;
    }

    /**
     * Gets the padding size that rounds up \a size to the next multiple of \a alignment.
     * @param size Inner transaction size
     * @param alignment Next multiple alignment
     */
    public static getTransactionPaddingSize(size: number, alignment: number): number {
        return 0 === size % alignment ? 0 : alignment - (size % alignment);
    }

    /**
     * Tries to compact a uint64 into a simple numeric.
     * @param {module:coders/uint64~uint64} uint64 A uint64 value.
     * @returns {number|module:coders/uint64~uint64}
     * A numeric if the uint64 is no greater than Number.MAX_SAFE_INTEGER or the original uint64 value otherwise.
     */
    public static compact (uint64: number[]) {
        const low = uint64[0];
        const high = uint64[1];
        // don't compact if the value is >= 2^53
        if (0x00200000 <= high) {
            return uint64;
        }
        // multiply because javascript bit operations operate on 32bit values
        return (high * 0x100000000) + low;
    }

    /**
     * Converts a numeric unsigned integer into a uint64.
     * @param {number} number The unsigned integer.
     * @returns {module:coders/uint64~uint64} The uint64 representation of the input.
     */
    public static fromUint(number: number): number[] {
        const value = [(number & 0xFFFFFFFF) >>> 0, (number / 0x100000000) >>> 0];
        return value;
    }
}