var assert = require('assert');
const { default: formatClock } = require('./formatClock');

describe('formatClock', () => {
    it("should test a few variations", () => {
        const sec15 = formatClock(15);
        assert(formatClock(15) === "00:00:15", "15 seconds not formatted properly");
        assert(formatClock(60 + 15) === "00:01:15", "seconds not formatted properly");
        assert(formatClock(60 * 60 + 15) === "01:00:15", "seconds not formatted properly");
        assert(formatClock(60 * 60 + 60 + 15) === "01:01:15", "seconds not formatted properly");
    });
});
